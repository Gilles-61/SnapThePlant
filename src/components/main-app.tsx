
"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Loader, Camera, RotateCcw, Image as ImageIcon, Upload, QrCode, ArrowLeft, AlertCircle } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { SiteHeader } from '@/components/site-header';
import { CategorySelector } from '@/components/category-selector';
import { IdentificationResult } from '@/components/identification-result';
import CameraFeed, { type CameraFeedHandle } from '@/components/camera-feed';
import { useTranslation } from '@/hooks/use-language';
import { MatchSelector } from '@/components/match-selector';
import { findSpeciesByName, type Species, database, type ScoredSpecies, searchDatabase } from '@/lib/mock-database';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { SearchInput } from './search-input';
import { identifySpecies, type IdentifySpeciesOutput } from '@/ai/flows/identify-species-flow';
import type { Category } from '@/lib/categories';
import { BarcodeScanner } from './barcode-scanner';
import { Card, CardContent, CardDescription } from './ui/card';
import { generateImage } from '@/ai/flows/generate-image-flow';
import { useApiRateLimiter } from '@/hooks/use-api-rate-limiter';


export function MainApp({ initialCategory }: { initialCategory?: Category }) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { canCallApi, recordApiCall } = useApiRateLimiter();
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
  const [possibleMatches, setPossibleMatches] = useState<ScoredSpecies[]>([]);
  const [action, setAction] = useState<'camera' | 'upload' | null>(null);
  
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
    setAction(null);
    // Also clear category from URL
    window.history.pushState({}, '', window.location.pathname);
  }, []);

  const proceedWithAnalysis = async (analysis: IdentifySpeciesOutput, imageUri: string) => {
    if (!analysis || !analysis.name) {
        toast({
          title: "Analysis Failed",
          description: "The AI model failed to return a valid identification.",
          variant: "destructive"
        });
        handleReset();
        return;
    }
  
    setCapturedImage(imageUri);
    let match = findSpeciesByName(analysis.name);
  
    if (match && !analysis.isNew) {
      // It's a known species, show its data, but override poison check with AI's result
      const resultData: Species = {
        ...match,
        isPoisonous: analysis.isPoisonous,
        toxicityWarning: analysis.toxicityWarning,
      };
      setResult(resultData);
      setIsResultOpen(true);
    } else {
      // It's a new species, use the AI's generated data
      if (analysis.isNew) {
        toast({
          title: "New Species Identified!",
          description: `We've identified "${analysis.name}".`,
        });
      }
      const newSpecies: Species = {
        id: -1, // Temporary ID
        name: analysis.name,
        scientificName: analysis.scientificName,
        isPoisonous: analysis.isPoisonous,
        toxicityWarning: analysis.toxicityWarning,
        category: selectedCategory!,
        image: imageUri, // CRITICAL: Use the user's uploaded image
        keyInformation: analysis.keyInformation,
        furtherReading: `https://www.google.com/search?q=${encodeURIComponent(analysis.scientificName)}`,
        attributes: {},
        careTips: analysis.careTips,
      };
      setResult(newSpecies);
      setIsResultOpen(true);
    }
  }

  const findMatches = useCallback(async (imageDataUri: string, category: Category) => {
    if (!canCallApi()) {
      toast({
        title: "Daily Limit Reached",
        description: "You have used all your free identifications for today. Please try again tomorrow.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setCapturedImage(imageDataUri);
    
    try {
      recordApiCall(); // Record the call
      const analysis = await identifySpecies({
          photoDataUri: imageDataUri,
          category: category,
      });
      
      await proceedWithAnalysis(analysis, imageDataUri);

    } catch (error) {
      console.error("Error analyzing image:", error);
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing the image. Please try again.",
        variant: "destructive"
      });
    } finally {
        setIsLoading(false);
    }
  }, [toast, handleReset, selectedCategory, canCallApi, recordApiCall, proceedWithAnalysis]);


  const handleSearch = useCallback((query: string) => {
    setIsLoading(true);

    const matches = searchDatabase(query, selectedCategory);
    
    if (matches.length > 0) {
        setResult(matches[0]);
        setCapturedImage(matches[0].image); // Use placeholder from DB for search
        setIsResultOpen(true);
    } else {
      toast({
        title: "No Results",
        description: `No items found for "${query}".`,
        variant: "default",
      });
    }
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
    if(event.target) {
        event.target.value = "";
    }
  };

  const handleFeedback = useCallback((wasCorrect: boolean) => {
    toast({
        title: "Feedback Received",
        description: "Thank you for helping us improve our accuracy!",
    });
    handleReset();
  }, [toast, handleReset]);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    if (action === 'camera') {
        setIsCameraOpen(true);
    } else if (action === 'upload') {
        handleBrowseClick();
    }
  }
  
  const handleCameraButtonClick = () => {
    if (selectedCategory) {
        setIsCameraOpen(true);
    } else {
        setAction('camera');
        toast({ title: "Please select a category first."});
    }
  };

  const handleUploadButtonClick = () => {
    if (selectedCategory) {
        handleBrowseClick();
    } else {
        setAction('upload');
        toast({ title: "Please select a category first."});
    }
  }

  const handleScanButtonClick = () => {
   setIsScannerOpen(true);
  }

  const handleScanSuccess = (scanResult: string) => {
    setIsScannerOpen(false);
    toast({
        title: "Scan Successful",
        description: `Searching for code: ${scanResult}`
    });
    handleSearch(scanResult);
  }

  useEffect(() => {
    if (action && selectedCategory) {
        if (action === 'camera') setIsCameraOpen(true);
        if (action === 'upload') handleBrowseClick();
    }
  }, [selectedCategory, action]);
  

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1 relative flex flex-col items-center justify-center overflow-auto p-4">
        
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center text-center flex-grow">
            {view === 'capture' && !isCameraOpen && !selectedCategory && (
                 <div className="bg-background/90 backdrop-blur-md rounded-xl shadow-2xl p-6 sm:p-8">
                    <h1 className="text-3xl sm:text-4xl font-headline font-bold text-primary mb-2">Select a Category</h1>
                    <p className="max-w-md mb-6 mx-auto text-base sm:text-lg">Choose a category to begin your identification.</p>
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

            {view === 'capture' && !isCameraOpen && selectedCategory && (
              <div className="w-full max-w-md flex flex-col items-center gap-4">
                <Button variant="ghost" onClick={handleReset} className="self-start text-foreground hover:text-foreground hover:bg-white/20">
                  <ArrowLeft className="mr-2 h-4 w-4"/>
                  Back to categories
                </Button>
                <Card className="w-full bg-background/90 backdrop-blur-md">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Identify a {selectedCategory}</h2>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <Button size="lg" className="flex-1 rounded-full text-lg py-6 shadow-lg bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleCameraButtonClick}>
                                <Camera className="mr-2"/>
                                Use Camera
                            </Button>
                            <CardDescription className="text-xs px-4">Capture a live photo for identification.</CardDescription>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Button size="lg" className="flex-1 rounded-full text-lg py-6 shadow-lg" variant="secondary" onClick={handleUploadButtonClick}>
                                <Upload className="mr-2" />
                                Upload
                            </Button>
                             <CardDescription className="text-xs px-4">Choose an image from your device.</CardDescription>
                        </div>
                    </div>
                     <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">
                                Or
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                       <Button size="lg" className="w-full rounded-full text-lg py-6 shadow-lg" variant="secondary" onClick={handleScanButtonClick}>
                            <QrCode className="mr-2" />
                            Scan Barcode/QR
                        </Button>
                        <SearchInput onSearch={handleSearch} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
        </div>

        {/* Action Buttons for camera view */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full flex-shrink-0 py-4 z-20">
            {isCameraOpen && (
                 <div className="flex flex-col items-center gap-4">
                    <Button
                        size="lg"
                        className="rounded-full h-20 w-20 p-0 border-4 border-white/50 bg-primary/90 hover:bg-primary text-primary-foreground shadow-2xl disabled:opacity-50 transition-transform active:scale-95"
                        onClick={handleCapture}
                        disabled={isLoading}
                        aria-label={t('capturePhotoLabel')}
                    >
                        <Camera className="h-8 w-8" />
                    </Button>
                     <Button
                        variant="outline"
                        className="bg-black/50 border-white/50 text-white hover:bg-black/70 hover:text-white rounded-full"
                        onClick={handleReset}
                     >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        {t('startOver')}
                     </Button>
                 </div>
            )}
        </div>


        {/* Overlays */}
        {isCameraOpen && (
           <div className="absolute inset-0 bg-black z-10">
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
           <div className="absolute inset-0 bg-black/90 z-10">
              <MatchSelector
                image={capturedImage}
                matches={possibleMatches} 
                onSelect={(species) => {
                    setResult(species);
                    setIsResultOpen(true);
                }} 
                onBack={handleReset} 
              />
            </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
            <Loader className="h-12 w-12 animate-spin text-white" />
            <p className="mt-4 text-white font-semibold">{t('identifying')}</p>
          </div>
        )}
        
        <IdentificationResult
          open={isResultOpen}
          onOpenChange={(open) => {
            if (!open) handleReset();
            else setIsResultOpen(true);
          }}
          result={result}
          capturedImage={capturedImage}
          onConfirm={() => handleFeedback(true)}
          onReject={() => handleFeedback(false)}
        />

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
