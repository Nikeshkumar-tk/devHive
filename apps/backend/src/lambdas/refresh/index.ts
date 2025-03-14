import {
    createLambdaHandler,
    LambdaHandlerType,
    RestApiLambdaConfiguration,
} from '@dev-hive/aws/lambda';
import { handler as lambdaHandler } from './handler';

export const config: RestApiLambdaConfiguration = {
    functionName: 'refresh',
    resourceConfig: {
        path: 'refresh',
        children: [],
        methods: ['GET'],
    },
};

export const handler = createLambdaHandler({
    functionName: 'refresh',
    handler: lambdaHandler,
    type: LambdaHandlerType.REST_API,
    useLayers: true,
});
