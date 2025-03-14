import {
    createLambdaHandler,
    LambdaHandlerType,
    type RestApiLambdaConfiguration,
} from '@dev-hive/aws/lambda';
import { handler as lambdaHandler } from './handler';
import { LambdaLayerLibs } from '@dev-hive/aws/lambda/utils/layers';

export const config: RestApiLambdaConfiguration = {
    functionName: 'users',
    resourceConfig: {
        path: 'users',
        methods: ['GET', 'POST'],
        children: [
            {
                methods: ['GET', 'POST'],
                path: 'email',
                children: [{ methods: ['GET'], path: '{email}', children: [] }],
            },
            { methods: ['GET'], path: '{id}', children: [] },
            { methods: ['GET'], path: 'me', children: [], protected: true },
        ],
    },
};

export const handler = createLambdaHandler({
    handler: lambdaHandler,
    functionName: config.functionName,
    type: LambdaHandlerType.REST_API,
    useLayers: true,
    layerLibs: [LambdaLayerLibs.Bcrypt, LambdaLayerLibs.Jwt],
});
