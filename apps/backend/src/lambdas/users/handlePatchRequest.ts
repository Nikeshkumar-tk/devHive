import { lambdaResponse, RestApiHandler } from '@dev-hive/aws/lambda';
import { getPatchRequestAction, PatchRequestActions } from './utils';
import { updateUserById } from '@dev-hive/core/users';
import { User } from '@dev-hive/aws';

export const handlePatchRequest: RestApiHandler = async ({ event, logger }) => {
    logger.info('Event', { event });

    const action = getPatchRequestAction(event.resource);

    switch (action) {
        case PatchRequestActions.PATCH_USER_ME: {
            const data = JSON.parse(event.body || '{}') as User;
            return lambdaResponse({
                data: await updateUserById({
                    data,
                    id: event.requestContext.authorizer?.id,
                    logger,
                }),
                status: 200,
            });
        }
    }
};
