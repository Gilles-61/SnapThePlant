
'use client';

import { SiteHeader } from '@/components/site-header';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader, Edit2, Trash2, Heart, ShieldCheck, Bug } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/use-language';
import { useCollection, type CollectionItem } from '@/hooks/use-collection';
import type { Species } from '@/lib/mock-database';
import Image from 'next/image';
import { IdentificationResult } from '@/components/identification-result';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';

export default function ProfilePage() {
  const { user, loading, subscriptionStatus } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();
  const { collection, removeItem } = useCollection();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<CollectionItem | null>(null);
  const [isResultOpen, setIsResultOpen] = useState(false);

  const planDetails = {
    beta: { name: 'Beta Tester', description: 'You have full access during the beta period. Your feedback is invaluable!' },
    paid: { name: 'Paid Subscriber', description: 'Thank you for your support! You have full access.' },
    free: { name: 'Free Plan', description: 'Upgrade to a paid plan for more features.' }
  }

  useEffect(() => {
    if (!loading && !user) {
        router.push('/login');
    }
  }, [user, loading, router]);


  if (loading || !user) {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <SiteHeader />
            <main className="flex-1 flex items-center justify-center bg-background">
                <Loader className="h-12 w-12 animate-spin" />
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

  const handleSpeciesSelect = (item: CollectionItem) => {
    setSelectedItem(item);
    setIsResultOpen(true);
  };
  
  const handleResultClose = () => {
      setIsResultOpen(false);
      setTimeout(() => setSelectedItem(null), 300);
  }

  const effectiveAvatarSrc = avatarPreview || user.photoURL || `https://placehold.co/100x100.png`;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1 p-4 md:p-8 bg-background">
        <div className="max-w-4xl mx-auto space-y-8">
            <Card>
                <CardHeader>
                    <div className="flex items-center space-x-6">
                        <div className="relative">
                            <Avatar className="h-24 w-24 border-2 border-primary">
                                <AvatarImage src={effectiveAvatarSrc} alt={user.displayName ?? t('profile.valuedUser')} />
                                <AvatarFallback>{user.displayName?.charAt(0)?.toUpperCase() ?? 'U'}</AvatarFallback>
                            </Avatar>
                             <button
                                onClick={handleAvatarClick}
                                className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-110"
                                aria-label={t('profile.editPhotoLabel')}
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
                            <CardTitle className="text-3xl font-bold">{user.displayName ?? t('profile.valuedUser')}</CardTitle>
                            <CardDescription className="text-base">{user.email}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold">{t('profile.membership')}</h3>
                        <div className="flex items-center gap-2 text-primary font-semibold">
                            <ShieldCheck className="h-5 w-5" />
                            <span>{planDetails[subscriptionStatus].name}</span>
                        </div>
                        <p className="text-muted-foreground">{planDetails[subscriptionStatus].description}</p>
                         <Button asChild>
                             <Link href="/pricing">
                                {subscriptionStatus === 'paid' ? 'Manage Subscription' : 'View Plans'}
                            </Link>
                        </Button>
                    </div>
                    <Separator />
                     <div className="space-y-2">
                        <h3 className="text-xl font-semibold">Feedback & Bug Reports</h3>
                        <p className="text-muted-foreground">As a beta tester, your feedback is crucial. If you find an issue or have a suggestion, please let us know.</p>
                         <Button asChild variant="secondary">
                            <a href="mailto:feedback@snaptheplant.com?subject=Beta Feedback for SnapThePlant">
                                <Bug className="mr-2 h-4 w-4" />
                                Report an Issue
                            </a>
                        </Button>
                    </div>
                     <Separator />
                     <div className="space-y-2">
                        <h3 className="text-xl font-semibold">Support the Project</h3>
                        <p className="text-muted-foreground">If you enjoy SnapThePlant, please consider supporting its development. Your contribution helps us add new features and improve identification accuracy.</p>
                         <Button asChild variant="secondary">
                            <a href="https://buymeacoffee.com/snaptheplant" target="_blank" rel="noopener noreferrer">
                                <Heart className="mr-2 h-4 w-4" />
                                Support on Buy Me a Coffee
                            </a>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>My Collection</CardTitle>
                    <CardDescription>Items you have saved for offline viewing.</CardDescription>
                </CardHeader>
                <CardContent>
                    {collection && collection.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {collection.map((item, index) => (
                                <div key={`${item.id}-${index}`} className="relative group">
                                    <Card className="overflow-hidden cursor-pointer" onClick={() => handleSpeciesSelect(item)}>
                                        <div className="relative aspect-square">
                                            <Image src={item.savedImage} alt={item.name} fill sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw" className="object-cover" />
                                        </div>
                                        <div className="p-2">
                                            <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                                        </div>
                                    </Card>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeItem(item);
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center py-8">Your collection is empty. Save items you identify to see them here.</p>
                    )}
                </CardContent>
            </Card>
        </div>
      </main>

       <IdentificationResult
            open={isResultOpen}
            onOpenChange={(open) => {
                if (!open) handleResultClose();
            }}
            result={selectedItem}
            capturedImage={selectedItem?.savedImage}
            onConfirm={handleResultClose}
            onReject={handleResultClose}
        />
    </div>
  );
}
