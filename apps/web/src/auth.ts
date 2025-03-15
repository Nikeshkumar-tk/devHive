import { apiGatewayWebClient } from '@dev-hive/aws';
import NextAuth from 'next-auth';
import { encode } from 'next-auth/jwt';
import Crerdentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { InvaliCredentialsError } from './lib/utils/errors';

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google,
        Crerdentials({
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            authorize: async (credentials) => {
                const signInResponse = await apiGatewayWebClient.post('/users', {
                    action: 'SIGN_IN',
                    email: credentials.email,
                    password: credentials.password,
                });

                if (!signInResponse.ok) {
                    throw new InvaliCredentialsError();
                }

                return await signInResponse.json();
            },
        }),
    ],
    callbacks: {
        redirect: ({ baseUrl }) => {
            return baseUrl;
        },
        jwt: async ({ token, user, account }) => {
            if (account?.provider === 'google') {
                const dbUser = await apiGatewayWebClient.get(
                    '/users/email/' + token.email || (user.email as string),
                );

                return {
                    ...token,
                    ...dbUser,
                };
            }

            return { ...token, ...user };
        },
        session: ({ session, token }) => {
            if (token && session.user && token.email) {
                session.user = {
                    ...token,
                    ...session.user,
                };
            }
            return session;
        },
        signIn: async ({ account, user }) => {
            if (account?.provider === 'google') {
                const findOrCreateUserResponse = await apiGatewayWebClient.post('/users', {
                    action: 'FIND_OR_CREATE',
                    email: user.email,
                    authType: account.provider,
                });

                if (!findOrCreateUserResponse.ok) {
                    throw new InvaliCredentialsError();
                }
            }
            return true;
        },
    },
    jwt: {
        encode: async ({ secret, token, salt }) => {
            console.log('secret:', secret);
            console.log('salt:', salt);
            return await encode({
                salt,
                secret,
                token,
            });
        },
    },
    secret: process.env.AUTH_SECRET,
});
