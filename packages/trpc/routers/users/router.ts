import { initTRPC } from '@trpc/server';
import z from 'zod';

export const t = initTRPC.create();

// Middleware for authentication
const isAuthed = t.middleware(({ ctx, next }) => {
    if (!ctx.user) {
        throw new Error('Unauthorized');
    }
    return next({
        ctx: {
            user: ctx.user,
        },
    });
});

// Protected procedure
const protectedProcedure = t.procedure.use(isAuthed);

export type AppRouter = typeof userRouter;

export const userRouter = t.router({
    users: t.procedure.input(z.object({ id: z.string() })).query(({ ctx }) => {
        // Your logic here
    }),
    protectedEndpoint: protectedProcedure.input(z.object({ id: z.string() })).query(({ ctx }) => {
        // Your protected logic here

        return { message: `Hello, ${ctx.user.name}` };
    }),
});
