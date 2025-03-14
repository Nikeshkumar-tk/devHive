import { Logger } from '@aws-lambda-powertools/logger';
import { getDdbItem, putDdbItem, queryDdbItems } from '../client/client';
import { BaseModel } from './baseModel';
import { NotFoundError } from '@dev-hive/error';

export class UserModel extends BaseModel {
    public static email: string;
    public static authType: UserAuthType;
    public static password?: string;
    public static override sensitiveFields: string[] = ['password', 'PK', 'SK'];
    static getPK() {
        return `DH#USERS`;
    }

    static getEmailSK() {
        return `DH#USER_EMAIL#${this.email}`;
    }

    static getUserIdSk() {
        return `DH#USER_ID#${this.id}`;
    }

    static skBeginsWithEmail() {
        return `DH#USER_EMAIL#${this.email}`;
    }

    static getUserObject(): UserModel {
        return {
            id: this.id,
            email: this.email,
            PK: this.PK,
            SK: this.SK,
            deleted: this.deleted,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            deletedAt: this.deletedAt,
            authType: this.authType,
            password: this.password,
        };
    }

    static async createUser(input: CreateUserModelInput) {
        if (input.authType === UserAuthType.Credentials && !input.password) {
            throw new NotFoundError('Password is required for Credentials auth type');
        }

        this.id = this.createUniqueId();
        this.email = input.email;
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
        this.deletedAt = null;
        this.deleted = false;
        this.PK = this.getPK();
        this.SK = this.getEmailSK();
        this.authType = input.authType;
        this.password = input.password;

        const newUser = this.getUserObject();

        const emailUserResponse = await putDdbItem({
            item: newUser,
            logger: input.logger,
        });

        const idUserResponse = await putDdbItem({
            item: {
                ...newUser,
                SK: this.getUserIdSk(),
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
        this.email = input.email;

        const user = await getDdbItem<User>({
            pk: this.getPK(),
            sk: this.getEmailSK(),
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
        this.id = input.id;
        const user = await getDdbItem<User>({
            pk: this.getPK(),
            sk: this.getUserIdSk(),
            logger: input.logger,
        });

        if (!user) {
            throw new NotFoundError('User not found');
        }

        return user;
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
};

export type CreateUserModelInput = {
    email: string;
    password?: string;
    logger: Logger;
    authType: UserAuthType;
};
