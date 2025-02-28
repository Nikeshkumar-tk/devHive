import { RestApiMethodDef } from '@dev-hive/aws/lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

export const getRequestValidatorOptions = () => {
    return {
        validateRequestParameters: true,
        validateRequestBody: true,
    };
};

export const createMethodOptions = ({
    scope,
    methodDef,
    api,
    requestValidator,
    resource,
}: {
    scope: Construct;
    methodDef: RestApiMethodDef;
    api: apigateway.RestApi;
    requestValidator: apigateway.RequestValidator;
    resource: string;
}): apigateway.MethodOptions => {
    const requestModels: any = {};
    const validationConfig = methodDef.validationConfig!;
    const hasBodyValidation = validationConfig.validateRequestBody;
    if (hasBodyValidation && validationConfig.modelOptions) {
        const requestModel = new apigateway.Model(
            scope,
            methodDef.validationModelOptions?.modelName || `${resource}-${methodDef.method}-model`,
            {
                restApi: api,
                ...validationConfig?.modelOptions,
            },
        );
        requestModels['application/json'] = requestModel;
    }

    return {
        requestValidator,
        requestModels,
    };
};
