
"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import { Loader } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import { SiteHeader } from '@/components/site-header';
import { useAuth } from '@/hooks/use-auth';
import { AuthGate } from '@/components/auth-gate';
import { useRouter } from 'next/navigation';
import { MainApp } from './main-app';


export function HomeClient({ initialCategory }: { initialCategory?: any }) {
  const { user, loading, subscriptionStatus } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && subscriptionStatus === 'free') {
      router.push('/pricing');
    }
  }, [user, loading, subscriptionStatus, router]);

  if (loading) {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <main className="flex-1 flex items-center justify-center">
                <Loader className="h-12 w-12 animate-spin" />
            </main>
        </div>
    )
  }

  if (!user) {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <main className="flex-1">
                <AuthGate />
            </main>
        </div>
    )
  }

  // This case handles free users while they are being redirected.
  if (subscriptionStatus === 'free') {
     return (
        <div className="flex flex-col min-h-screen bg-background">
            <SiteHeader />
            <main className="flex-1 flex items-center justify-center">
                <Loader className="h-12 w-12 animate-spin" />
                <p className="ml-4">Redirecting to pricing...</p>
            </main>
        </div>
    )
  }

  return <MainApp initialCategory={initialCategory} />
}
