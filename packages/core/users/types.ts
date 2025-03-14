import { UserAuthType } from '@dev-hive/aws/dynamodb/models/user';
import { Logger } from '@dev-hive/aws/logger';

export type CreateUser = {
    email: string;
    password?: string;
    logger: Logger;
    authType: UserAuthType;
};
