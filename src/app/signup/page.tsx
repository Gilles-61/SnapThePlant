
'use client';

import { SignUpForm } from '@/components/signup-form';

export default function SignUpPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-1 bg-background flex items-center justify-center">
        <SignUpForm />
      </main>
    </div>
  );
}
