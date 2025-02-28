import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { RemovalPolicy } from 'aws-cdk-lib';
import { DynamoDBConstructProps } from './types';
import { createResourceName } from '@dev-hive/aws';
import { RESOURCE_NAMES } from '../constants';

export class DynamoDB extends Construct {
    public readonly table: dynamodb.Table;
    constructor(scope: Construct, id: string, props: DynamoDBConstructProps) {
        super(scope, id);

        this.table = new dynamodb.Table(this, 'table', {
            partitionKey: {
                name: 'PK',
                type: dynamodb.AttributeType.STRING,
            },
            sortKey: {
                name: 'SK',
                type: dynamodb.AttributeType.STRING,
            },
            tableName: createResourceName(RESOURCE_NAMES.DYNAMODB_TABLE),
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            removalPolicy: RemovalPolicy.DESTROY,
        });

        if (props.lambdas) {
            props.lambdas.forEach((lambda) => {
                this.table.grantReadWriteData(lambda);
            });
        }
    }
}
