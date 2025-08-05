
"use client";

import { useState, useRef, useCallback, Suspense } from 'react';
import Image from 'next/image';
import { Loader, Camera, RotateCcw, Image as ImageIcon } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { SiteHeader } from '@/components/site-header';
import { CategorySelector, categories, type Category } from '@/components/category-selector';
import { IdentificationResult } from '@/components/identification-result';
import CameraFeed, { type CameraFeedHandle } from '@/components/camera-feed';
import { useTranslation } from '@/hooks/use-language';
import { IdentificationQuiz, type Answers } from '@/components/identification-quiz';
import { MatchSelector } from '@/components/match-selector';
import { filterDatabase, type Species } from '@/lib/mock-database';


export default function HomePage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const cameraRef = useRef<CameraFeedHandle>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>(categories[0].name);
  const [result, setResult] = useState<Species | null>(null);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [view, setView] = useState<'capture' | 'quiz' | 'matches'>('capture');
  const [possibleMatches, setPossibleMatches] = useState<Species[]>([]);

  const handleReset = useCallback(() => {
    setCapturedImage(null);
    setResult(null);
    setIsResultOpen(false);
    setIsLoading(false);
    setIsCameraOpen(false);
    setView('capture');
    setPossibleMatches([]);
  }, []);

  const processImage = useCallback(async (imageDataUri: string) => {
    setCapturedImage(imageDataUri);
    setView('quiz');
  }, []);

  const handleQuizComplete = useCallback((answers: Answers) => {
    setIsLoading(true);
    const matches = filterDatabase(selectedCategory, answers);
    setPossibleMatches(matches);
    setView('matches');
    setIsLoading(false);
  }, [selectedCategory]);

  const handleMatchSelected = useCallback((species: Species) => {
    setResult(species);
    setIsResultOpen(true);
  }, []);


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
  
  const renderContent = () => {
    return (
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
        
        {view === 'quiz' && (
            <IdentificationQuiz category={selectedCategory} onComplete={handleQuizComplete} />
        )}
        {view === 'matches' && (
            <MatchSelector matches={possibleMatches} onSelect={handleMatchSelected} onBack={() => setView('quiz')} />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1 relative flex flex-col items-center justify-center overflow-hidden">
        
        {renderContent()}

        {isLoading && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
            <Loader className="h-12 w-12 animate-spin text-white" />
            <p className="mt-4 text-white font-semibold">{t('identifying')}</p>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center p-6 space-y-4">
          {view === 'capture' && !capturedImage && !isLoading && (
            <CategorySelector
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          )}

          {view === 'capture' && <div className="flex items-center justify-center gap-4">
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
          </div>}

          {view !== 'capture' && (
             <Button
                variant="outline"
                className="bg-black/50 border-white/50 text-white hover:bg-black/70 hover:text-white"
                onClick={handleReset}
             >
                <RotateCcw className="mr-2 h-4 w-4" />
                {t('startOver')}
             </Button>
          )}
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
