
'use client';

import { useState } from 'react';
import { SiteHeader } from '@/components/site-header';
import { useTranslation } from '@/hooks/use-language';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { IdentificationResult } from '@/components/identification-result';
import { AuthGuard } from '@/components/auth-guard';
import { Camera, Trash2, Loader } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useCollection, type CollectionItem } from '@/hooks/use-collection';
import { Skeleton } from '@/components/ui/skeleton';

export default function ExplorePage() {
    const { t } = useTranslation();
    const { toast } = useToast();
    const { collection, removeItem, isLoading } = useCollection();
    const [selectedItem, setSelectedItem] = useState<CollectionItem | null>(null);
    const [isResultOpen, setIsResultOpen] = useState(false);

    const handleItemSelect = (item: CollectionItem) => {
        setSelectedItem(item);
        setIsResultOpen(true);
    };

    const handleResultClose = () => {
        setIsResultOpen(false);
        setTimeout(() => setSelectedItem(null), 300);
    };
    
    const handleRemoveItem = (item: CollectionItem) => {
        removeItem(item);
        toast({ title: "Success", description: "Item removed from your collection." });
    };

    return (
        <AuthGuard>
            <div className="flex flex-col min-h-screen bg-background text-foreground">
                <SiteHeader />
                <main className="flex-1 p-4 md:p-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                           <div>
                             <h1 className="text-3xl font-bold font-headline">My Collection</h1>
                             <p className="text-muted-foreground">Plants, insects, and other items you've saved.</p>
                           </div>
                            <Button asChild size="lg">
                                <Link href="/">
                                    <Camera className="mr-2 h-5 w-5" />
                                    Identify a New Species
                                </Link>
                            </Button>
                        </div>

                       {isLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <Card key={i} className="overflow-hidden flex flex-col">
                                        <Skeleton className="aspect-square w-full" />
                                        <CardContent className="p-4 flex-1">
                                            <Skeleton className="h-5 w-3/4 mb-2" />
                                        </CardContent>
                                        <CardFooter className="p-2 pt-0">
                                            <Skeleton className="h-10 w-full" />
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div>
                                {collection && collection.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {collection.map((item, index) => (
                                            <Card key={`${item.id}-${index}`} className="overflow-hidden flex flex-col group transition-shadow hover:shadow-lg relative">
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute top-2 right-2 z-10 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveItem(item);
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">Delete</span>
                                                </Button>
                                                
                                                <CardHeader className="p-0 cursor-pointer" onClick={() => handleItemSelect(item)}>
                                                    <div className="relative aspect-square bg-muted">
                                                        <Image 
                                                            src={item.savedImage}
                                                            alt={item.name} 
                                                            fill
                                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                            className="object-cover transition-transform group-hover:scale-105"
                                                        />
                                                    </div>
                                                </CardHeader>

                                                <CardContent className="p-4 flex-1 flex flex-col cursor-pointer" onClick={() => handleItemSelect(item)}>
                                                    <h3 className="font-bold text-lg">{item.name}</h3>
                                                    <p className="text-sm text-muted-foreground italic -mt-1">{item.scientificName}</p>
                                                </CardContent>

                                                <CardFooter className="p-2 pt-0">
                                                    <Button className="w-full" variant="secondary" onClick={() => handleItemSelect(item)}>View Details</Button>
                                                </CardFooter>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                     <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg text-center text-muted-foreground">
                                        <p className="text-lg font-semibold">Your collection is empty.</p>
                                        <p className="max-w-xs mx-auto">Saved items will appear here. Start by identifying a new plant or insect!</p>
                                        <Button asChild className="mt-4">
                                            <Link href="/">
                                                <Camera className="mr-2 h-5 w-5" />
                                                Identify Something New
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                       )}
                    </div>
                </main>

                <IdentificationResult
                    open={isResultOpen}
                    onOpenChange={(open) => {
                        if (!open) handleResultClose();
                    }}
                    result={selectedItem}
                    capturedImage={selectedItem?.savedImage}
                    isSavedItem={true} // Mark that this is a saved item
                />
            </div>
        </AuthGuard>
    );
}
