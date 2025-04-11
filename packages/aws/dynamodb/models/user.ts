import { Logger } from '@aws-lambda-powertools/logger';
import { getDdbItem, putDdbItem, queryDdbItems, updateItem } from '../client/client';
import { BaseModel } from './baseModel';
import { NotFoundError } from '@dev-hive/error';

export class UserModel extends BaseModel {
    public static override sensitiveFields: string[] = ['password', 'PK', 'SK'];
    static getPK() {
        return `DH#USERS`;
    }

    static getEmailSK({ email }: { email: string }) {
        return `DH#USER_EMAIL#${email}`;
    }

    static getUserIdSk({ id }: { id: string }) {
        return `DH#USER_ID#${id}`;
    }

    static skBeginsWithEmail({ email }: { email: string }) {
        return `DH#USER_EMAIL#${email}`;
    }

    static async createUser(input: CreateUserModelInput) {
        if (input.authType === UserAuthType.Credentials && !input.password) {
            throw new NotFoundError('Password is required for Credentials auth type');
        }

        const newUser = {
            PK: this.getPK(),
            SK: this.getEmailSK({ email: input.email }),
            email: input.email,
            authType: input.authType,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            deletedAt: null,
            deleted: false,
            password: input.password,
        };

        const emailUserResponse = await putDdbItem({
            item: newUser,
            logger: input.logger,
        });

        const idUserResponse = await putDdbItem({
            item: {
                ...newUser,
                SK: this.getUserIdSk({ id: this.createUniqueId() }),
            },
            logger: input.logger,
        });

        if (
            emailUserResponse.$metadata.httpStatusCode !== 200 ||
            idUserResponse.$metadata.httpStatusCode !== 200
        ) {
            throw new Error('Failed to create user');
        }

        return this.sanitizeEntity<User>({ entity: newUser });
    }

    static async getUserByEmail(input: { email: string; logger: Logger; throwError?: boolean }) {
        const user = await getDdbItem<User>({
            pk: this.getPK(),
            sk: this.getEmailSK({ email: input.email }),
            logger: input.logger,
        });

        if (!user) {
            if (input.throwError) {
                throw new Error('User not found');
            }
            return null;
        }

        return user;
    }

    static async getUserById(input: { id: string; logger: Logger }) {
        const user = await getDdbItem<User>({
            pk: this.getPK(),
            sk: this.getUserIdSk({ id: input.id }),
            logger: input.logger,
        });

        if (!user) {
            throw new NotFoundError('User not found');
        }

        return user;
    }

    static async updateUserById(input: { id: string; data: Partial<User>; logger: Logger }) {
        const response = await updateItem({
            pk: this.getPK(),
            sk: this.getUserIdSk({ id: input.id }),
            logger: input.logger,
            attributesToUpdate: input.data,
        });

        if (response.$metadata.httpStatusCode !== 200) {
            throw new Error('Failed to update user');
        }
        return response;
    }
}

export enum UserAuthType {
    Credentials = 'Credentials',
    Google = 'Google',
    Github = 'Github',
    Apple = 'Apple',
    Facebook = 'Facebook',
}

export type User = {
    email: string;
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    deleted: boolean;
    authType: UserAuthType;
    password?: string;
    name: string;
    username: string;
    bio: string;
    skills: string[];
    avatar: string;
};

export type CreateUserModelInput = {
    email: string;
    password?: string;
    logger: Logger;
    authType: UserAuthType;
};
