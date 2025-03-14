import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import {
    ArrowRight,
    ChevronRight,
    Code2,
    Github,
    Layers,
    Lightbulb,
    Linkedin,
    MessageSquare,
    Twitter,
    Users,
} from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {
    const session = await auth();
    console.log('Session', session);
    return (
        <div className="flex min-h-[100dvh] flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Code2 className="h-6 w-6 text-primary" />
                        <span className="text-xl font-bold">
                            dev<span className="text-secondary">Hive</span>
                        </span>
                    </div>
                    <nav className="hidden md:flex gap-6">
                        <Link href="#features" className="text-sm font-medium hover:text-primary">
                            Features
                        </Link>
                        <Link href="#community" className="text-sm font-medium hover:text-primary">
                            Community
                        </Link>
                        <Link href="#pricing" className="text-sm font-medium hover:text-primary">
                            Pricing
                        </Link>
                        <Link href="#faq" className="text-sm font-medium hover:text-primary">
                            FAQ
                        </Link>
                    </nav>
                    {session && session.user ? (
                        <Link href={'/home'}>
                            <Button className="bg-primary hover:bg-primary/90">
                                Go to app <ArrowRight />
                            </Button>
                        </Link>
                    ) : (
                        <Link href={'/signin'}>
                            <Button className="bg-primary hover:bg-primary/90">Sign In</Button>
                        </Link>
                    )}
                </div>
            </header>
            <main className="flex-1">
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                            <div className="flex flex-col justify-center space-y-4">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                                        Connect, Collaborate,{' '}
                                        <span className="text-primary">Code</span> Together
                                    </h1>
                                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                                        Join the hive mind of developers. Share ideas, form teams,
                                        and build amazing projects in a vibrant community of
                                        like-minded tech enthusiasts.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                    <Button
                                        size="lg"
                                        className="bg-primary hover:bg-primary/90 gap-1"
                                    >
                                        Get Started <ChevronRight className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="border-primary text-primary hover:bg-primary/10"
                                    >
                                        Learn More
                                    </Button>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-primary/30 to-secondary/30 rounded-xl blur-xl opacity-70"></div>
                                <Image
                                    src="/placeholder.svg?height=550&width=550"
                                    width={550}
                                    height={550}
                                    alt="Developer collaboration"
                                    className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last shadow-lg"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                                    Features
                                </div>
                                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                                    Everything you need to{' '}
                                    <span className="text-primary">build</span> together
                                </h2>
                                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    devHive provides all the tools developers need to connect, share
                                    ideas, and build amazing projects together.
                                </p>
                            </div>
                        </div>
                        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
                            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm bg-white hover:border-primary/50 hover:shadow-md transition-all">
                                <div className="rounded-full bg-primary/10 p-3">
                                    <MessageSquare className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold">Chat Rooms</h3>
                                <p className="text-center text-muted-foreground">
                                    Real-time communication with developers from around the world.
                                </p>
                            </div>
                            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm bg-white hover:border-primary/50 hover:shadow-md transition-all">
                                <div className="rounded-full bg-secondary/20 p-3">
                                    <Lightbulb className="h-6 w-6 text-secondary" />
                                </div>
                                <h3 className="text-xl font-bold">Idea Sharing</h3>
                                <p className="text-center text-muted-foreground">
                                    Post your project ideas and get feedback from the community.
                                </p>
                            </div>
                            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm bg-white hover:border-primary/50 hover:shadow-md transition-all">
                                <div className="rounded-full bg-accent/10 p-3">
                                    <Users className="h-6 w-6 text-accent" />
                                </div>
                                <h3 className="text-xl font-bold">Team Building</h3>
                                <p className="text-center text-muted-foreground">
                                    Find the perfect teammates for your next big project.
                                </p>
                            </div>
                            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm bg-white hover:border-primary/50 hover:shadow-md transition-all">
                                <div className="rounded-full bg-primary/10 p-3">
                                    <Layers className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold">Project Management</h3>
                                <p className="text-center text-muted-foreground">
                                    Organize tasks, track progress, and manage your projects
                                    efficiently.
                                </p>
                            </div>
                            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm bg-white hover:border-primary/50 hover:shadow-md transition-all">
                                <div className="rounded-full bg-secondary/20 p-3">
                                    <Code2 className="h-6 w-6 text-secondary" />
                                </div>
                                <h3 className="text-xl font-bold">Code Collaboration</h3>
                                <p className="text-center text-muted-foreground">
                                    Share code snippets, review code, and collaborate in real-time.
                                </p>
                            </div>
                            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm bg-white hover:border-primary/50 hover:shadow-md transition-all">
                                <div className="rounded-full bg-accent/10 p-3">
                                    <Github className="h-6 w-6 text-accent" />
                                </div>
                                <h3 className="text-xl font-bold">GitHub Integration</h3>
                                <p className="text-center text-muted-foreground">
                                    Connect your GitHub repositories and streamline your workflow.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    id="community"
                    className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-secondary/5 via-background to-primary/5"
                >
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-2">
                            <div className="space-y-4">
                                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-secondary-foreground">
                                    Community
                                </div>
                                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                                    Join a thriving developer{' '}
                                    <span className="text-secondary">ecosystem</span>
                                </h2>
                                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    Connect with thousands of developers, from beginners to experts,
                                    all passionate about building great software.
                                </p>
                                <ul className="grid gap-2">
                                    <li className="flex items-center gap-2">
                                        <ChevronRight className="h-4 w-4 text-secondary" />
                                        <span>Over 10,000 active developers</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <ChevronRight className="h-4 w-4 text-secondary" />
                                        <span>500+ successful team formations</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <ChevronRight className="h-4 w-4 text-secondary" />
                                        <span>1,000+ projects launched</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <ChevronRight className="h-4 w-4 text-secondary" />
                                        <span>24/7 active discussions</span>
                                    </li>
                                </ul>
                                <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-1">
                                    Join the Community <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-secondary/30 to-primary/30 rounded-xl blur-xl opacity-70"></div>
                                <Image
                                    src="/placeholder.svg?height=400&width=600"
                                    width={600}
                                    height={400}
                                    alt="Developer community"
                                    className="mx-auto aspect-video overflow-hidden rounded-xl object-cover shadow-lg"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                                    Loved by <span className="text-primary">developers</span>
                                </h2>
                                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    See what our community members have to say about their
                                    experience with devHive.
                                </p>
                            </div>
                        </div>
                        <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
                            <div className="flex flex-col justify-between rounded-lg border bg-white p-6 shadow-sm hover:shadow-md transition-all">
                                <div className="space-y-2">
                                    <p className="text-muted-foreground">
                                        &#34;devHive helped me find the perfect teammates for my
                                        startup. We&rsquo;ve been working together for 6 months now
                                        and just secured our first round of funding!&#34;
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 pt-4">
                                    <div className="rounded-full bg-primary/20 h-10 w-10 flex items-center justify-center text-primary font-bold">
                                        SJ
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Sarah Johnson</p>
                                        <p className="text-xs text-muted-foreground">
                                            Founder, CodeSync
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col justify-between rounded-lg border bg-white p-6 shadow-sm hover:shadow-md transition-all">
                                <div className="space-y-2">
                                    <p className="text-muted-foreground">
                                        &#34;The chat rooms and discussion forums have been
                                        invaluable for getting feedback on my projects. The
                                        community is incredibly supportive and knowledgeable.&#34;
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 pt-4">
                                    <div className="rounded-full bg-secondary/20 h-10 w-10 flex items-center justify-center text-secondary font-bold">
                                        MC
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Michael Chen</p>
                                        <p className="text-xs text-muted-foreground">
                                            Full Stack Developer
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col justify-between rounded-lg border bg-white p-6 shadow-sm hover:shadow-md transition-all">
                                <div className="space-y-2">
                                    <p className="text-muted-foreground">
                                        &ldquo;As a self-taught developer, devHive has been crucial
                                        for my growth. I&apos;ve learned so much from the community
                                        and even landed my first job through a connection I made
                                        here.&rdquo;
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 pt-4">
                                    <div className="rounded-full bg-accent/20 h-10 w-10 flex items-center justify-center text-accent font-bold">
                                        AR
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Alex Rivera</p>
                                        <p className="text-xs text-muted-foreground">
                                            Junior Developer
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    id="cta"
                    className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-primary to-accent text-white"
                >
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                                    Ready to join the <span className="text-secondary">hive</span>?
                                </h2>
                                <p className="max-w-[600px] text-white/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    Start connecting with developers, sharing ideas, and building
                                    amazing projects today.
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                <Button
                                    size="lg"
                                    className="bg-white text-primary hover:bg-white/90 gap-1"
                                >
                                    Sign Up Now <ChevronRight className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-white text-white hover:bg-white/10"
                                >
                                    Learn More
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="w-full border-t bg-background py-6">
                <div className="container flex flex-col items-center justify-between gap-4 md:flex-row px-4 md:px-6">
                    <div className="flex items-center gap-2">
                        <Code2 className="h-5 w-5 text-primary" />
                        <span className="text-lg font-semibold">
                            dev<span className="text-secondary">Hive</span>
                        </span>
                    </div>
                    <p className="text-center text-sm text-muted-foreground md:text-left">
                        &copy; {new Date().getFullYear()} devHive. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        <Link
                            href="#"
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                            <Github className="h-5 w-5" />
                            <span className="sr-only">GitHub</span>
                        </Link>
                        <Link
                            href="#"
                            className="text-muted-foreground hover:text-accent transition-colors"
                        >
                            <Twitter className="h-5 w-5" />
                            <span className="sr-only">Twitter</span>
                        </Link>
                        <Link
                            href="#"
                            className="text-muted-foreground hover:text-secondary transition-colors"
                        >
                            <Linkedin className="h-5 w-5" />
                            <span className="sr-only">LinkedIn</span>
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
