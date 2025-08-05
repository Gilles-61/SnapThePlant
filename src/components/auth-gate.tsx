
"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "./ui/button";
import { FileText, Leaf, LogIn } from "lucide-react";
import Link from "next/link";
import Image from "next/image";


export function AuthGate() {
    const { signInWithGoogle } = useAuth();
    const googleFormLink = "https://docs.google.com/forms/d/e/1FAIpQLSfmHONQYVgZumuAEx1t6VHULp7fDIWjeu8iNtYxpz6EYsngGg/viewform?pli=1";

    return (
        <div className="container relative h-full flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
                <Image
                    src="https://placehold.co/1080x1920.png"
                    alt="A beautiful collection of flowers"
                    fill
                    className="object-cover"
                    data-ai-hint="flowers"
                />
                <div className="absolute inset-0 bg-zinc-900/60" />
                <div className="relative z-20 flex items-center text-lg font-medium">
                    <Leaf className="mr-2 h-6 w-6" />
                    SnapThePlant
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                    <p className="text-lg">
                        &ldquo;This app helped me identify a rare orchid in my backyard! An indispensable tool for any nature enthusiast.&rdquo;
                    </p>
                    <footer className="text-sm">Beta Tester</footer>
                    </blockquote>
                </div>
            </div>
            <div className="p-4 lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Welcome to SnapThePlant
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Sign in or create an account to start identifying plants, insects, and more.
                        </p>
                    </div>
                    
                    <Button asChild>
                        <Link href="/login">
                          <LogIn className="mr-2 h-4 w-4" />
                          Sign In with Email
                        </Link>
                    </Button>

                    <Button variant="outline" onClick={signInWithGoogle}>
                        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.2 172.9 65.6l-58.2 58.2C336.7 97.2 296.4 80 248 80c-82.8 0-150.5 67.7-150.5 150.5S165.2 401 248 401c94.2 0 125.3-72.3 129.5-110.2h-129.5v-79.6h243.1c1.5 13.8 3.5 29.5 3.5 46.7z"></path></svg>
                        Sign in with Google
                    </Button>
                    
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or join the beta
                            </span>
                        </div>
                    </div>

                     <Button asChild>
                        <Link href="/signup">Create an Account</Link>
                    </Button>

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        This app is currently in a closed beta. To get priority access, please fill out our beta tester application form.
                    </p>

                    <Button variant="secondary" asChild>
                        <a href={googleFormLink} target="_blank" rel="noopener noreferrer">
                            <FileText className="mr-2 h-4 w-4" />
                            Apply for Beta Access
                        </a>
                    </Button>

                </div>
            </div>
        </div>
    );
}
