import { registerLayers } from '@dev-hive/aws/lambda';
registerLayers({ layerLibs: [LambdaLayerLibs.Jwt] });
import {
    APIGatewayAuthorizerEvent,
    APIGatewayAuthorizerResult,
    Callback,
    Context,
    StatementEffect,
} from '@dev-hive/aws/lambda/types/aws-lambda';
import { LambdaLayerLibs } from '@dev-hive/aws/lambda/utils/layers';
import { verifyAccessToken } from '@dev-hive/core/authorization/main';
/**
 * API Gateway Lambda Authorizer
 *
 * Validates access tokens provided in the Authorization header and generates
 * appropriate IAM policies for API access control.
 *
 * @param {APIGatewayAuthorizerEvent & { authorizationToken: string }} event - The API Gateway event
 * @param {Context} context - The Lambda execution context
 * @param {Callback} callback - The Lambda callback function
 */
export const handler = (
    event: APIGatewayAuthorizerEvent & { authorizationToken: string },
    _: Context,
    callback: Callback,
): void => {
    console.log('Event', JSON.stringify(event, null, 2));
    const accessToken = event.authorizationToken.split(' ')[1];

    const decodedAccessToken = verifyAccessToken(accessToken);

    if (!decodedAccessToken.isValid) {
        return callback('Unauthorized');
    }

    const payload = decodedAccessToken.decodedPayload as { email: string; id: string };
    const policy = generatePolicy({
        effect: 'Allow',
        principalId: payload.id,
        resource: event.methodArn,
        contextPayload: payload,
    });

    callback(null, policy);
};

/**
 * Generates an IAM policy document for API Gateway authorization
 *
 * @param {Object} input - Policy generation parameters
 * @param {string} input.principalId - The principal ID (typically user ID)
 * @param {StatementEffect} input.effect - The IAM policy effect ('Allow' or 'Deny')
 * @param {string} input.resource - The API resource ARN
 * @param {Record<string, any>} [input.contextPayload] - Additional context to pass to downstream functions
 * @returns {APIGatewayAuthorizerResult} The formatted policy document
 */
const generatePolicy = (input: {
    principalId: string;
    effect: StatementEffect;
    resource: string;
    contextPayload?: Record<string, any>;
}): APIGatewayAuthorizerResult => {
    const { principalId, effect, resource, contextPayload } = input;

    const authResponse: APIGatewayAuthorizerResult = {
        principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: resource,
                },
            ],
        },
        context: contextPayload || {
            stringKey: 'stringval',
            numberKey: 123,
            booleanKey: true,
        },
    };

    return authResponse;
};
