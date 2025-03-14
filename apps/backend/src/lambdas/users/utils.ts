export const getActionFromResource = (resource: string): GetRequestActions => {
    if (resource === '/users/email/{email}') {
        return GetRequestActions.GET_USER_BY_EMAIL;
    } else if (resource === '/users/{id}') {
        return GetRequestActions.GET_USER_BY_ID;
    } else {
        return GetRequestActions.GET_USER_ME;
    }
};

export enum GetRequestActions {
    GET_USER_BY_EMAIL = 'GET_USER_BY_EMAIL',
    GET_USER_BY_ID = 'GET_USER_BY_ID',
    GET_USER_ME = 'GET_USER_ME',
}
