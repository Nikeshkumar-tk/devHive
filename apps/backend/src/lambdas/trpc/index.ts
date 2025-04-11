import { createTrpcLambdaHandler } from '@dev-hive/trpc/createTrpcLambdaHandler';
import { appRouter } from '@dev-hive/trpc/routers/trpc';

export const config = {
    name: 'trpc',
    description: 'tRPC API',
};

export const handler = createTrpcLambdaHandler({
    appRouter,
});
