import { lambdaResponse, RestApiHandler } from '@dev-hive/aws/lambda';
import { generateAccessToken, verifyRefreshToken } from '@dev-hive/core/authorization/main';
import { NotProvidedError } from '@dev-hive/error';

export const handler: RestApiHandler = async ({ event, logger }) => {
    const refreshToken = event.headers['x-refresh-token']?.split(' ')[1];

    if (!refreshToken) {
        throw new NotProvidedError('Refresh token is not provided in the headers');
    }

    const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
    if (!REFRESH_TOKEN_SECRET) {
        throw new Error('JWT_SECRETS is not defined');
    }

    const decodedRefreshToken = verifyRefreshToken(refreshToken);
    if (!decodedRefreshToken.isValid) {
        return lambdaResponse({
            status: 401,
            data: { message: 'Invalid refresh token. Please relogin' },
        });
    }

    const payload = decodedRefreshToken.decodedPayload as { email: string; id: string };
    const newAccessToken = generateAccessToken({ email: payload.email, id: payload.id });

    return lambdaResponse({ status: 200, data: newAccessToken });
};
