
"use client";

import { useEffect, useState, memo } from 'react';
import Image from 'next/image';
import { useTranslation } from '@/hooks/use-language';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, CheckCircle, Image as ImageIcon, Loader } from 'lucide-react';
import type { ScoredSpecies, Species } from '@/lib/mock-database';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { generateImage } from '@/ai/flows/generate-image-flow';
import { Skeleton } from './ui/skeleton';

interface MatchSelectorProps {
    image: string;
    matches: ScoredSpecies[];
    onSelect: (species: Species) => void;
    onBack: () => void;
}

interface GeneratedImage {
    id: number;
    imageDataUri: string;
}

const MatchCard = memo(({ species, confidence, index, onSelect, generatedImage }: { species: Species, confidence: number, index: number, onSelect: (species: Species) => void, generatedImage: GeneratedImage | undefined }) => {
    const showImage = index === 0;

    return (
        <Card 
            className={cn(
                "overflow-hidden flex flex-col justify-between group transition-all",
                showImage && "border-primary ring-2 ring-primary"
            )}
        >
            <CardHeader className="p-0 relative">
                <div className="relative aspect-[4/3] bg-muted flex items-center justify-center">
                    {showImage ? (
                        generatedImage ? (
                            <Image 
                                src={generatedImage.imageDataUri}
                                alt={species.name} 
                                fill
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                className="object-cover transition-transform group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                               <Loader className="w-8 h-8 animate-spin"/>
                               <p className="text-xs mt-2">Generating image...</p>
                            </div>
                        )
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-2">
                             <h4 className="text-2xl font-bold text-foreground">{confidence}%</h4>
                             <p className="text-sm">Match</p>
                        </div>
                    )}
                </div>
                {showImage && (
                    <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                        Top Match
                    </Badge>
                )}
            </CardHeader>
            <CardContent className="p-3 flex-1">
                <h3 className="font-bold truncate">{species.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{species.keyInformation}</p>
            </CardContent>
            <CardFooter className="p-2 pt-0">
                <Button className="w-full" onClick={() => onSelect(species)}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Select this match
                </Button>
            </CardFooter>
        </Card>
    )
});
MatchCard.displayName = 'MatchCard';

export function MatchSelector({ image, matches, onSelect, onBack }: MatchSelectorProps) {
    const { t } = useTranslation();
    const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const generateTopImage = async () => {
            if (matches.length === 0) {
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            try {
                const { species } = matches[0];
                const result = await generateImage({ name: species.name, category: species.category });
                setGeneratedImages([{ id: species.id, imageDataUri: result.imageDataUri }]);
            } catch (error) {
                console.error(`Failed to generate image for ${matches[0].species.name}:`, error);
                setGeneratedImages([{ id: matches[0].species.id, imageDataUri: 'https://placehold.co/600x400.png' }]); // Fallback
            } finally {
                setIsLoading(false);
            }
        };

        generateTopImage();
    }, [matches]);

    return (
        <div className="w-full h-full text-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-6xl h-full flex flex-col md:grid md:grid-cols-2 gap-8">
                {/* Left side: User's image */}
                <div className="flex flex-col gap-4 flex-shrink-0 md:flex-grow">
                     <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Your Image</h2>
                        <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/20">
                           <ArrowLeft />
                           <span className="sr-only">Back</span>
                        </Button>
                    </div>
                    <div className="relative flex-1 rounded-lg overflow-hidden border border-white/20 shadow-lg min-h-48">
                        <Image 
                            src={image}
                            alt="User upload for identification"
                            fill
                            sizes="50vw"
                            className="object-contain"
                        />
                    </div>
                </div>

                {/* Right side: Matches */}
                <Card className="w-full h-full flex flex-col bg-card/90 backdrop-blur-sm text-card-foreground">
                    <CardHeader>
                         <CardTitle>
                            {matches.length > 0
                                ? `We found ${matches.length} possible matches`
                                : `No Matches Found`}
                        </CardTitle>
                        <CardDescription>
                            {matches.length > 0
                                ? `Select the one that looks most like your image, or start over.`
                                : `We couldn't find any matches. Try taking another picture.`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden">
                        {matches.length > 0 ? (
                            <ScrollArea className="h-full">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
                                    {matches.map(({ species, confidence }, index) => (
                                        <MatchCard 
                                            key={species.id}
                                            species={species}
                                            confidence={confidence}
                                            index={index}
                                            onSelect={onSelect}
                                            generatedImage={generatedImages.find(img => img.id === species.id)}
                                        />
                                    ))}
                                </div>
                            </ScrollArea>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <p className="text-lg text-muted-foreground">Try taking another picture.</p>
                                <Button onClick={onBack} className="mt-4">
                                    Start Over
                                </Button>
                            </div>
                        )}
                    </CardContent>
                     {matches.length > 0 && (
                        <CardFooter className="pt-4">
                            <Button variant="outline" className="w-full" onClick={onBack}>
                                Not these? Start Over
                            </Button>
                        </CardFooter>
                     )}
                </Card>
            </div>
        </div>
    );
}
