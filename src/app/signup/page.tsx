'use client';

import { SignUpForm } from '@/components/signup-form';
import { SiteHeader } from '@/components/site-header';

export default function SignUpPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">
        <SignUpForm />
      </main>
    </div>
  );
}
