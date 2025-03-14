import jwt from '@dev-hive/layers/nodejs/jsonwebtoken';

export const generateJwtTokens = (payload: { email: string; id: string }) => {
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
    const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

    if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
        throw new Error('JWT_SECRETS is not defined');
    }

    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string) => {
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

    if (!ACCESS_TOKEN_SECRET) {
        throw new Error('JWT_SECRETS is not defined');
    }

    try {
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
        return { isValid: true, decodedPayload: decoded };
    } catch (error) {
        return { isValid: false, decodedPayload: null };
    }
};

export const verifyRefreshToken = (token: string) => {
    const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
    if (!REFRESH_TOKEN_SECRET) {
        throw new Error('JWT_SECRETS is not defined');
    }
    try {
        const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
        return { isValid: true, decodedPayload: decoded };
    } catch (error) {
        return { isValid: false, decodedPayload: null };
    }
};

export const generateAccessToken = (payload: { email: string; id: string }) => {
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
    if (!ACCESS_TOKEN_SECRET) {
        throw new Error('JWT_SECRETS is not defined');
    }
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    return accessToken;
};

export const generateRefreshToken = (payload: { email: string; id: string }) => {
    const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
    if (!REFRESH_TOKEN_SECRET) {
        throw new Error('JWT_SECRETS is not defined');
    }
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    return refreshToken;
};

export const getJwtTokensFromBearer = (bearerToken: string) => {
    const token = bearerToken.split(' ')[1];
    if (!token) {
        throw new Error('Invalid token');
    }

    const [accessToken, refreshToken] = token.split('.');

    if (!accessToken || !refreshToken) {
        throw new Error('Invalid token');
    }

    const decodedAccessToken = verifyAccessToken(accessToken);

    if (!decodedAccessToken.isValid) {
        const decodedRefreshToken = verifyRefreshToken(refreshToken);
        if (!decodedRefreshToken) {
            throw new Error('Invalid token. Please login again.');
        }
        const { email, id } = decodedRefreshToken.decodedPayload as { email: string; id: string };
        const newAccessToken = generateAccessToken({ email, id });
    }
};
