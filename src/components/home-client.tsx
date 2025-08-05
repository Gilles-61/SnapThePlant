
"use client";

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Loader, Camera, RotateCcw, Image as ImageIcon, Upload, QrCode } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { SiteHeader } from '@/components/site-header';
import { CategorySelector } from '@/components/category-selector';
import { IdentificationResult } from '@/components/identification-result';
import CameraFeed, { type CameraFeedHandle } from '@/components/camera-feed';
import { useTranslation } from '@/hooks/use-language';
import { MatchSelector } from '@/components/match-selector';
import { filterDatabase, type Species } from '@/lib/mock-database';
import { useAuth } from '@/hooks/use-auth';
import { AuthGate } from '@/components/auth-gate';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { SearchInput } from './search-input';
import { analyzeImage, type AnalyzeImageOutput } from '@/ai/flows/analyze-image-flow';
import type { Category } from '@/lib/categories';
import { BarcodeScanner } from './barcode-scanner';


export function HomeClient({ initialCategory }: { initialCategory?: Category }) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const cameraRef = useRef<CameraFeedHandle>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(initialCategory || null);
  const [result, setResult] = useState<Species | null>(null);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [view, setView] = useState<'capture' | 'matches'>('capture');
  const [possibleMatches, setPossibleMatches] = useState<Species[]>([]);
  const [isSourceSelectorOpen, setIsSourceSelectorOpen] = useState(false);
  const [isCategorySelectorOpen, setIsCategorySelectorOpen] = useState(false);


  const handleReset = useCallback(() => {
    setCapturedImage(null);
    setResult(null);
    setIsResultOpen(false);
    setIsLoading(false);
    setIsCameraOpen(false);
    setIsScannerOpen(false);
    setView('capture');
    setPossibleMatches([]);
    setSelectedCategory(null);
  }, []);

  const findMatches = useCallback(async (imageDataUri: string, category: Category) => {
    setCapturedImage(imageDataUri);
    setIsLoading(true);
    setView('matches');

    try {
      const analysis: AnalyzeImageOutput = await analyzeImage({
        photoDataUri: imageDataUri,
        category: category,
      });

      const matches = filterDatabase(category, analysis.attributes);
      setPossibleMatches(matches);
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing the image. Please try again.",
        variant: "destructive"
      });
      handleReset(); // Reset on failure
    } finally {
      setIsLoading(false);
    }
  }, [toast, handleReset]);


  const handleMatchSelected = useCallback((species: Species) => {
    setResult(species);
    setIsResultOpen(true);
  }, []);

  const handleSearch = useCallback((query: string, category?: Category) => {
    const searchCategory = category || selectedCategory;
    if (!searchCategory) {
      toast({
        title: "Please select a category first",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    // This is a simplified search. In a real app, you'd likely use a more sophisticated search algorithm or an API endpoint.
    const matches = filterDatabase(searchCategory, {}).filter(s => 
        s.name.toLowerCase().includes(query.toLowerCase()) || 
        s.id.toString() === query
    );
    setPossibleMatches(matches);
    setView('matches');
    setCapturedImage('https://placehold.co/600x400.png'); // Use a placeholder for search results
    setIsLoading(false);
  }, [selectedCategory, toast]);


  const handleCapture = useCallback(async () => {
    if (!selectedCategory) return;
    const imageDataUri = cameraRef.current?.capture();
    if (imageDataUri) {
      findMatches(imageDataUri, selectedCategory);
    } else {
      toast({
        title: t('toast.captureFailed.title'),
        description: t('toast.captureFailed.description'),
        variant: "destructive",
      });
    }
  }, [selectedCategory, findMatches, toast, t]);

  const handleBrowseClick = () => {
      fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedCategory) return;
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUri = e.target?.result as string;
        if (imageDataUri) {
          findMatches(imageDataUri, selectedCategory);
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
  }
  
  const handleCameraButtonClick = () => {
    if (selectedCategory) {
        setIsCameraOpen(true);
    } else {
        setIsCategorySelectorOpen(true);
    }
  };

  const handleUploadButtonClick = () => {
    if (selectedCategory) {
        handleBrowseClick();
    } else {
        setIsCategorySelectorOpen(true);
    }
  }

  const handleScanButtonClick = () => {
    if (selectedCategory) {
       setIsScannerOpen(true);
   } else {
       setIsCategorySelectorOpen(true);
   }
  }

  const handleScanSuccess = (scanResult: string) => {
    setIsScannerOpen(false);
    toast({
        title: "Scan Successful",
        description: `Found code: ${scanResult}`
    });
    // Assume the scanned code is the item's ID for this mock implementation
    handleSearch(scanResult, selectedCategory || undefined);
  }


  if (loading) {
    return (
        <div className="flex flex-col min-h-screen">
            <SiteHeader />
            <main className="flex-1 flex items-center justify-center">
                <Loader className="h-12 w-12 animate-spin text-white" />
            </main>
        </div>
    )
  }

  if (!user) {
    return (
        <div className="flex flex-col min-h-screen">
            <SiteHeader />
            <main className="flex-1">
                <AuthGate />
            </main>
        </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen text-white">
      <SiteHeader />
      <main className="flex-1 relative flex flex-col items-center justify-center overflow-hidden p-4">
        
        <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center justify-center text-center">
            {view === 'capture' && !isCameraOpen && !isScannerOpen &&(
                 <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-2xl p-8 text-slate-800">
                    <h1 className="text-4xl font-headline font-bold text-primary mb-2">Select a Category</h1>
                    <p className="max-w-md mb-6 mx-auto text-lg">Choose whether you want to identify a plant, tree, weed, or insect to get started.</p>
                    <CategorySelector
                        selectedCategory={selectedCategory}
                        onSelectCategory={handleCategorySelect}
                    />
                     <div className="mt-6 w-full max-w-md mx-auto">
                      <p className="text-center text-muted-foreground mb-2">Or search by name</p>
                      <SearchInput onSearch={handleSearch} />
                    </div>
                </div>
            )}
        </div>

        {/* Overlays */}
        {isCameraOpen && (
           <div className="absolute inset-0 bg-black">
              <CameraFeed ref={cameraRef} />
           </div>
        )}
        
        {isScannerOpen && (
             <BarcodeScanner
                onScanSuccess={handleScanSuccess}
                onClose={() => setIsScannerOpen(false)}
            />
        )}

        {view === 'matches' && capturedImage && (
           <div className="absolute inset-0 bg-black">
              <Image
                src={capturedImage}
                alt="Captured for identification"
                fill
                className="object-contain"
              />
              <MatchSelector 
                matches={possibleMatches} 
                onSelect={handleMatchSelected} 
                onBack={() => {
                  handleReset(); 
                  if(selectedCategory) setIsSourceSelectorOpen(true);
                }} 
              />
            </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
            <Loader className="h-12 w-12 animate-spin text-white" />
            <p className="mt-4 text-white font-semibold">{t('identifying')}</p>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col items-center p-6 space-y-4">
          
          {(view === 'capture' && !isCameraOpen && !isScannerOpen) && (
            <div className="flex justify-center gap-4 w-full max-w-lg">
                <Button size="lg" className="flex-1 rounded-full text-lg py-6 shadow-lg bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleCameraButtonClick}>
                    <Camera className="mr-2"/>
                    Use Camera
                </Button>
                 <Button size="lg" className="flex-1 rounded-full text-lg py-6 shadow-lg" variant="secondary" onClick={handleScanButtonClick}>
                    <QrCode className="mr-2" />
                    Scan Code
                </Button>
                <Button size="lg" className="flex-1 rounded-full text-lg py-6 shadow-lg" variant="secondary" onClick={handleUploadButtonClick}>
                    <Upload className="mr-2" />
                    Upload
                </Button>
            </div>
          )}

          {isCameraOpen && (
             <Button
                size="lg"
                className="rounded-full h-20 w-20 p-0 border-4 border-white/50 bg-primary/90 hover:bg-primary text-primary-foreground shadow-2xl disabled:opacity-50 transition-transform active:scale-95"
                onClick={handleCapture}
                disabled={isLoading}
                aria-label={t('capturePhotoLabel')}
              >
                  <Camera className="h-8 w-8" />
              </Button>
          )}

          {(view !== 'capture' || isCameraOpen || isScannerOpen) && (
             <Button
                variant="outline"
                className="bg-black/50 border-white/50 text-white hover:bg-black/70 hover:text-white rounded-full"
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
                        onSelectCategory={(category) => {
                           setSelectedCategory(category);
                           setIsCategorySelectorOpen(false); // Close this dialog
                           setIsSourceSelectorOpen(true); // Open the next one
                        }}
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
                    <AlertDialogTitle>Now, provide an image or code</AlertDialogTitle>
                    <AlertDialogDescription>
                        You can use your camera, upload from your gallery, or scan a barcode.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 py-4'>
                    <Button size="lg" onClick={() => { setIsCameraOpen(true); setIsSourceSelectorOpen(false); }}>
                        <Camera className="mr-2"/>
                        Camera
                    </Button>
                    <Button size="lg" onClick={() => { setIsScannerOpen(true); setIsSourceSelectorOpen(false); }}>
                        <QrCode className="mr-2"/>
                        Scan Code
                    </Button>
                     <Button size="lg" onClick={() => { handleBrowseClick(); setIsSourceSelectorOpen(false); }}>
                        <Upload className="mr-2" />
                        Upload
                    </Button>
                </div>
                 <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
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
