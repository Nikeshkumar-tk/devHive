import { UserAuthType, UserModel } from '@dev-hive/aws/dynamodb/models/user';
import { CreateUser } from './types';
import { Logger } from '@dev-hive/aws/logger';
import { ConflictError } from '@dev-hive/error';

/**
 * Creates a new user account in the system.
 *
 * @param input - The user creation data containing necessary information for sign up
 * @returns Promise<User> - A promise that resolves to the newly created user object
 *
 * @example
 * ```typescript
 * const newUser = await signUpUser({
 *   email: "user@example.com",
 *   password: "password123"
 * });
 * ```
 */
export const signUpUser = async (input: CreateUser) => {
    const existingUser = await getUserByEmail(input);

    if (existingUser) {
        throw new ConflictError('User already exists');
    }

    const user = await createUser(input);
    return user;
};

/**
 * Creates a new user in the system.
 *
 * @param input - The input object containing user creation data
 * @param input.email - The email address of the user to create
 * @param input.logger - The logger instance to use for logging
 * @returns Promise that resolves with the created user object
 *
 * @throws {Error} If user creation fails
 */
export const createUser = async (input: CreateUser) => {
    const user = await UserModel.createUser({
        email: input.email,
        logger: input.logger,
        authType: UserAuthType.Credentials,
    });
    return user;
};

/**
 * Retrieves a user from the database by their email address
 *
 * @param input - The input object containing email and logger
 * @param input.email - The email address of the user to retrieve
 * @param input.logger - Logger instance for tracking the operation
 * @returns Promise resolving to the user object if found
 *
 * @example
 * ```typescript
 * const user = await getUserByEmail({
 *   email: "user@example.com",
 *   logger: loggerInstance
 * });
 * ```
 */
export const getUserByEmail = async (input: { email: string; logger: Logger }) => {
    const user = await UserModel.getUserByEmail(input);
    return user;
};
