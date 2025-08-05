"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ExternalLink, CheckCircle, XCircle } from 'lucide-react';
import type { EnhanceIdentificationContextOutput } from '@/ai/flows/enhance-identification-context';

interface IdentificationResultProps {
  result: EnhanceIdentificationContextOutput | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onReject: () => void;
}

export function IdentificationResult({
  result,
  open,
  onOpenChange,
  onConfirm,
  onReject,
}: IdentificationResultProps) {
  if (!result) return null;

  const confidencePercentage = Math.round(result.confidenceScore * 100);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[90vh] flex flex-col bg-background/95 backdrop-blur-sm">
        <SheetHeader className="text-left pt-2">
          <SheetTitle className="text-3xl font-bold font-headline">{result.speciesName}</SheetTitle>
          <SheetDescription asChild>
            <div className="pt-2">
                <span className="text-sm font-medium text-foreground/80">Confidence Score</span>
                <div className="flex items-center gap-3 mt-1">
                    <Progress value={confidencePercentage} className="w-full h-2.5" />
                    <span className="text-base font-bold text-foreground whitespace-nowrap">{confidencePercentage}%</span>
                </div>
            </div>
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2 font-headline">Key Information</h3>
            <p className="text-foreground/80 leading-relaxed">{result.keyInformation}</p>
          </div>
          {result.furtherReading && (
            <div>
              <h3 className="font-semibold text-lg mb-2 font-headline">Further Reading</h3>
              <a
                href={result.furtherReading.startsWith('http') ? result.furtherReading : `https://${result.furtherReading}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-1 transition-colors"
              >
                Learn more on the web <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
        <SheetFooter className="mt-auto py-4 border-t bg-background/95 sticky bottom-0">
          <div className="w-full">
            <p className="text-center text-sm text-muted-foreground mb-3">Was this identification correct?</p>
            <div className="flex gap-3 w-full">
              <Button variant="outline" size="lg" className="w-full" onClick={onReject}>
                <XCircle className="mr-2 h-5 w-5" /> Incorrect
              </Button>
              <Button size="lg" className="w-full" onClick={onConfirm}>
                <CheckCircle className="mr-2 h-5 w-5" /> Correct
              </Button>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
