import { auth } from '@/auth';
import Axios from 'axios';
import { updateUserSession } from '../utils/auth';

const api = Axios.create({
    baseURL: 'https://jsml7n028k.execute-api.us-east-1.amazonaws.com/dev',
});

api.interceptors.request.use(async (config) => {
    /**
     * Retrieves the current session information using the authentication service.
     *
     * @returns {Promise<Session | null>} A promise that resolves to the user session object if authenticated,
     * or null if the user is not authenticated.
     *
     * @example
     * const session = await auth();
     * if (session) {
     *   // User is authenticated
     *   const userId = session.user.id;
     * } else {
     *   // User is not authenticated
     *   redirect('/login');
     * }
     */
    const session = await auth();
    config.headers.Authorization = `Bearer ${session?.user?.tokens.accessToken}`;
    config.headers['x-refresh-token'] = session?.user?.tokens.refreshToken;
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const response = await api.get('/refresh');
            if (response.status === 200) {
                /**
                 * The new access token retrieved from the response data.
                 * This token is used for authenticating subsequent API requests after successful authentication or token refresh.
                 * @type {string}
                 */
                const newAccessToken = response.data;

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                await updateUserSession({
                    tokens: {
                        accessToken: newAccessToken,
                        refreshToken: originalRequest.headers['x-refresh-token'],
                    },
                });
                return api(originalRequest);
            }
        }
        return Promise.reject(error);
    },
);

export { api };
