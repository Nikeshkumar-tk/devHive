import * as lambdaHandlers from '@lambdas';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { RestApi } from './modules/api';
import { DynamoDB } from './modules/dynamo';

export class DevHiveBackendStack extends Stack {
    public readonly api: RestApi;
    public readonly db: DynamoDB;
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        this.api = new RestApi(this, 'api', {
            apiName: 'api',
            description: 'This service serves DevHive API.',
            restApiLambdas: lambdaHandlers.restApiLambdas,
        });

        this.db = new DynamoDB(this, 'db', {
            tableName: 'table',
            lambdas: this.api.functions,
        });
    }
}
