'use client';

import { SignUpForm } from '@/components/signup-form';
import { AuthHeader } from '@/components/auth-header';

export default function SignUpPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <AuthHeader />
      <main className="flex-1 bg-background flex items-center justify-center">
        <SignUpForm />
      </main>
    </div>
  );
}
