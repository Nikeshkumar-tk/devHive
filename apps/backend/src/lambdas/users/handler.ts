import { ApiMethods, RestApiHandler } from '@dev-hive/aws/lambda/types';
import { handlePostRequest } from './handlePostRequest';
import { BadRequestError } from '@dev-hive/error';
import { handleGetRequest } from './handleGetRequest';

export const handler: RestApiHandler = async ({ event, logger }) => {
    logger.info('Event', { event });

    const method = event.httpMethod;

    switch (method) {
        case ApiMethods.POST: {
            return await handlePostRequest({ event, logger });
        }
        case ApiMethods.GET: {
            return await handleGetRequest({ event, logger });
        }
        default:
            throw new BadRequestError(`Method ${method} not allowed`);
    }
};
