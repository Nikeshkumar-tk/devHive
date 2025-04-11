import { initTRPC } from '@trpc/server';
import z from 'zod';

export const t = initTRPC.create();

export type AppRouter = typeof appRouter;

export const appRouter = t.router({
    trpc: t.procedure.input(z.string()).mutation((opts) => {
        opts.input;
        return { id: opts.input, name: 'Bilbo' };
    }),
});
