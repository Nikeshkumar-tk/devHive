'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { handleSignUp } from '@/lib/actions/auth';
import { cn } from '@/lib/utils';
import { customToaster } from '@/lib/utils/toast';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { GoogleSignin } from './GoogleSignin';

export function SignUpForm({ className, ...props }: React.ComponentProps<'div'>) {
    const handleFormSubmitAction = async (formData: FormData) => {
        const response = await handleSignUp(formData);
        if (response && response?.error.status) {
            const errorStatus = response.error.status;
            if (errorStatus === 409) {
                customToaster.error({
                    title: 'Email id already exists.',
                    action: {
                        label: 'Sign In',
                        onClick: () => {
                            redirect('/signin');
                        },
                    },
                });
            }
        }
    };

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card className="overflow-hidden">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form className="p-6 md:p-8" action={handleFormSubmitAction}>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center text-center">
                                <h1 className="text-2xl font-bold">Welcome back</h1>
                                <p className="text-balance text-muted-foreground">
                                    Signup to create devHive account
                                </p>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="m@example.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <a
                                        href="#"
                                        className="ml-auto text-sm underline-offset-2 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input id="password" name="password" type="password" required />
                            </div>
                            <Button type="submit" className="w-full">
                                Sign Up
                            </Button>
                            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                            <GoogleSignin />
                            <Link href={'/signin'}>
                                <div className="text-center text-sm">
                                    Already&apos;t have an account? Sign in
                                </div>
                            </Link>
                        </div>
                    </form>
                    <div className="relative hidden bg-muted md:block">
                        <Image
                            src="/placeholder.svg"
                            alt="Image"
                            width={500}
                            height={500}
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                        />
                    </div>
                </CardContent>
            </Card>
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
                By clicking continue, you agree to our <a href="#">Terms of Service</a> and{' '}
                <a href="#">Privacy Policy</a>.
            </div>
        </div>
    );
}
