import { Logger } from '@aws-lambda-powertools/logger';
import { putDdbItem, queryDdbItems } from '../client/client';
import { BaseModel } from './baseModel';

export class UserModel extends BaseModel {
    public static email: string;
    public static authType: UserAuthType;
    static getPK() {
        return `DH#USERS`;
    }

    static getSK() {
        return `DH#USER_EMAIL#${this.email}#ID#${this.id}`;
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
        };
    }

    static async createUser(input: { email: string; logger: Logger; authType: UserAuthType }) {
        this.id = this.createUniqueId();
        this.email = input.email;
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
        this.deletedAt = null;
        this.deleted = false;
        this.PK = this.getPK();
        this.SK = this.getSK();
        this.authType = input.authType;

        const newUser = this.getUserObject();

        const response = await putDdbItem({
            item: newUser,
            logger: input.logger,
        });

        if (response.$metadata.httpStatusCode !== 200) {
            throw new Error('Failed to create user');
        }

        return newUser;
    }

    static async getUserByEmail(input: { email: string; logger: Logger; throwError?: boolean }) {
        this.email = input.email;
        const query = {
            KeyConditionExpression: 'PK = :pk and begins_with(SK, :sk)',
            ExpressionAttributeValues: {
                ':pk': this.getPK(),
                ':sk': this.skBeginsWithEmail(),
                ':deleted': false,
            },
            FilterExpression: 'deleted = :deleted',
        };
        const users = await queryDdbItems<User>({
            query,
            logger: input.logger,
        });

        if (!users || users.length === 0) {
            if (input.throwError) {
                throw new Error('User not found');
            }
            return null;
        }

        if (users.length > 1) {
            throw new Error('Multiple users found for same email');
        }

        return users[0];
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
};
