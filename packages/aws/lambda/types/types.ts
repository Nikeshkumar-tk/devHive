import { Logger } from '@aws-lambda-powertools/logger';
import { APIGatewayAuthorizerEvent, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export type IRestApiMethods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

export enum ApiMethods {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
}

export type LambdaEvents = APIGatewayProxyEvent;

export type RestApiMethodDef = {
    method: IRestApiMethods;
};

export type RestApiLambdaConfiguration = {
    functionName: string;
    resourceConfig: {
        path: string;
        methods: IRestApiMethods[];
        protected?: boolean;
        children: Array<RestApiLambdaConfiguration['resourceConfig']>;
    };
};

export type LambdaHandler<T, R> = (props: { event: T; logger: Logger }) => Promise<R>;

export type RestApiHandler = LambdaHandler<APIGatewayProxyEvent, APIGatewayProxyResult>;
export type AuthorizationHandler = LambdaHandler<APIGatewayAuthorizerEvent, APIGatewayProxyResult>;
export enum LambdaHandlerType {
    REST_API = 'REST_API',
}
