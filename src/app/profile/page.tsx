
'use client';

import { SiteHeader } from '@/components/site-header';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader, Edit2 } from 'lucide-react';
import { useRef, useState } from 'react';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const buyMeACoffeeLink = "https://buymeacoffee.com/snaptheplant";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

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

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatarPreview(result);
        // In a real app, you would upload the file to storage and update the user's photoURL
      };
      reader.readAsDataURL(file);
    }
  };

  const effectiveAvatarSrc = avatarPreview || user.photoURL || `https://placehold.co/100x100.png`;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <div className="flex items-center space-x-6">
                        <div className="relative">
                            <Avatar className="h-24 w-24 border-2 border-primary">
                                <AvatarImage src={effectiveAvatarSrc} alt={user.displayName ?? 'User'} />
                                <AvatarFallback>{user.displayName?.charAt(0)?.toUpperCase() ?? 'U'}</AvatarFallback>
                            </Avatar>
                             <button
                                onClick={handleAvatarClick}
                                className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-110"
                                aria-label="Change profile photo"
                            >
                                <Edit2 className="h-4 w-4" />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>
                        <div className="space-y-1">
                            <CardTitle className="text-3xl font-bold">{user.displayName ?? 'Valued User'}</CardTitle>
                            <CardDescription className="text-base">{user.email}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold">Membership</h3>
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
