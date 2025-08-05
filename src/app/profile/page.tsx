
'use client';

import { SiteHeader } from '@/components/site-header';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader, Edit2, Trash2, Heart } from 'lucide-react';
import { useRef, useState } from 'react';
import { useTranslation } from '@/hooks/use-language';
import { useCollection } from '@/hooks/use-collection';
import type { Species } from '@/lib/mock-database';
import Image from 'next/image';
import { IdentificationResult } from '@/components/identification-result';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const { t } = useTranslation();
  const { collection, removeItem } = useCollection();
  const buyMeACoffeeLink = "https://buymeacoffee.com/snaptheplant";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);
  const [isResultOpen, setIsResultOpen] = useState(false);

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
                <p>{t('profile.loginPrompt')}</p>
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

  const handleSpeciesSelect = (species: Species) => {
    setSelectedSpecies(species);
    setIsResultOpen(true);
  };
  
  const handleResultClose = () => {
      setIsResultOpen(false);
      setTimeout(() => setSelectedSpecies(null), 300);
  }

  const effectiveAvatarSrc = avatarPreview || user.photoURL || `https://placehold.co/100x100.png`;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1 p-4 md:p-8">
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
                        <p className="text-muted-foreground">{t('profile.freePlan')}</p>
                        <Button asChild>
                             <a href={buyMeACoffeeLink} target="_blank" rel="noopener noreferrer">
                                <Heart className="mr-2 h-4 w-4" />
                                Support the Project
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
                            {collection.map(item => (
                                <div key={item.id} className="relative group">
                                    <Card className="overflow-hidden cursor-pointer" onClick={() => handleSpeciesSelect(item)}>
                                        <div className="relative aspect-square">
                                            <Image src={item.image} alt={item.name} fill sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw" className="object-cover" />
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
                                            removeItem(item.id);
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
            result={selectedSpecies}
            onConfirm={handleResultClose}
            onReject={handleResultClose}
        />
    </div>
  );
}
