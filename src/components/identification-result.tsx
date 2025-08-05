
"use client";

import { useState } from 'react';
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
import { Droplets, Sun, Sprout, Package, Thermometer, Leaf, Save, X } from 'lucide-react';
import type { Species, CareTip } from '@/lib/mock-database';
import { useTranslation } from '@/hooks/use-language';

interface IdentificationResultProps {
  result: Species | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void; // This will now be for "Save Notes"
  onReject: () => void; // This will now be for "Close"
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
  open,
  onOpenChange,
  onConfirm,
  onReject,
}: IdentificationResultProps) {
  const { t } = useTranslation();
  const [notes, setNotes] = useState('');

  if (!result) return null;

  const handleSaveNotes = () => {
    // In a real app, you'd save the notes to a database.
    console.log("Saving notes for", result.name, ":", notes);
    onConfirm(); // Re-purposing onConfirm for feedback toast
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[90vh] h-full flex flex-col bg-background/95 backdrop-blur-sm p-0">
        <SheetHeader className="text-left p-6">
          <SheetTitle className="text-3xl font-bold font-headline">{result.name}</SheetTitle>
          <SheetDescription asChild>
             <div className="pt-1 text-foreground/80 italic">
              {result.scientificName}
            </div>
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
                <div className="relative aspect-square w-full rounded-lg overflow-hidden border">
                    <Image 
                        src={result.image}
                        alt={result.name}
                        fill
                        className="object-cover"
                        data-ai-hint="nature"
                    />
                </div>
                <div>
                    <h3 className="text-xl font-semibold mb-2 font-headline">{t('result.myNotes')}</h3>
                    <Textarea 
                        placeholder={t('result.notesPlaceholder')} 
                        className="min-h-[150px]"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>
            </div>
            {/* Right Column */}
            <div>
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
        </div>
        <SheetFooter className="mt-auto p-6 border-t bg-background/95 sticky bottom-0">
            <div className="flex gap-3 w-full justify-end">
              <SheetClose asChild>
                <Button variant="outline" size="lg" onClick={onReject}>
                    <X className="mr-2 h-5 w-5" /> {t('result.close')}
                </Button>
              </SheetClose>
              <Button size="lg" onClick={handleSaveNotes}>
                <Save className="mr-2 h-5 w-5" /> {t('result.saveNotes')}
              </Button>
            </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
