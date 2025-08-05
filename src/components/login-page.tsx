
"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "./ui/button";
import { LogIn, FileText } from "lucide-react";
import Image from "next/image";

export function LoginPage() {
    const { signIn } = useAuth();
    // Later, you can replace this with the actual link you mentioned.
    const googleFormLink = "https://docs.google.com/forms/d/e/1FAIpQLSc_1234567890_abcdefg/viewform";

    return (
        <div className="container relative h-full flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
                <div className="absolute inset-0 bg-zinc-900" />
                <div className="relative z-20 flex items-center text-lg font-medium">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-6 w-6"
                >
                    <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                </svg>
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
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Access Your Account
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Sign in to start identifying plants, insects, and more.
                        </p>
                    </div>
                    
                    <Button onClick={signIn}>
                        <LogIn className="mr-2 h-4 w-4" />
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

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        This app is currently in a closed beta. To get access, please fill out our beta tester application form.
                    </p>

                    <Button variant="outline" asChild>
                        <a href={googleFormLink} target="_blank" rel="noopener noreferrer">
                            <FileText className="mr-2 h-4 w-4" />
                            Apply for Beta Access
                        </a>
                    </Button>

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        By signing in, you agree to our{" "}
                        <a
                            href="/terms"
                            className="underline underline-offset-4 hover:text-primary"
                        >
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                            href="/privacy"
                            className="underline underline-offset-4 hover:text-primary"
                        >
                            Privacy Policy
                        </a>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
}
