import { User, UserAuthType, UserModel } from '@dev-hive/aws/dynamodb/models/user';
import { Logger } from '@dev-hive/aws/logger';
import { BadRequestError, ConflictError, NotFoundError, NotProvidedError } from '@dev-hive/error';
import { CreateUser } from './types';
import { encrptUserPassword, generateJwtTokens, verifyUserPassword } from './utils';

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

    if (input.authType === UserAuthType.Credentials) {
        if (!input.password) {
            throw new NotProvidedError('Password not provided');
        }
        const ecryptedUserPassword = await encrptUserPassword(input.password);

        input.password = ecryptedUserPassword;
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
        authType: input.authType,
        password: input.password,
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
export const getUserByEmail = async (input: {
    email: string;
    logger: Logger;
    sanitize?: boolean;
}) => {
    const user = await UserModel.getUserByEmail(input);
    return input.sanitize ? UserModel.sanitizeEntity({ entity: user }) : user;
};

/**
 * Authenticates a user by their email and password.
 *
 * @param input - The input object containing user credentials
 * @param input.email - The email address of the user
 * @param input.password - The password of the user
 * @param input.logger - Logger instance for tracking authentication process
 *
 * @throws {BadRequestError} When user is not found with the provided email
 * @throws {NotProvidedError} When password is not provided for credentials-based authentication
 * @throws {NotFoundError} When password is not set for the user
 * @throws {ConflictError} When provided password is invalid
 *
 * @returns {Promise<User>} The authenticated user object
 */
export const signInUser = async (input: { email: string; password: string; logger: Logger }) => {
    input.logger.info('Sign in user', { email: input.email });

    const user = await UserModel.getUserByEmail(input);

    input.logger.info('User found', { user });

    if (!user) {
        throw new BadRequestError('User not found');
    }

    if (user.authType === UserAuthType.Credentials && !input.password) {
        throw new NotProvidedError('Password not provided');
    }

    if (!user.password) {
        throw new NotFoundError('Password not found for the user');
    }

    const isPasswordValid = await verifyUserPassword(input.password, user.password);

    if (!isPasswordValid) {
        throw new ConflictError('Invalid password');
    }

    const tokens = await generateJwtTokens({ email: user.email, id: user.id });

    const userWithTokens = {
        ...user,
        tokens,
    };

    return UserModel.sanitizeEntity({ entity: userWithTokens });
};

/**
 * Finds a user by email or creates a new user if one doesn't exist.
 *
 * @param input - The input parameters for finding or creating a user
 * @param input.email - The email address of the user to find or create
 * @param input.authType - The authentication type for the user
 * @param input.logger - Logger instance for recording operations
 * @returns A promise that resolves to the found or newly created user
 */
export const findOrCreateUser = async (input: {
    email: string;
    authType: UserAuthType;
    logger: Logger;
}) => {
    const existingUser = await getUserByEmail(input);

    if (existingUser) {
        return existingUser;
    }

    const user = await createUser({
        email: input.email,
        logger: input.logger,
        authType: input.authType,
    });

    return user;
};

/**
 * Retrieves a user by their ID.
 *
 * @param input - The input parameters
 * @param input.id - The unique identifier of the user to retrieve
 * @param input.logger - The logger instance for tracking operations
 * @returns A sanitized user entity
 * @throws {NotFoundError} When the user with the specified ID is not found
 */
export const getUserById = async (input: { id: string; logger: Logger; sanitize?: boolean }) => {
    const user = await UserModel.getUserById(input);
    if (!user) {
        throw new NotFoundError('User not found');
    }
    return input.sanitize ? UserModel.sanitizeEntity({ entity: user }) : user;
};

/**
 * Updates a user by their unique identifier.
 *
 * @param input - The input object containing the following properties:
 * @param input.id - The unique identifier of the user to be updated.
 * @param input.data - A partial object containing the fields to update in the user entity.
 * @param input.logger - A logger instance for logging purposes.
 *
 * @returns A sanitized version of the updated user entity.
 *
 * @throws Will throw an error if the update operation fails.
 */
export const updateUserById = async (input: {
    id: string;
    data: Partial<User>;
    logger: Logger;
}) => {
    const updatedUser = await UserModel.updateUserById({
        data: input.data,
        id: input.id,
        logger: input.logger,
    });
    return UserModel.sanitizeEntity({ entity: updatedUser });
};
