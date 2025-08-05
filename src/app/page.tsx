"use client";

import { useState, useRef, useCallback, Suspense } from 'react';
import Image from 'next/image';
import { Loader, Camera, RotateCcw } from 'lucide-react';

import { enhanceIdentificationContext, type EnhanceIdentificationContextOutput } from '@/ai/flows/enhance-identification-context';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { SiteHeader } from '@/components/site-header';
import { CategorySelector, categories, type Category } from '@/components/category-selector';
import { IdentificationResult } from '@/components/identification-result';
import CameraFeed, { type CameraFeedHandle } from '@/components/camera-feed';

export default function HomePage() {
  const { toast } = useToast();
  const cameraRef = useRef<CameraFeedHandle>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>(categories[0].name);
  const [result, setResult] = useState<EnhanceIdentificationContextOutput | null>(null);
  const [isResultOpen, setIsResultOpen] = useState(false);

  const handleCapture = useCallback(async () => {
    const imageDataUri = cameraRef.current?.capture();
    if (imageDataUri) {
      setCapturedImage(imageDataUri);
      setIsLoading(true);
      try {
        const aiResult = await enhanceIdentificationContext({
          photoDataUri: imageDataUri,
          description: `Identify this ${selectedCategory.toLowerCase()}. Provide details about it.`,
        });
        setResult(aiResult);
        setIsResultOpen(true);
      } catch (error) {
        console.error("AI identification failed:", error);
        toast({
          title: "Identification Failed",
          description: "Could not identify the image. Please try again with a clearer picture.",
          variant: "destructive",
        });
        handleReset();
      } finally {
        setIsLoading(false);
      }
    } else {
      toast({
        title: "Capture Failed",
        description: "Could not capture an image from the camera.",
        variant: "destructive",
      });
    }
  }, [selectedCategory, toast]);

  const handleReset = useCallback(() => {
    setCapturedImage(null);
    setResult(null);
    setIsResultOpen(false);
    setIsLoading(false);
  }, []);

  const handleFeedback = useCallback(() => {
    // In a real app, this would send feedback to a backend
    toast({
        title: "Thank you!",
        description: "Your feedback helps us improve.",
    });
    handleReset();
  }, [toast, handleReset]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1 relative flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black">
          {capturedImage ? (
            <Image
              src={capturedImage}
              alt="Captured for identification"
              fill
              className="object-contain"
            />
          ) : (
            <Suspense fallback={<div className="w-full h-full bg-muted flex items-center justify-center"><Loader className="animate-spin" /></div>}>
              <CameraFeed ref={cameraRef} />
            </Suspense>
          )}
        </div>

        {isLoading && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
            <Loader className="h-12 w-12 animate-spin text-white" />
            <p className="mt-4 text-white font-semibold">Identifying...</p>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center p-6 space-y-4">
          {!capturedImage && !isLoading && (
            <CategorySelector
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          )}

          <div className="flex justify-center">
            <Button
              size="lg"
              className="rounded-full h-20 w-20 p-0 border-4 border-white/50 bg-accent/90 hover:bg-accent text-accent-foreground shadow-2xl disabled:opacity-50 transition-transform active:scale-95"
              onClick={capturedImage ? handleReset : handleCapture}
              disabled={isLoading}
              aria-label={capturedImage ? 'Retake photo' : 'Capture photo'}
            >
              {capturedImage ? (
                <RotateCcw className="h-8 w-8" />
              ) : (
                <Camera className="h-8 w-8" />
              )}
            </Button>
          </div>
        </div>
        
        <IdentificationResult
          open={isResultOpen}
          onOpenChange={(open) => {
            if (!open) handleReset();
            else setIsResultOpen(true);
          }}
          result={result}
          onConfirm={handleFeedback}
          onReject={handleReset}
        />
      </main>
    </div>
  );
}
