import crypto from 'crypto';

export class BaseModel {
    static createdAt: string;
    static updatedAt: string;
    static deletedAt: string | null;
    static deleted: boolean;
    static id: string;
    static PK: string;
    static SK: string;
    static sensitiveFields: string[] = ['password', 'PK', 'SK'];
    static createUniqueId() {
        return crypto.randomUUID();
    }

    static sanitizeEntity<T>({ entity }: { entity: any }): T {
        delete entity.PK;
        delete entity.SK;

        this.sensitiveFields.forEach((key) => {
            delete entity[key];
        });

        return entity as T;
    }
}
