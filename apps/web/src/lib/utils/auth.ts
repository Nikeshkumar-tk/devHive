import { auth } from '@/auth';
import { Session } from 'next-auth';
import { encode } from 'next-auth/jwt';
import { cookies } from 'next/headers';

export const updateUserSession = async (data: Partial<Session['user']>) => {
    const session = await auth();
    const newToken = await encode({
        token: {
            ...session?.user,
            ...data,
        },
        secret: process.env.AUTH_SECRET!,
        salt: 'authjs.session-token',
    });

    (await cookies()).set('authjs.session-token', newToken, {
        httpOnly: true,
    });

    return new Response('Session Updated');
};
