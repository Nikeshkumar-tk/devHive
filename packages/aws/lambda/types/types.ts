import { Logger } from '@aws-lambda-powertools/logger';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export type IRestApiMethods = 'GET' | 'POST' | 'PUT' | 'DELETE';

export enum ApiMethods {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
}

export type LambdaEvents = APIGatewayProxyEvent;

export type RestApiMethodDef = {
    method: IRestApiMethods;
};

export type RestApiLambdaConfiguration = {
    functionName: string;
    resource: string;
    methods: RestApiMethodDef[];
};

export type LambdaHandler<T, R> = (props: { event: T; logger: Logger }) => Promise<R>;

export type RestApiHandler = LambdaHandler<APIGatewayProxyEvent, APIGatewayProxyResult>;

export enum LambdaHandlerType {
    REST_API = 'REST_API',
}
