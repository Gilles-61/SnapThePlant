
'use client';

import { SiteHeader } from '@/components/site-header';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const buyMeACoffeeLink = "https://buymeacoffee.com/snaptheplant";

  if (loading) {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <SiteHeader />
            <main className="flex-1 flex items-center justify-center">
                <Loader className="h-12 w-12 animate-spin" />
            </main>
        </div>
    )
  }

  if (!user) {
    // This should ideally not be reached if page is protected
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <SiteHeader />
            <main className="flex-1 flex items-center justify-center">
                <p>Please log in to see your profile.</p>
            </main>
        </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={user.photoURL ?? "https://placehold.co/100x100.png"} alt={user.displayName ?? 'User'} />
                            <AvatarFallback>{user.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <CardTitle className="text-3xl">{user.displayName ?? 'Valued User'}</CardTitle>
                            <CardDescription>{user.email}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Membership</h3>
                        <p className="text-muted-foreground">You are currently on the free plan.</p>
                        <Button asChild>
                             <a href={buyMeACoffeeLink} target="_blank" rel="noopener noreferrer">
                                Manage Subscription
                            </a>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
