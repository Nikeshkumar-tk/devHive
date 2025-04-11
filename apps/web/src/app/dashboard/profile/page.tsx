'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MultiSelect } from '@/components/ui/multi-select';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api/webClient';
import { profileSchema } from '@/lib/zod/schemas/user';
import { UserAuthType } from '@dev-hive/aws';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type ProfileFormType = z.infer<typeof profileSchema>;

import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { appRouter } from '@dev-hive/trpc';

const client = createTRPCClient<typeof appRouter>({
    links: [httpBatchLink({ url: 'https://95xms324r8.execute-api.us-east-1.amazonaws.com/dev' })],
});

const DeveloperProfilePage = () => {
    const [isEditing, setIsEditing] = useState(false);

    const updateUserInfoMutation = useMutation({
        mutationFn: async (data: ProfileFormType) => {
            const response = await api.patch('/users/me', data);
            return response.data;
        },
        onSuccess: () => {
            setIsEditing(false);
        },
    });

    const getCurrentUserInfoQuery = useQuery({
        queryKey: ['USER_ME'],
        queryFn: async () => {
            const q = await client.trpc.mutate('Nikesh kumar');
            console.log('q:', q);
        },
    });

    const form = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            username: 'dev_user123',
            email: 'developer@example.com',
            fullName: 'Jane Doe',
            bio: 'Passionate developer creating innovative web solutions',
            location: 'San Francisco, CA',
            primaryLanguage: 'TypeScript',
            skills: ['JavaScript', 'React', 'Next.js'],
        },
    });

    // useEffect(() => {
    //     form.setValue('');
    // }, []);

    const onSubmit = async (data: ProfileFormType) => {
        await updateUserInfoMutation.mutateAsync(data);
    };

    const removeSkill = (skillToRemove: string) => {
        form.setValue(
            'skills',
            form.getValues('skills')?.filter((skill) => skill !== skillToRemove),
        );
    };

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Developer Profile</CardTitle>
                    <Button
                        variant={isEditing ? 'secondary' : 'default'}
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-6 mb-6">
                        <Avatar className="w-24 h-24">
                            <AvatarImage src="/placeholder-avatar.png" alt="Profile Picture" />
                            <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        {isEditing && <Button variant="outline">Change Avatar</Button>}
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Username Field */}
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={!isEditing}
                                                placeholder="Your username"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Email Field */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={!isEditing}
                                                type="email"
                                                placeholder="Your email"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Full Name Field */}
                            <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={!isEditing}
                                                placeholder="Your full name"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Bio Field */}
                            <FormField
                                control={form.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bio</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                disabled={!isEditing}
                                                placeholder="Tell us about yourself"
                                                className="resize-none"
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Write a short description about yourself (max 500
                                            characters)
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Location Field */}
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={!isEditing}
                                                placeholder="Your location"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Primary Language Field */}
                            <FormField
                                control={form.control}
                                name="primaryLanguage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Primary Language</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={!isEditing}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select primary programming language" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="TypeScript">
                                                    TypeScript
                                                </SelectItem>
                                                <SelectItem value="JavaScript">
                                                    JavaScript
                                                </SelectItem>
                                                <SelectItem value="Python">Python</SelectItem>
                                                <SelectItem value="Java">Java</SelectItem>
                                                <SelectItem value="Rust">Rust</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />

                            {/* Skills Section */}
                            <FormItem>
                                <FormLabel>Skills</FormLabel>
                                {!isEditing ? (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {form.getValues('skills')?.map((skill) => (
                                            <Badge
                                                key={skill}
                                                variant={isEditing ? 'destructive' : 'secondary'}
                                                onClick={
                                                    isEditing ? () => removeSkill(skill) : undefined
                                                }
                                                className={isEditing ? 'cursor-pointer' : ''}
                                            >
                                                {skill}
                                                {isEditing && ' ✕'}
                                            </Badge>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex space-x-2">
                                        <FormField
                                            control={form.control}
                                            name="skills"
                                            render={({ field }) => (
                                                <MultiSelect
                                                    options={[
                                                        {
                                                            label: 'JavaScript',
                                                            value: 'JavaScript',
                                                        },
                                                        { label: 'React', value: 'React' },
                                                        { label: 'Next.js', value: 'Next.js' },
                                                        { label: 'Node.js', value: 'Node.js' },
                                                        { label: 'Python', value: 'Python' },
                                                        { label: 'Django', value: 'Django' },
                                                    ]}
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    placeholder="Select frameworks"
                                                    variant="inverted"
                                                    animation={2}
                                                />
                                            )}
                                        />
                                    </div>
                                )}
                            </FormItem>

                            {isEditing && (
                                <Button type="submit" className="w-full">
                                    Save Profile
                                </Button>
                            )}
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default DeveloperProfilePage;
