/**
 * The base URL for the AWS API Gateway endpoint in the development environment.
 * Points to a REST API hosted in the US East (N. Virginia) region.
 * @constant {string}
 */
const API_GATEWAY_URL = 'https://jsml7n028k.execute-api.us-east-1.amazonaws.com/dev';

/**
 * Performs a GET request to the specified endpoint through API Gateway
 * @param url - The endpoint path to send the GET request to
 * @returns A Promise that resolves with the JSON response data
 * @throws {Error} If the network request fails or response cannot be parsed as JSON
 */
const get = async (url: string) => {
    const response = await fetch(`${API_GATEWAY_URL}${url}`);
    return response;
};

/**
 * Makes a POST request to the specified endpoint using the AWS API Gateway URL.
 *
 * @param url - The endpoint path to append to the API Gateway URL
 * @param body - The request payload to be sent as JSON
 * @returns A Promise that resolves to the Response object from the fetch request
 *
 * @example
 * const response = await post('/users', { name: 'John', age: 30 });
 * const data = await response.json();
 */
const post = async (url: string, body: Record<string, unknown>) => {
    const response = await fetch(`${API_GATEWAY_URL}${url}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
    return response;
};

export const apiGatewayWebClient = { get, post };
