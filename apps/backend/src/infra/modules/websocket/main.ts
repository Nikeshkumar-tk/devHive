import { WebSocketApi, WebSocketStage } from 'aws-cdk-lib/aws-apigatewayv2';
import { WebSocketLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { createResourceName } from '@dev-hive/aws';
import { RESOURCE_NAMES } from '../constants';

export class DevHiveWebsocket extends Construct {
    public readonly websocketApi: WebSocketApi;
    public readonly websocketLambda: NodejsFunction;
    constructor(scope: Construct, id: string) {
        super(scope, id);

        // Create connect handler
        this.websocketLambda = new NodejsFunction(this, 'dh-websocket-connect', {
            entry: 'src/lambdas/websocket/index.ts',
            handler: 'index.handler',
            runtime: lambda.Runtime.NODEJS_18_X,
            functionName: createResourceName('websocket-handler'),
            bundling: {
                minify: true,
                bundleAwsSDK: false,
            },
            environment: {
                DYNAMODB_TABLE_NAME: createResourceName(RESOURCE_NAMES.DYNAMODB_TABLE),
                ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
            },
        });

        // Create the WebSocket API
        this.websocketApi = new WebSocketApi(this, 'dh-websocket-api', {
            apiName: 'dh-websocket-api',
            description: 'Websocket API for DevHive',
            connectRouteOptions: {
                integration: new WebSocketLambdaIntegration(
                    'ConnectIntegration',
                    this.websocketLambda,
                ),
            },
            disconnectRouteOptions: {
                integration: new WebSocketLambdaIntegration(
                    'DisconnectIntegration',
                    this.websocketLambda,
                ),
            },
            defaultRouteOptions: {
                integration: new WebSocketLambdaIntegration(
                    'DefaultIntegration',
                    this.websocketLambda,
                ),
            },
        });

        const stage = process.env.STAGE || 'dev';
        // Create a stage for the WebSocket API
        new WebSocketStage(this, stage, {
            webSocketApi: this.websocketApi,
            stageName: stage,
            autoDeploy: true,
        });
    }
}
