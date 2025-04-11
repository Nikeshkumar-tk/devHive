import { z } from 'zod';

export const profileSchema = z.object({
    username: z.string().min(2, { message: 'Username must be at least 2 characters' }),
    email: z.string().email({ message: 'Invalid email address' }),
    fullName: z.string().min(2, { message: 'Full name is required' }),
    bio: z.string().max(500, { message: 'Bio cannot exceed 500 characters' }).optional(),
    location: z.string().optional(),
    skills: z.array(z.string()).optional(),
    primaryLanguage: z.string().optional(),
});
