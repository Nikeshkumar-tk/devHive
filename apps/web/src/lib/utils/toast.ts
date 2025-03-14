'use client';

import { toast } from 'sonner';

export const customToaster = {
    error: (input: CustomToasterInput) => {
        toast.error(input.title, {
            description: input.description,
            action: input.action,
            style: { backgroundColor: '#DC2626', color: 'white' },
        });
    },
};

export type CustomToasterInput = {
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
};
