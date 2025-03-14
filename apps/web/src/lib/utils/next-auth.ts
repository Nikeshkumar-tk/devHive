import { apiGatewayWebClient } from '@dev-hive/aws';
import { AuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: AuthOptions = {
    secret: 'supersecret',
    session: {
        strategy: 'jwt',
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        Credentials({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email', placeholder: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            authorize: async (credentials) => {
                const response = await apiGatewayWebClient.post('/users', {
                    action: 'SIGN_IN',
                    email: credentials?.email,
                    password: credentials?.password,
                });

                if (response.status === 200) {
                    const user = await response.json();
                    return user;
                }

                return null;
            },
        }),
    ],
    callbacks: {
        redirect: (input) => {
            console.log('Redirecting...', input);
            return input.baseUrl;
        },
    },
    debug: true,
};
