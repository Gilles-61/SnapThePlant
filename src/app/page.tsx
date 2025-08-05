
"use client";

import { useState, useRef, useCallback, Suspense } from 'react';
import Image from 'next/image';
import { Loader, Camera, RotateCcw, Image as ImageIcon } from 'lucide-react';

import type { EnhanceIdentificationContextOutput } from '@/ai/flows/enhance-identification-context';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { SiteHeader } from '@/components/site-header';
import { CategorySelector, categories, type Category } from '@/components/category-selector';
import { IdentificationResult } from '@/components/identification-result';
import CameraFeed, { type CameraFeedHandle } from '@/components/camera-feed';
import { useTranslation } from '@/hooks/use-language';

// Mock function to simulate local database lookup
const identifyFromLocalDatabase = (
  category: Category
): EnhanceIdentificationContextOutput => {
  // In a real implementation, this would search a local database.
  // For now, it returns a hardcoded result based on the category.
  const mockResults: Record<Category, EnhanceIdentificationContextOutput> = {
    Plant: {
      speciesName: 'Monstera Deliciosa',
      confidenceScore: 0.95,
      keyInformation:
        'A species of flowering plant native to tropical forests of southern Mexico, south to Panama. It is known for its large, glossy, and uniquely perforated leaves.',
      furtherReading: 'https://en.wikipedia.org/wiki/Monstera_deliciosa',
    },
    Tree: {
      speciesName: 'Oak Tree (Quercus)',
      confidenceScore: 0.92,
      keyInformation:
        'A common tree in the Northern Hemisphere known for its strength, longevity, and acorns. There are approximately 500 extant species of oaks.',
      furtherReading: 'https://en.wikipedia.org/wiki/Oak',
    },
    Weed: {
      speciesName: 'Dandelion (Taraxacum)',
      confidenceScore: 0.98,
      keyInformation:
        'A large genus of flowering plants in the family Asteraceae. They are well-known for their yellow flower heads that turn into round balls of silver-tufted fruits that disperse in the wind.',
      furtherReading: 'https://en.wikipedia.org/wiki/Taraxacum',
    },
    Insect: {
      speciesName: 'European Honey Bee (Apis mellifera)',
      confidenceScore: 0.96,
      keyInformation:
        'The most common of the 7–12 species of honey bees worldwide. They are social insects that live in colonies and are essential for pollination.',
      furtherReading: 'https://en.wikipedia.org/wiki/Western_honey_bee',
    },
  };
  return mockResults[category];
};


export default function HomePage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const cameraRef = useRef<CameraFeedHandle>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>(categories[0].name);
  const [result, setResult] = useState<EnhanceIdentificationContextOutput | null>(null);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleReset = useCallback(() => {
    setCapturedImage(null);
    setResult(null);
    setIsResultOpen(false);
    setIsLoading(false);
    setIsCameraOpen(false);
  }, []);

  const processImage = useCallback(async (imageDataUri: string) => {
    setCapturedImage(imageDataUri);
    setIsLoading(true);

    // Simulate a delay for the database lookup
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      // Replace AI call with a local, mock database lookup
      const localResult = identifyFromLocalDatabase(selectedCategory);
      setResult(localResult);
      setIsResultOpen(true);
    } catch (error) {
      console.error("Local identification failed:", error);
      toast({
        title: t('toast.identificationFailed.title'),
        description: t('toast.identificationFailed.description'),
        variant: "destructive",
      });
      handleReset();
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, toast, t, handleReset]);


  const handleCapture = useCallback(async () => {
    if (!isCameraOpen) {
      setIsCameraOpen(true);
      return;
    }
    const imageDataUri = cameraRef.current?.capture();
    if (imageDataUri) {
      processImage(imageDataUri);
    } else {
      toast({
        title: t('toast.captureFailed.title'),
        description: t('toast.captureFailed.description'),
        variant: "destructive",
      });
    }
  }, [processImage, toast, isCameraOpen, t]);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUri = e.target?.result as string;
        if (imageDataUri) {
          processImage(imageDataUri);
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset file input to allow selecting the same file again
    if(event.target) {
        event.target.value = "";
    }
  };

  const handleFeedback = useCallback(() => {
    // In a real app, this would send feedback to a backend
    toast({
        title: t('toast.feedback.title'),
        description: t('toast.feedback.description'),
    });
    handleReset();
  }, [toast, handleReset, t]);

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
          ) : isCameraOpen ? (
            <Suspense fallback={<div className="w-full h-full bg-muted flex items-center justify-center"><Loader className="animate-spin" /></div>}>
              <CameraFeed ref={cameraRef} />
            </Suspense>
          ) : (
            <div className="w-full h-full bg-muted flex flex-col items-center justify-center text-muted-foreground">
                <ImageIcon className="w-24 h-24 mb-4" />
                <p className="text-lg">{t('placeholder.useCameraOrUpload')}</p>
            </div>
          )}
        </div>

        {isLoading && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
            <Loader className="h-12 w-12 animate-spin text-white" />
            <p className="mt-4 text-white font-semibold">{t('identifying')}</p>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center p-6 space-y-4">
          {!capturedImage && !isLoading && (
            <CategorySelector
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          )}

          <div className="flex items-center justify-center gap-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            {!capturedImage && (
                 <Button
                    size="lg"
                    variant="ghost"
                    className="rounded-full h-16 w-16 p-0 text-white hover:bg-white/20"
                    onClick={handleBrowseClick}
                    disabled={isLoading}
                    aria-label={t('browseImageLabel')}
                >
                    <ImageIcon className="h-7 w-7" />
                </Button>
            )}
           
            <Button
              size="lg"
              className="rounded-full h-20 w-20 p-0 border-4 border-white/50 bg-accent/90 hover:bg-accent text-accent-foreground shadow-2xl disabled:opacity-50 transition-transform active:scale-95"
              onClick={capturedImage ? handleReset : handleCapture}
              disabled={isLoading}
              aria-label={capturedImage ? t('retakePhotoLabel') : t('capturePhotoLabel')}
            >
              {capturedImage ? (
                <RotateCcw className="h-8 w-8" />
              ) : (
                <Camera className="h-8 w-8" />
              )}
            </Button>

            {/* Placeholder to balance the layout */}
            {!capturedImage && <div className="w-16 h-16" />}
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
