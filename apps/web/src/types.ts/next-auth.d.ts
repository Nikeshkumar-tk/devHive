import { User } from '@dev-hive/aws';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    /**
     * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: User &
            DefaultSession['user'] & { tokens: { accessToken: string; refreshToken: string } };
    }
}
