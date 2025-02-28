import { ApiMethods, RestApiHandler } from '@dev-hive/aws/lambda/types';
import { handlePostRequest } from './handlePostRequest';
import { BadRequestError } from '@dev-hive/error';

export const handler: RestApiHandler = async ({ event, logger }) => {
    const method = event.httpMethod;
    switch (method) {
        case ApiMethods.POST: {
            return await handlePostRequest({ event, logger });
        }
        default:
            throw new BadRequestError(`Method ${method} not allowed`);
    }
};
