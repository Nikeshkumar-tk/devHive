import { createResourceName } from '@dev-hive/aws';
import { buildLambdaDirEntry } from '@dev-hive/aws/lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { LAMBDA_TIMEOUT, RESOURCE_NAMES } from '../constants';
import { RestApiCostructProps } from './types';
import { Duration } from 'aws-cdk-lib';

export class RestApi extends Construct {
    public readonly api: apigateway.RestApi;
    public readonly functions: lambda.IFunction[] = [];

    constructor(scope: Construct, id: string, props: RestApiCostructProps) {
        super(scope, id);

        this.api = new apigateway.RestApi(this, createResourceName(props.apiName), {
            restApiName: createResourceName(props.apiName),
            description: props.description,
            deployOptions: {
                stageName: process.env.STAGE || 'dev',
            },
        });

        // Commenting this for now will bring the lambda layer back later
        // const lambdaLayer = new lambda.LayerVersion(this, 'lambda-layer', {
        //     code: lambda.Code.fromAsset('dist/layers'),
        //     compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
        //     description: 'Lambda layer for shared code',
        //     removalPolicy: RemovalPolicy.DESTROY,
        // });

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
                },
                timeout: Duration.seconds(LAMBDA_TIMEOUT),
            });

            const resource = this.api.root.addResource(handler.config.resource);

            const lambdaIntegration = new apigateway.LambdaIntegration(lambdaFunction);

            handler.config.methods.forEach((methodConfig) => {
                const methodName = methodConfig.method.toUpperCase();

                resource.addMethod(methodName, lambdaIntegration);
            });
            this.functions.push(lambdaFunction);
        });
    }
}
