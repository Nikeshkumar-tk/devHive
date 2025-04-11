import { BadRequestError } from '@dev-hive/error';

export const getActionFromResource = (resource: string): GetRequestActions => {
    if (resource === '/users/email/{email}') {
        return GetRequestActions.GET_USER_BY_EMAIL;
    } else if (resource === '/users/{id}') {
        return GetRequestActions.GET_USER_BY_ID;
    } else {
        return GetRequestActions.GET_USER_ME;
    }
};

export const getPatchRequestAction = (resource: string) => {
    switch (resource) {
        case '/users/me':
            return PatchRequestActions.PATCH_USER_ME;
        default:
            throw new BadRequestError('Invalid action');
    }
};

export enum GetRequestActions {
    GET_USER_BY_EMAIL = 'GET_USER_BY_EMAIL',
    GET_USER_BY_ID = 'GET_USER_BY_ID',
    GET_USER_ME = 'GET_USER_ME',
}

export enum PatchRequestActions {
    PATCH_USER_ME = 'PATCH_USER_ME',
}
