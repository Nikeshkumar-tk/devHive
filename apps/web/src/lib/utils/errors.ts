import { CredentialsSignin } from 'next-auth';

export const getSignUpErrorMessage = (status: number) => {
    let message;
    if (status === 409) {
        message = {
            title: 'Email already exists',
            description: 'Please use a different email address.',
        };
    } else {
        message = {
            title: 'Error',
            description: 'An unexpected error occurred. Please try again later.',
        };
    }
    return message;
};

export class InvaliCredentialsError extends CredentialsSignin {
    code = 'Invalid identifier or password';
}
