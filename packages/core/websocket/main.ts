import { Logger } from '@dev-hive/aws/logger';
import { WebsocketModel } from '@dev-hive/aws/dynamodb/models/websocket';

export const createWebsocketConnection = async ({
    connectionId,
    userId,
    logger,
}: {
    connectionId: string;
    userId: string;
    logger: Logger;
}) => {
    const response = await WebsocketModel.addConnection({
        connectionId,
        userId,
        logger,
    });

    return { message: 'WebSocket connection created successfully!', data: response };
};

export const deleteWebsocketConnection = async ({
    connectionId,
    userId,
    logger,
}: {
    connectionId: string;
    userId: string;
    logger: Logger;
}): Promise<ReturnType<typeof WebsocketModel.removeConnection>> => {
    const response = await WebsocketModel.removeConnection({
        userId,
        connectionId,
        logger,
    });

    return response;
};
