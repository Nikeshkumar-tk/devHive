import {
    createLambdaHandler,
    LambdaHandlerType,
    type RestApiLambdaConfiguration,
} from '@dev-hive/aws/lambda';
import { handler as lambdaHandler } from './handler';

export const config: RestApiLambdaConfiguration = {
    functionName: 'users',
    resource: 'users',
    methods: [
        {
            method: 'POST',
        },
        {
            method: 'GET',
        },
    ],
};

export const handler = createLambdaHandler({
    handler: lambdaHandler,
    functionName: config.functionName,
    type: LambdaHandlerType.REST_API,
});
