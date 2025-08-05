
"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "./ui/button";
import { FileText, Leaf, LogIn } from "lucide-react";
import Link from "next/link";
import Image from "next/image";


export function AuthGate() {
    const { signInWithGoogle } = useAuth();

    return (
        <div className="container relative h-full flex-col items-center justify-center grid lg:max-w-none lg:px-0">
            <div className="p-4 lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <div className="flex items-center justify-center text-lg font-medium">
                            <Leaf className="mr-2 h-6 w-6 text-primary" />
                            <h1 className="text-2xl font-semibold tracking-tight">SnapThePlant</h1>
                        </div>
                         <p className="text-sm text-muted-foreground pt-4">
                            Sign in or create an account to get started.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Button asChild>
                          <Link href="/login">
                            <LogIn className="mr-2 h-4 w-4" />
                            Sign In
                          </Link>
                      </Button>
                       <Button asChild variant="secondary">
                          <Link href="/signup">Create an Account</Link>
                      </Button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or
                            </span>
                        </div>
                    </div>
                    
                    <Button variant="outline" onClick={signInWithGoogle}>
                        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.2 172.9 65.6l-58.2 58.2C336.7 97.2 296.4 80 248 80c-82.8 0-150.5 67.7-150.5 150.5S165.2 401 248 401c94.2 0 125.3-72.3 129.5-110.2h-129.5v-79.6h243.1c1.5 13.8 3.5 29.5 3.5 46.7z"></path></svg>
                        Continue with Google
                    </Button>

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        By signing up, you agree to our Terms of Service and Privacy Policy.
                    </p>

                </div>
            </div>
        </div>
    );
}
