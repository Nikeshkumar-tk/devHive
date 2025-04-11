import { lambdaResponse, RestApiHandler } from '@dev-hive/aws/lambda';
import { getUserByEmail, getUserById } from '@dev-hive/core/users';
import { getActionFromResource, GetRequestActions } from './utils';
import { BadRequestError } from '@dev-hive/error';

export const handleGetRequest: RestApiHandler = async ({ event, logger }) => {
    logger.info('Event', { event });

    const path = event.path;
    const pathParameters = event.pathParameters;

    const action = getActionFromResource(event.resource);

    switch (action) {
        case GetRequestActions.GET_USER_BY_EMAIL:
            return lambdaResponse({
                data: await getUserByEmail({
                    email: pathParameters?.email as string,
                    logger,
                    sanitize: true,
                }),
                status: 200,
            });

        case GetRequestActions.GET_USER_BY_ID:
            return lambdaResponse({
                data: await getUserById({
                    id: pathParameters?.id as string,
                    logger,
                    sanitize: true,
                }),
                status: 200,
            });

        case GetRequestActions.GET_USER_ME:
            return lambdaResponse({
                data: await getUserById({
                    id: event.requestContext.authorizer?.id,
                    logger,
                    sanitize: true,
                }),
                status: 200,
            });
        default:
            throw new BadRequestError('Invalid action');
    }
};
