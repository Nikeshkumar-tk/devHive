export enum LambdaLayerLibs {
    Bcrypt = 'bcrypt',
    Jwt = 'jsonwebtoken',
}

export type LayerRegistryType = Record<
    LambdaLayerLibs,
    {
        name: string;
        version: string;
        description: string;
        alias: string;
        path: string;
    }
>;

export const LayerRegistry: LayerRegistryType = {
    [LambdaLayerLibs.Bcrypt]: {
        name: 'bcrypt',
        version: '5.1.0',
        description: 'A library to help you hash passwords',
        alias: '@dev-hive/layers/nodejs/bcrypt',
        path: '/opt/nodejs/bcrypt',
    },
    [LambdaLayerLibs.Jwt]: {
        name: 'jsonwebtoken',
        version: '9.0.0',
        description: 'A library to help you sign and verify JWT tokens',
        alias: '@dev-hive/layers/nodejs/jsonwebtoken',
        path: '/opt/nodejs/jsonwebtoken',
    },
};
