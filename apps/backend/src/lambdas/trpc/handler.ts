import { z } from 'zod';
import {
    CreateAWSLambdaContextOptions,
    awsLambdaRequestHandler,
} from '@trpc/server/adapters/aws-lambda';
import { initTRPC } from '@trpc/server';
import { APIGatewayProxyEventV2 } from '@dev-hive/aws/lambda/types/aws-lambda';

export const t = initTRPC.create();

export const appRouter = t.router({
    getUser: t.procedure.input(z.string()).query((opts) => {
        opts.input; // string
        return { id: opts.input, name: 'Bilbo' };
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;

export const createContext = ({
    event,
    context,
}: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>) => ({}); // no context
