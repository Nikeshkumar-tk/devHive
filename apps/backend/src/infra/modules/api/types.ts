import { RestApiLambdaConfiguration } from '@dev-hive/aws/lambda';

export type RestApiCostructProps = {
    apiName: string;
    description?: string;
    restApiLambdas: {
        [key: string]: { config: RestApiLambdaConfiguration };
    };
};
