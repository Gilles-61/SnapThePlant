
"use client";

import Image from 'next/image';
import { useTranslation } from '@/hooks/use-language';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import type { ScoredSpecies, Species } from '@/lib/mock-database';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

interface MatchSelectorProps {
    image: string;
    matches: ScoredSpecies[];
    onSelect: (species: Species) => void;
    onBack: () => void;
}

export function MatchSelector({ image, matches, onSelect, onBack }: MatchSelectorProps) {
    const { t } = useTranslation();

    return (
        <div className="w-full h-full text-white flex items-center justify-center p-4">
            <div className="w-full max-w-6xl h-[95%] grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left side: User's image */}
                <div className="flex flex-col gap-4">
                     <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Your Image</h2>
                        <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/20">
                           <ArrowLeft />
                           <span className="sr-only">{t('quiz.back')}</span>
                        </Button>
                    </div>
                    <div className="relative flex-1 rounded-lg overflow-hidden border border-white/20 shadow-lg">
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
                                ? t('quiz.matchesFoundTitle', { count: matches.length })
                                : t('quiz.noMatchesTitle')}
                        </CardTitle>
                        <CardDescription>
                            {matches.length > 0
                                ? t('quiz.matchesFoundDescription')
                                : t('quiz.noMatchesDescription')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden">
                        {matches.length > 0 ? (
                            <ScrollArea className="h-full">
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
                                    {matches.map(({ species, confidence }, index) => (
                                        <Card 
                                            key={species.id} 
                                            className={cn(
                                                "overflow-hidden flex flex-col justify-between group transition-all",
                                                index === 0 && "border-primary ring-2 ring-primary"
                                            )}
                                        >
                                            <CardHeader className="p-0 relative">
                                                <div className="relative aspect-[4/3]">
                                                    <Image 
                                                        src={species.image} 
                                                        alt={species.name} 
                                                        fill
                                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                                        className="object-cover transition-transform group-hover:scale-105"
                                                        data-ai-hint={species.name}
                                                    />
                                                </div>
                                                {index === 0 ? (
                                                     <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                                                        Top Match
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="absolute top-2 right-2">
                                                        {confidence}% Match
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
                                                    {t('quiz.selectMatch')}
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            </ScrollArea>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <p className="text-lg text-muted-foreground">{t('quiz.noMatchesDescription')}</p>
                                <Button onClick={onBack} className="mt-4">
                                    {t('startOver')}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
