import type { DefaultUser } from 'next-auth';
import { type User as UserType } from '@dev-hive/aws';
import { DefaultJWT } from 'next-auth/jwt';
declare module 'next-auth' {
    interface Session {
        user: User;
    }

    type User = DefaultUser & UserType;
}

declare module 'next-auth/jwt' {
    type JWT = UserType & DefaultJWT;
}
