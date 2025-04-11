import { updateUserSession } from '@/lib/utils/auth';

export const POST = async (req: Request) => {
    const data = await req.json();

    await updateUserSession({
        ...data,
    });

    return new Response('Session Updated');
};
