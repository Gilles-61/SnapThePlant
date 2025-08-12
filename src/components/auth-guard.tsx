
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader } from 'lucide-react';
import { SiteHeader } from './site-header';

interface AuthGuardProps {
  children: React.ReactNode;
  requirePaid?: boolean;
}

export function AuthGuard({ children, requirePaid = false }: AuthGuardProps) {
  const { user, loading, subscriptionStatus } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    if (requirePaid && subscriptionStatus === 'free') {
      router.push('/pricing');
      return;
    }
  }, [user, loading, subscriptionStatus, router, requirePaid]);

  if (loading || !user || (requirePaid && subscriptionStatus === 'free')) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-4">
            <Loader className="h-12 w-12 animate-spin" />
            <p className="text-muted-foreground">Verifying access...</p>
          </div>
        </main>
      </div>
    );
  }

  return <>{children}</>;
}
