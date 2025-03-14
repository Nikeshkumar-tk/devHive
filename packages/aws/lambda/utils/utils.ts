import { Logger } from '@aws-lambda-powertools/logger';
import { LambdaEvents, LambdaHandler, LambdaHandlerType, RestApiHandler } from '../types';
import { HttpError } from '@dev-hive/error';
import { APIGatewayProxyEvent } from 'aws-lambda';
import moduleAlias from 'module-alias';
import { LambdaLayerLibs, LayerRegistry } from './layers';

export const buildLambdaDirEntry = (functionName: string) => {
    return `src/lambdas/${functionName}/index.ts`;
};

export const handleError = (error: unknown, type: LambdaHandlerType) => {
    switch (type) {
        case LambdaHandlerType.REST_API: {
            if (error instanceof HttpError) {
                return {
                    statusCode: error.statusCode,
                    body: JSON.stringify({ message: error.message }),
                };
            } else {
                console.error('Internal Server Error', error);
                return {
                    statusCode: 500,
                    body: JSON.stringify({ message: 'Internal Server Error' }),
                };
            }
        }
        default: {
            throw error;
        }
    }
};

export const createLambdaHandler = ({
    handler,
    functionName,
    type,
    useLayers,
    layerLibs = [],
}: {
    handler: RestApiHandler;
    functionName: string;
    type: LambdaHandlerType;
    useLayers?: boolean;
    layerLibs?: LambdaLayerLibs[];
}) => {
    return async (event: LambdaEvents) => {
        try {
            if (useLayers) {
                registerLayers({ layerLibs });
            }
            const logger = new Logger({ serviceName: functionName });
            return await handler({ event, logger });
        } catch (error) {
            return handleError(error, type);
        }
    };
};

export const registerLayers = ({ layerLibs }: { layerLibs: LambdaLayerLibs[] | [] }) => {
    if (layerLibs.length === 0) {
        return;
    }

    for (const layerLib of layerLibs) {
        const layerLibConfig = LayerRegistry[layerLib];
        moduleAlias.addAlias(layerLibConfig.alias, layerLibConfig.path);
    }
};

export const getApiGatewayEventBody = (event: APIGatewayProxyEvent) => {
    const body = event.body;
    if (!body) {
        return null;
    }
    return JSON.parse(body);
};

export const lambdaResponse = ({ status, data }: { status: number; data: unknown }) => {
    return {
        statusCode: status,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Methods': '*',
        },
        body: JSON.stringify(data),
    };
};
