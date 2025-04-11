import { createResourceName } from '@dev-hive/aws';
import { buildLambdaDirEntry, RestApiLambdaConfiguration } from '@dev-hive/aws/lambda';
import { Duration, RemovalPolicy } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import path from 'path';
import { LAMBDA_TIMEOUT, RESOURCE_NAMES } from '../constants';
import { RestApiCostructProps } from './types';
export class RestApi extends Construct {
    public readonly api: apigateway.RestApi;
    public readonly functions: lambda.IFunction[] = [];
    public readonly authorizer: apigateway.TokenAuthorizer;

    constructor(scope: Construct, id: string, props: RestApiCostructProps) {
        super(scope, id);

        this.api = new apigateway.RestApi(this, createResourceName(props.apiName), {
            restApiName: createResourceName(props.apiName),
            description: props.description,
            deployOptions: {
                stageName: process.env.STAGE || 'dev',
            },
        });

        const lambdaLayer = new lambda.LayerVersion(this, 'lambda-layer', {
            code: lambda.Code.fromAsset(
                path.resolve(__dirname, '../../../../../../packages/layers/dist'),
            ),
            compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
            description: 'Lambda layer for shared code',
            removalPolicy: RemovalPolicy.DESTROY,
        });

        const authorizerLambda = new NodejsFunction(this, 'dh-authorizer', {
            entry: 'src/lambdas/authorizer/index.ts',
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_18_X,
            functionName: createResourceName('authorizer'),
            bundling: {
                minify: true,
                bundleAwsSDK: false,
            },
            logRetention: RetentionDays.ONE_WEEK,
            environment: {
                ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
            },
        });

        this.authorizer = new apigateway.TokenAuthorizer(this, 'dh-token-authorizer', {
            handler: authorizerLambda,
            identitySource: apigateway.IdentitySource.header('Authorization'),
            authorizerName: createResourceName('api-authorizer'),
        });

        this.authorizer._attachToApi(this.api);

        Object.entries(props.restApiLambdas).forEach(([_, handler]) => {
            const functionName = createResourceName(handler.config.functionName);

            const lambdaFunction = new NodejsFunction(this, functionName, {
                entry: buildLambdaDirEntry(handler.config.functionName),
                handler: 'index.handler',
                runtime: lambda.Runtime.NODEJS_18_X,
                functionName,
                bundling: {
                    minify: true,
                    bundleAwsSDK: false,
                },
                environment: {
                    DYNAMODB_TABLE_NAME: createResourceName(RESOURCE_NAMES.DYNAMODB_TABLE),
                    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
                    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
                },
                timeout: Duration.seconds(LAMBDA_TIMEOUT),
                layers: [lambdaLayer],
            });

            const lambdaIntegration = new apigateway.LambdaIntegration(lambdaFunction);

            // Create a recursive function to add resources
            const addResourceRecursively = (
                parentResource: apigateway.IResource,
                resourceConfig: RestApiLambdaConfiguration['resourceConfig'],
            ): apigateway.IResource => {
                const resource = parentResource.addResource(resourceConfig.path);

                resourceConfig.methods.forEach((method) => {
                    const methodName = method.toUpperCase();
                    if (resourceConfig.protected) {
                        resource.addMethod(methodName, lambdaIntegration, {
                            authorizationType: apigateway.AuthorizationType.CUSTOM,
                            authorizer: this.authorizer,
                        });
                        return;
                    }
                    resource.addMethod(methodName, lambdaIntegration);
                });

                if (resourceConfig.children && resourceConfig.children.length > 0) {
                    resourceConfig.children.forEach((child) => {
                        addResourceRecursively(resource, child);
                    });
                }

                return resource;
            };

            // Create the main resource and add children recursively
            const resource = this.api.root.addResource(handler.config.resourceConfig.path);

            // Add methods to the main resource
            handler.config.resourceConfig.methods.forEach((method) => {
                const methodName = method.toUpperCase();
                if (handler.config.resourceConfig.protected) {
                    resource.addMethod(methodName, lambdaIntegration, {
                        authorizationType: apigateway.AuthorizationType.CUSTOM,
                        authorizer: this.authorizer,
                    });
                    return;
                }
                resource.addMethod(methodName, lambdaIntegration);
            });

            if (
                handler.config.resourceConfig.children &&
                handler.config.resourceConfig.children.length > 0
            ) {
                handler.config.resourceConfig.children.forEach((child) => {
                    addResourceRecursively(resource, child);
                });
            }

            this.functions.push(lambdaFunction);
        });
    }
}
