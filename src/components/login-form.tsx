
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { Eye, EyeOff, Leaf, LogIn } from 'lucide-react';
import Image from 'next/image';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

const passwordResetSchema = z.object({
    resetEmail: z.string().email({ message: 'Please enter a valid email to send a reset link.' }),
});

export function LoginForm() {
  const { signInWithEmail, signInWithGoogle, sendPasswordReset } = useAuth();
  const { toast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetError, setResetError] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await signInWithEmail(values.email, values.password);
  }

  const handlePasswordReset = async () => {
    try {
        passwordResetSchema.parse({ resetEmail });
        setResetError('');
        await sendPasswordReset(resetEmail);
        toast({
            title: "Password Reset Email Sent",
            description: `If an account exists for ${resetEmail}, you will receive a password reset link.`,
        });
        setIsResetDialogOpen(false);
        setResetEmail('');
    } catch (error) {
        if (error instanceof z.ZodError) {
            setResetError(error.errors[0].message);
        } else {
            console.error("Password reset error:", error);
             toast({
                title: "Error",
                description: "Failed to send password reset email. Please try again.",
                variant: "destructive",
            });
        }
    }
  }

  return (
    <div className="container relative grid h-full flex-col items-center justify-center lg:max-w-none lg:px-0">
        <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Sign In</h1>
            <p className="text-sm text-muted-foreground">
                Enter your credentials to access your account. Your username is your email address.
            </p>
            </div>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                        <div className="flex justify-between items-center">
                            <FormLabel>Password</FormLabel>
                            <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                                <AlertDialogTrigger asChild>
                                    <Button variant="link" type="button" className="p-0 h-auto text-xs">Forgot Password?</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Reset Your Password</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Enter your email address below and we&apos;ll send you a link to reset your password.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <div className="space-y-2">
                                        <Label htmlFor="reset-email">Email</Label>
                                        <Input 
                                            id="reset-email" 
                                            placeholder="name@example.com" 
                                            value={resetEmail}
                                            onChange={(e) => setResetEmail(e.target.value)}
                                        />
                                        {resetError && <p className="text-sm font-medium text-destructive">{resetError}</p>}
                                    </div>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handlePasswordReset}>Send Reset Link</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                        <div className="relative">
                          <FormControl>
                              <Input type={showPassword ? "text" : "password"} placeholder="Your password" {...field} />
                          </FormControl>
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3">
                            {showPassword ? <EyeOff className="h-5 w-5 text-muted-foreground" /> : <Eye className="h-5 w-5 text-muted-foreground" />}
                          </button>
                        </div>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" className="w-full">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
                </Button>
            </form>
            </Form>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                    </span>
                </div>
            </div>
            <Button variant="outline" onClick={signInWithGoogle}>
                 <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.2 172.9 65.6l-58.2 58.2C336.7 97.2 296.4 80 248 80c-82.8 0-150.5 67.7-150.5 150.5S165.2 401 248 401c94.2 0 125.3-72.3 129.5-110.2h-129.5v-79.6h243.1c1.5 13.8 3.5 29.5 3.5 46.7z"></path></svg>
                Sign In with Google
            </Button>
            <div className="text-center text-sm text-muted-foreground space-y-1">
                <p>
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/signup"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Sign up
                    </Link>
                </p>
                <p>
                    Having trouble?{" "}
                    <a
                        href="mailto:support@snaptheplant.com"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Contact Support
                    </a>
                </p>
            </div>
        </div>
        </div>
    </div>
  );
}
