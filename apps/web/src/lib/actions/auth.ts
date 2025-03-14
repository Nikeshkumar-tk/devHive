'use server';

import { apiGatewayWebClient, UserAuthType } from '@dev-hive/aws';
import { signIn } from 'next-auth/react';
import { redirect } from 'next/navigation';

export const handleSignUp = async (data: FormData) => {
    const email = data.get('email');
    const password = data.get('password');

    const response = await apiGatewayWebClient.post('/users', {
        action: 'SIGN_UP',
        email,
        password,
        authType: UserAuthType.Credentials,
    });

    if (response.ok) {
        redirect('/signin');
    }

    const errorStatus = response.status;

    return { error: { status: errorStatus } };
};

export const handleSignIn = async (data: FormData) => {
    const email = data.get('email');
    const password = data.get('password');
    await signIn('credentials', {
        email,
        password,
        redirect: false,
    });
};
