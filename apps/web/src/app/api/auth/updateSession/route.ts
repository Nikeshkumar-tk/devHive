import { encode, getToken } from 'next-auth/jwt';
import { cookies } from 'next/headers';

export const POST = async (req: Request) => {
    console.log('Request', req);

    const body = await req.json();
    console.log('body:', body.data);

    const token = await getToken({
        req,
        secret: process.env.AUTH_SECRET!,
        salt: 'authjs.session-token',
    });

    console.log('decoded token:', token);

    const newToken = await encode({
        token: {
            ...token,
            ...body.data,
        },
        secret: process.env.AUTH_SECRET!,
        salt: 'authjs.session-token',
    });

    (await cookies()).set('authjs.session-token', newToken, {
        httpOnly: true,
    });

    return new Response('Session Updated');
};
