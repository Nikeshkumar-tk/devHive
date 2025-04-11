import * as lambdaHandlers from '@lambdas';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { RestApi } from './modules/api';
import { DynamoDB } from './modules/dynamo';
import { WebSocketApi } from 'aws-cdk-lib/aws-apigatewayv2';
import { DevHiveWebsocket } from './modules/websocket';
import { TrpcStack } from './modules/trpc';

export class DevHiveBackendStack extends Stack {
    public readonly api: RestApi;
    public readonly db: DynamoDB;
    public readonly websocketApi: DevHiveWebsocket;
    public readonly trpcApi: TrpcStack;
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        this.api = new RestApi(this, 'api', {
            apiName: 'api',
            description: 'This service serves DevHive API.',
            restApiLambdas: lambdaHandlers.restApiLambdas,
        });

        this.websocketApi = new DevHiveWebsocket(this, 'dh-websocket');

        this.db = new DynamoDB(this, 'db', {
            tableName: 'table',
            lambdas: [...this.api.functions, this.websocketApi.websocketLambda],
        });

        this.trpcApi = new TrpcStack(this, 'trpc-api');
    }
}
