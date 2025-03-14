'use client';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

export const NextAuthSessionProvider = ({
    children,
}: {
    session: Session | null;
    children: React.ReactNode;
}) => {
    return <SessionProvider>{children}</SessionProvider>;
};
