import crypto from 'crypto';

export class BaseModel {
    static createdAt: string;
    static updatedAt: string;
    static deletedAt: string | null;
    static deleted: boolean;
    static id: string;
    static PK: string;
    static SK: string;
    static createUniqueId() {
        return crypto.randomUUID();
    }
}
