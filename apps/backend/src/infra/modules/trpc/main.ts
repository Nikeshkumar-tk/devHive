import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { createResourceName } from '@dev-hive/aws';
import { trpcApiLambdas } from '@lambdas';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { buildLambdaDirEntry } from '@dev-hive/aws/lambda';
import * as awsLambda from 'aws-cdk-lib/aws-lambda';

export class TrpcStack extends Construct {
    private readonly api: apigateway.RestApi;

    constructor(scope: Construct, id: string) {
        super(scope, id);
        this.api = new apigateway.RestApi(this, createResourceName('trpc-api'), {
            restApiName: createResourceName('trpc-api'),
            description: 'Test Trpc Api',
            deployOptions: {
                stageName: process.env.STAGE || 'dev',
            },
            defaultCorsPreflightOptions: {
                allowOrigins: apigateway.Cors.ALL_ORIGINS,
                allowMethods: apigateway.Cors.ALL_METHODS,
                allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
            },
        });

        Object.entries(trpcApiLambdas).forEach(([_, lambda]) => {
            const functionName = createResourceName(lambda.config.name);

            const lambdaFunction = new NodejsFunction(this, functionName, {
                entry: buildLambdaDirEntry(lambda.config.name),
                handler: 'index.handler',
                runtime: awsLambda.Runtime.NODEJS_18_X,
                functionName,
                bundling: {
                    minify: true,
                    bundleAwsSDK: false,
                },
            });

            const lambdaIntegration = new apigateway.LambdaIntegration(lambdaFunction);

            const resource = this.api.root.addResource(lambda.config.name);

            resource.addMethod('POST', lambdaIntegration, {
                authorizationType: apigateway.AuthorizationType.NONE,
            });
        });
    }
}
