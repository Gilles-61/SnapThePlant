
'use client';

import { LoginForm } from '@/components/login-form';

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-1 bg-background flex items-center justify-center">
        <LoginForm />
      </main>
    </div>
  );
}
