import { getApiGatewayEventBody, lambdaResponse, RestApiHandler } from '@dev-hive/aws/lambda';
import { signUpUser } from '@dev-hive/core/users';
import { BadRequestError } from '@dev-hive/error';

export const handlePostRequest: RestApiHandler = async ({ event, logger }) => {
    const body = getApiGatewayEventBody(event);

    logger.info('Event Body', { body });

    const action = body?.action;

    switch (action) {
        case PostRequestActions.SIGN_UP: {
            const response = await signUpUser({ email: body.email, logger });
            return lambdaResponse({ status: 201, data: response });
        }
        default:
            throw new BadRequestError(`Action ${action} not allowed`);
    }
};

enum PostRequestActions {
    SIGN_UP = 'SIGN_UP',
}
