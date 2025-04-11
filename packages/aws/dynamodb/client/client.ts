import { Logger } from '@aws-lambda-powertools/logger';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    PutCommandOutput,
    QueryCommand,
    QueryCommandInput,
    UpdateCommand,
    UpdateCommandOutput,
} from '@aws-sdk/lib-dynamodb';

import { GetItem, PutItem } from './types';

let dynamoDbClient: DynamoDBClient;

//@ts-ignore
if (!dynamoDbClient) {
    dynamoDbClient = new DynamoDBClient({
        region: process.env.AWS_REGION || 'us-east-1',
    });
}

export const dynamoDbDocumentClient = DynamoDBDocumentClient.from(dynamoDbClient, {
    marshallOptions: {
        removeUndefinedValues: true,
        convertEmptyValues: true,
        convertClassInstanceToMap: true,
    },
    unmarshallOptions: {
        wrapNumbers: true,
    },
});

/**
 * Retrieves an item from DynamoDB using the provided primary key and sort key.
 *
 * @template T - The type of the item to be retrieved
 * @param {Object} params - The parameters for the operation
 * @param {string} params.pk - The partition key of the item
 * @param {string} params.sk - The sort key of the item
 * @param {string} [params.tableName] - Optional table name. If not provided, falls back to environment variable
 * @param {Object} params.logger - Logger object with info method
 * @returns {Promise<T | undefined>} The retrieved item cast to type T, or undefined if not found
 *
 * @example
 * const user = await getDdbItem<User>({
 *   pk: 'USER#123',
 *   sk: 'PROFILE',
 *   logger: console,
 * });
 */
export const getDdbItem = async <T>({
    pk,
    sk,
    tableName,
    logger,
}: GetItem): Promise<T | undefined> => {
    logger.info('Retrieving item from DynamoDB', { pk, sk });

    const command = new GetCommand({
        TableName: tableName || process.env.DYNAMODB_TABLE_NAME,
        Key: {
            PK: pk,
            SK: sk,
        },
    });

    const result = await dynamoDbDocumentClient.send(command);

    if (!result) {
        return undefined;
    }

    logger.info('Item retrieved from DynamoDB', { item: result.Item });

    return result.Item as T;
};

/**
 * Puts an item into DynamoDB.
 *
 * @param {Object} options - The options object.
 * @param {Record<string, any>} options.item - The item to put into DynamoDB.
 * @param {string} [options.tableName] - The name of the DynamoDB table. Falls back to DYNAMODB_TABLE_NAME environment variable if not provided.
 * @param {Object} options.logger - Logger for recording operation details.
 * @param {Object} [options.options] - Additional options for the operation.
 * @param {Object} [options.options.uniqueId] - Configuration for generating a unique ID.
 * @param {string} [options.options.uniqueId.field] - The field name to which the generated unique ID will be assigned.
 *
 * @returns {Promise<PutCommandOutput>} The response from DynamoDB.
 */
export const putDdbItem = async ({
    item,
    tableName,
    logger,
    options,
}: PutItem): Promise<PutCommandOutput> => {
    logger.info('Putting item in DynamoDB', { item });

    if (options?.uniqueId && options?.uniqueId.field && !item[options.uniqueId.field]) {
        item[options.uniqueId.field] = createUniqueId();
    }

    const command = new PutCommand({
        TableName: tableName || process.env.DYNAMODB_TABLE_NAME,
        Item: item,
    });

    const response = await dynamoDbDocumentClient.send(command);

    logger.info('Item put in DynamoDB', { response });

    return response;
};

/**
 * Queries items from DynamoDB table using the specified query parameters
 *
 * @async
 * @template T - The type of items to be returned from the query
 * @param {Object} params - The parameters for the query operation
 * @param {Omit<QueryCommandInput, 'TableName'>} params.query - The DynamoDB query parameters (excluding TableName which is taken from env)
 * @param {Logger} params.logger - Logger instance for operation logging
 * @returns {Promise<T[]>} A promise that resolves to an array of query result items
 *
 * @example
 * const items = await queryDdbItems<UserItem>({
 *   query: {
 *     KeyConditionExpression: 'pk = :pk',
 *     ExpressionAttributeValues: { ':pk': 'USER#123' }
 *   },
 *   logger: console
 * });
 */
export const queryDdbItems = async <T>({
    query,
    logger,
}: {
    query: Omit<QueryCommandInput, 'TableName'>;
    logger: Logger;
}): Promise<T[]> => {
    logger.info('Querying items from DynamoDB', { query });

    const command = new QueryCommand({
        TableName: process.env.DYNAMODB_TABLE_NAME,
        ...query,
    });

    const result = await dynamoDbDocumentClient.send(command);

    if (!result) {
        return [];
    }

    logger.info('Items retrieved from DynamoDB', { items: result.Items });

    return result.Items as T[];
};

/**
 * Updates an item in DynamoDB with the specified attributes.
 *
 * @param {Object} params - The parameters for updating the item.
 * @param {string} params.pk - The partition key of the item to update.
 * @param {string | null} params.sk - The sort key of the item to update.
 * @param {Record<string, unknown>} params.attributesToUpdate - The attributes to update as key-value pairs.
 * @param {Logger} params.logger - The logger instance for recording the operation.
 * @returns {Promise<UpdateCommandOutput>} - A promise that resolves to the DynamoDB update command result.
 */
export const updateItem = async ({
    pk,
    sk,
    attributesToUpdate,
    logger,
}: {
    pk: string;
    sk: string | null;
    attributesToUpdate: Record<string, unknown>;
    logger: Logger;
}): Promise<UpdateCommandOutput> => {
    logger.info('Updating item in DynamoDB', { pk, sk, attributesToUpdate });

    const { updateExpression, expressionAttributeNames, expressionAttributeValues } =
        constructUpdateExpression(attributesToUpdate);

    const command = new UpdateCommand({
        Key: {
            PK: pk,
            SK: sk,
        },
        TableName: process.env.DYNAMODB_TABLE_NAME,
        UpdateExpression: `SET ${updateExpression}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
    });

    return await dynamoDbDocumentClient.send(command);
};

export const constructUpdateExpression = (attributesToUpdate: Record<string, unknown>) => {
    const updateExpression = Object.keys(attributesToUpdate)
        .map((_, index) => `#field${index} = :value${index}`)
        .join(', ');

    const expressionAttributeNames = Object.keys(attributesToUpdate).reduce(
        (acc, key, index) => ({
            ...acc,
            [`#field${index}`]: key,
        }),
        {},
    );

    const expressionAttributeValues = Object.entries(attributesToUpdate).reduce(
        (acc, [_, value], index) => ({
            ...acc,
            [`:value${index}`]: value,
        }),
        {},
    );

    return {
        updateExpression,
        expressionAttributeNames,
        expressionAttributeValues,
    };
};

export const deleteDdbItem = async ({
    key,
    logger,
}: {
    key: { PK: string; SK: string };
    logger: Logger;
}) => {
    const command = new DeleteCommand({
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Key: key,
    });

    logger.info('Deleting item from DynamoDB', { key });

    const response = await dynamoDbDocumentClient.send(command);

    logger.info('Item deleted from DynamoDB', { response });

    return response;
};

const createUniqueId = () => {
    return crypto.randomUUID();
};
