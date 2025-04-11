import { lambdaResponse } from '@dev-hive/aws/lambda';
import { APIGatewayProxyWebsocketEventV2 } from '@dev-hive/aws/lambda/types/aws-lambda';
import { Logger } from '@dev-hive/aws/logger';
import { createWebsocketConnection, deleteWebsocketConnection } from '@dev-hive/core/websocket';

const logger = new Logger({ serviceName: 'websocket-handler' });

export const handler = async (event: APIGatewayProxyWebsocketEventV2) => {
    logger.info('WebSocket event received', { event });

    const action = event.requestContext.eventType;

    switch (action) {
        case 'CONNECT': {
            return lambdaResponse({
                status: 201,
                data: await createWebsocketConnection({
                    connectionId: event.requestContext.connectionId,
                    userId: 'test_user_id',
                    logger,
                }),
            });
        }
        case 'DISCONNECT': {
            return lambdaResponse({
                status: 200,
                data: await deleteWebsocketConnection({
                    connectionId: event.requestContext.connectionId,
                    userId: 'test_user_id',
                    logger,
                }),
            });
        }
    }
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'WebSocket event received!' }),
    };
};
