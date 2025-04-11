import {
    awsLambdaRequestHandler,
    CreateAWSLambdaContextOptions,
} from '@trpc/server/adapters/aws-lambda';
import { APIGatewayProxyEventV2 } from '@dev-hive/aws/lambda/types/aws-lambda';

export const createContext = ({
    event,
    context,
}: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>) => ({});

export const createTrpcLambdaHandler = ({ appRouter }: { appRouter: any }) => {
    return awsLambdaRequestHandler({
        router: appRouter,
        createContext,
        responseMeta: () => {
            return {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
            };
        },
    });
};
