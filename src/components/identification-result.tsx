
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';
import { Droplets, Sun, Sprout, Package, Thermometer, Leaf, ThumbsDown, ThumbsUp, Bookmark, AlertTriangle, BookOpen, Loader, Save } from 'lucide-react';
import type { Species, CareTip } from '@/lib/mock-database';
import { useTranslation } from '@/hooks/use-language';
import { Separator } from './ui/separator';
import { useCollection } from '@/hooks/use-collection';
import { useToast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';
import type { CollectionItem } from '@/hooks/use-collection';
import { generateStory } from '@/ai/flows/generate-story-flow';
import { Card, CardContent } from './ui/card';

// The component can accept a raw Species or a CollectionItem
type ResultType = Species | CollectionItem;

interface IdentificationResultProps {
  result: ResultType | null;
  capturedImage: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Make these optional as they are for the feedback flow
  onConfirm?: () => void;
  onReject?: () => void;
  isSavedItem?: boolean;
}


const iconMap: Record<CareTip['title'], React.ElementType> = {
  Watering: Droplets,
  Sunlight: Sun,
  Soil: Sprout,
  Fertilizer: Package,
  Environment: Thermometer,
  'Extra Tips': Leaf,
};

export function IdentificationResult({
  result,
  capturedImage,
  open,
  onOpenChange,
  onConfirm,
  onReject,
  isSavedItem = false,
}: IdentificationResultProps) {
  const { t } = useTranslation();
  const [notes, setNotes] = useState('');
  const [story, setStory] = useState<string | null>(null);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const { collection, addItem, removeItem } = useCollection();
  const { toast } = useToast();

  useEffect(() => {
    // When the result changes (i.e., a new item is opened),
    // update the notes state from the item's data.
    if (result && 'notes' in result) {
      setNotes(result.notes || '');
    } else {
      setNotes('');
    }
    // Reset story when the sheet opens for a new item
    setStory(null);
  }, [result, open]);


  if (!result) return null;

  const imageToDisplay = capturedImage || ('savedImage' in result && result.savedImage) || result.image;
  
  const collectionItem: CollectionItem | undefined = 'instanceId' in result ? collection?.find(item => item.instanceId === result.instanceId) : undefined;
  const isInCollection = !!collectionItem;

  const handleSaveToggle = () => {
    if (!imageToDisplay) {
        toast({ title: "Cannot save an item without an image.", variant: "destructive"});
        return;
    }

    if (isInCollection && collectionItem) {
      removeItem(collectionItem);
      toast({ title: "Removed from collection" });
    } else {
      // The result might be a raw Species, so cast it before passing
      addItem(result as Species, imageToDisplay, notes);
      toast({ title: "Saved to collection" });
    }
  };

  const handleNotesSave = () => {
    if (isInCollection && collectionItem && imageToDisplay) {
        // Here, we pass the existing collectionItem to ensure the instanceId is preserved
        addItem(collectionItem, imageToDisplay, notes); // addItem also updates existing items
        toast({ title: "Notes Saved", description: "Your notes have been updated in your collection." });
    }
  };
  
  const handleSheetClose = () => {
    onOpenChange(false);
    // If it's a saved item, save the notes when the sheet is closed.
    if (isSavedItem) {
        handleNotesSave();
    }
  }


  const handleGenerateStory = async () => {
    if (!result) return;
    setIsGeneratingStory(true);
    setStory(null);
    try {
        const response = await generateStory({ name: result.name, category: result.category });
        setStory(response.story);
    } catch (error) {
        console.error("Failed to generate story:", error);
        toast({
            title: "Story Time Failed",
            description: "Could not generate a story at this time. Please try again later.",
            variant: "destructive"
        });
    } finally {
        setIsGeneratingStory(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleSheetClose}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[90vh] h-full flex flex-col bg-background/95 backdrop-blur-sm p-0">
        <SheetHeader className="text-left p-6 pb-2">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3">
                <SheetTitle className="text-3xl font-bold font-headline">{result.name}</SheetTitle>
                {result.isPoisonous && (
                  <Badge variant="destructive" className="text-base">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Poisonous
                  </Badge>
                )}
              </div>
              <SheetDescription asChild>
                <div className="pt-1 text-foreground/80 italic">
                  {result.scientificName}
                </div>
              </SheetDescription>
            </div>
            <Button onClick={handleSaveToggle} variant={isInCollection ? 'secondary' : 'default'} size="lg">
              <Bookmark className="mr-2 h-5 w-5" />
              {isInCollection ? 'Saved' : 'Save'}
            </Button>
          </div>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-6 pt-4 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
                <div className="relative aspect-square w-full rounded-lg overflow-hidden border">
                    <Image 
                        src={imageToDisplay}
                        alt={result.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                        data-ai-hint="nature"
                    />
                </div>
                {result.isPoisonous && result.toxicityWarning && (
                     <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                        <h3 className="font-bold text-destructive flex items-center gap-2"><AlertTriangle/>Warning</h3>
                        <p className="text-destructive/90 mt-2">{result.toxicityWarning}</p>
                    </div>
                )}
                 <div>
                    <h3 className="text-xl font-semibold mb-2 font-headline">{t('result.keyInformation')}</h3>
                    <p className="text-muted-foreground">{result.keyInformation}</p>
                </div>

                <div>
                    <Button onClick={handleGenerateStory} disabled={isGeneratingStory}>
                        {isGeneratingStory ? (
                            <>
                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                                Writing...
                            </>
                        ) : (
                             <>
                                <BookOpen className="mr-2 h-4 w-4" />
                                Tell Me a Story
                            </>
                        )}
                    </Button>
                    {story && (
                        <Card className="mt-4">
                            <CardContent className="p-4 space-y-2">
                                <h4 className="font-bold text-lg">Story Time</h4>
                                <p className="text-muted-foreground whitespace-pre-wrap">{story}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
            {/* Right Column */}
            <div className="flex flex-col space-y-6">
                <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 font-headline">{t('result.careTips')}</h3>
                    {result.careTips && result.careTips.length > 0 ? (
                        <Accordion type="single" collapsible className="w-full" defaultValue="Watering">
                            {result.careTips.map((tip) => {
                                const Icon = iconMap[tip.title];
                                return (
                                    <AccordionItem value={tip.title} key={tip.title}>
                                        <AccordionTrigger className="text-base font-medium">
                                            <div className="flex items-center gap-3">
                                                {Icon && <Icon className="w-5 h-5 text-foreground" />}
                                                {t(`result.care_titles.${tip.title.toLowerCase().replace(' ', '_')}`)}
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">
                                            {tip.description}
                                        </AccordionContent>
                                    </AccordionItem>
                                )
                            })}
                        </Accordion>
                    ) : (
                        <p className="text-muted-foreground">{t('result.noCareTips')}</p>
                    )}
                </div>
                
                 <div>
                    <h3 className="text-xl font-semibold mb-2 font-headline">{t('result.myNotes')}</h3>
                    <Textarea 
                        placeholder={t('result.notesPlaceholder')} 
                        className="min-h-[100px]"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                     {isSavedItem && (
                        <Button onClick={handleNotesSave} className="mt-2">
                            <Save className="mr-2 h-4 w-4" />
                            {t('result.saveNotes')}
                        </Button>
                    )}
                </div>
                
                 <div className="mt-auto">
                    <Separator />
                     <div className="pt-4 text-center">
                        {isSavedItem ? (
                           <SheetClose asChild>
                            <Button size="lg" onClick={handleSheetClose} className="w-full sm:w-auto">
                                {t('result.close')}
                            </Button>
                           </SheetClose>
                        ) : (
                            <>
                                <p className="text-sm font-semibold text-muted-foreground mb-3">{t('result.feedbackPrompt')}</p>
                                <div className="flex justify-center gap-4">
                                <SheetClose asChild>
                                    <Button variant="outline" size="lg" onClick={onReject}>
                                        <ThumbsDown className="mr-2" /> {t('result.incorrect')}
                                    </Button>
                                </SheetClose>
                                <SheetClose asChild>
                                    <Button size="lg" onClick={onConfirm}>
                                        <ThumbsUp className="mr-2" /> {t('result.correct')}
                                    </Button>
                                </SheetClose>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
