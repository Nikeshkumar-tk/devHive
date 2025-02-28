import { IFunction } from 'aws-cdk-lib/aws-lambda';

export type DynamoDBConstructProps = {
    tableName: string;
    lambdas?: IFunction[];
};
