
"use client";

import { useState, useRef, useCallback, Suspense } from 'react';
import Image from 'next/image';
import { Loader, Camera, RotateCcw, Image as ImageIcon, Upload } from 'lucide-react';

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
import { useAuth } from '@/hooks/use-auth';
import { AuthGate } from '@/components/auth-gate';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';


export default function HomePage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const cameraRef = useRef<CameraFeedHandle>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [result, setResult] = useState<Species | null>(null);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [view, setView] = useState<'capture' | 'quiz' | 'matches'>('capture');
  const [possibleMatches, setPossibleMatches] = useState<Species[]>([]);
  const [isSourceSelectorOpen, setIsSourceSelectorOpen] = useState(false);
  const [isCategorySelectorOpen, setIsCategorySelectorOpen] = useState(false);


  const handleReset = useCallback(() => {
    setCapturedImage(null);
    setResult(null);
    setIsResultOpen(false);
    setIsLoading(false);
    setIsCameraOpen(false);
    setView('capture');
    setPossibleMatches([]);
    setSelectedCategory(null);
  }, []);

  const processImage = useCallback(async (imageDataUri: string) => {
    setCapturedImage(imageDataUri);
    setView('quiz');
  }, []);

  const handleQuizComplete = useCallback((answers: Answers) => {
    if (!selectedCategory) return;
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
  }, [processImage, toast, t]);

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

  const handleSaveNotes = useCallback(() => {
    // In a real app, this would send feedback to a backend
    toast({
        title: t('toast.feedback.title'),
        description: t('toast.feedback.description'),
    });
    // Don't reset immediately, let the sheet close handle it.
  }, [toast, t]);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setIsSourceSelectorOpen(true);
    setIsCategorySelectorOpen(false);
  }
  
  const handleCameraButtonClick = () => {
    if (selectedCategory) {
        setIsCameraOpen(true);
    } else {
        setIsCategorySelectorOpen(true);
    }
  };


  const renderContent = () => {
    // In quiz or matches view, show the image
    if (view !== 'capture' && capturedImage) {
      return (
         <div className="absolute inset-0 bg-black">
          <Image
            src={capturedImage}
            alt="Captured for identification"
            fill
            className="object-contain"
          />
           {view === 'quiz' && selectedCategory && (
              <IdentificationQuiz category={selectedCategory} onComplete={handleQuizComplete} />
          )}
          {view === 'matches' && (
              <MatchSelector matches={possibleMatches} onSelect={handleMatchSelected} onBack={() => setView('quiz')} />
          )}
        </div>
      )
    }

    if (isCameraOpen) {
      return (
        <div className="absolute inset-0 bg-black">
           <Suspense fallback={<div className="w-full h-full bg-muted flex items-center justify-center"><Loader className="animate-spin" /></div>}>
            <CameraFeed ref={cameraRef} />
          </Suspense>
        </div>
      )
    }

    return (
      <div className="w-full h-full bg-muted flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
          <ImageIcon className="w-24 h-24 mb-4" />
          <p className="text-lg font-semibold text-foreground mb-2">Select a category to begin</p>
          <p className="max-w-md mb-6">Choose whether you want to identify a plant, tree, weed, or insect to get started.</p>
           <Button size="lg" onClick={handleCameraButtonClick}>
                <Camera className="mr-2"/>
                Use Camera
            </Button>
      </div>
    );
  }

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
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <SiteHeader />
            <main className="flex-1">
                <AuthGate />
            </main>
        </div>
    )
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
          
          {(view === 'capture' && !isCameraOpen) && (
             <Button size="lg" onClick={() => { handleBrowseClick(); }}>
                <Upload className="mr-2" />
                Upload from Gallery
            </Button>
          )}

          {isCameraOpen && (
             <Button
                size="lg"
                className="rounded-full h-20 w-20 p-0 border-4 border-white/50 bg-accent/90 hover:bg-accent text-accent-foreground shadow-2xl disabled:opacity-50 transition-transform active:scale-95"
                onClick={handleCapture}
                disabled={isLoading}
                aria-label={t('capturePhotoLabel')}
              >
                  <Camera className="h-8 w-8" />
              </Button>
          )}

          {(view !== 'capture' || isCameraOpen) && (
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
          onConfirm={handleSaveNotes}
          onReject={handleReset}
        />

        <AlertDialog open={isCategorySelectorOpen} onOpenChange={setIsCategorySelectorOpen}>
             <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>First, select a category</AlertDialogTitle>
                    <AlertDialogDescription>
                        This helps us narrow down the possibilities.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
                    <CategorySelector
                        selectedCategory={selectedCategory}
                        onSelectCategory={handleCategorySelect}
                    />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>


        <AlertDialog open={isSourceSelectorOpen} onOpenChange={setIsSourceSelectorOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Now, provide an image</AlertDialogTitle>
                    <AlertDialogDescription>
                        You can use your camera or upload from your gallery.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <Button size="lg" onClick={() => { setIsCameraOpen(true); setIsSourceSelectorOpen(false); }}>
                        <Camera className="mr-2"/>
                        Use Camera
                    </Button>
                     <Button size="lg" onClick={() => { handleBrowseClick(); setIsSourceSelectorOpen(false); }}>
                        <Upload className="mr-2" />
                        Upload Image
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
        />

      </main>
    </div>
  );
}
