import { getApiGatewayEventBody, lambdaResponse, RestApiHandler } from '@dev-hive/aws/lambda';
import { findOrCreateUser, signInUser, signUpUser } from '@dev-hive/core/users';
import { BadRequestError } from '@dev-hive/error';

export const handlePostRequest: RestApiHandler = async ({ event, logger }) => {
    const body = getApiGatewayEventBody(event);

    logger.info('Event Body', { body });

    const action = body?.action;

    switch (action) {
        case PostRequestActions.SIGN_UP: {
            const response = await signUpUser({
                email: body.email,
                logger,
                authType: body.authType,
                password: body.password,
            });
            return lambdaResponse({ status: 201, data: response });
        }
        case PostRequestActions.SIGN_IN: {
            const response = await signInUser({
                email: body.email,
                password: body.password,
                logger,
            });
            return lambdaResponse({ status: 200, data: response });
        }
        case PostRequestActions.FIND_OR_CREATE: {
            const response = await findOrCreateUser({
                email: body.email,
                authType: body.authType,
                logger,
            });
            return lambdaResponse({ status: 200, data: response });
        }
        default:
            throw new BadRequestError(`Action ${action} not allowed`);
    }
};

enum PostRequestActions {
    SIGN_UP = 'SIGN_UP',
    SIGN_IN = 'SIGN_IN',
    FIND_OR_CREATE = 'FIND_OR_CREATE',
}
