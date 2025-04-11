import { Logger } from '@aws-lambda-powertools/logger';
import { deleteDdbItem, putDdbItem } from '../client';
import { BaseModel } from './baseModel';

export class WebsocketModel extends BaseModel {
    static getPk() {
        return 'DH#WEBSOCKET_CONNECTIONS';
    }
    static getSk({ connectionId, userId }: { connectionId: string; userId: string }) {
        return `USER#${userId}#CONNECTION_ID#${connectionId}`;
    }

    static async addConnection({
        connectionId,
        userId,
        logger,
    }: {
        connectionId: string;
        userId: string;
        logger: Logger;
    }) {
        const PK = this.getPk();
        const SK = this.getSk({ connectionId, userId });

        const item = {
            PK,
            SK,
            connectionId,
            userId,
        };

        const response = await putDdbItem({ item, logger });

        if (response.$metadata.httpStatusCode !== 200) {
            logger.error('Error putting item in DynamoDB', { response });
            throw new Error('Error putting item in DynamoDB');
        }

        return item;
    }

    static async removeConnection({
        userId,
        connectionId,
        logger,
    }: {
        userId: string;
        connectionId: string;
        logger: Logger;
    }) {
        const PK = this.getPk();
        const SK = this.getSk({ connectionId, userId });

        const response = await deleteDdbItem({ key: { PK, SK }, logger });

        if (response.$metadata.httpStatusCode !== 200) {
            throw new Error('Error putting item in DynamoDB');
        }

        return response;
    }
}
