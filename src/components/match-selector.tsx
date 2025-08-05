
"use client";

import Image from 'next/image';
import { useTranslation } from '@/hooks/use-language';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft } from 'lucide-react';
import type { Species } from '@/lib/mock-database';

interface MatchSelectorProps {
    matches: Species[];
    onSelect: (species: Species) => void;
    onBack: () => void;
}

export function MatchSelector({ matches, onSelect, onBack }: MatchSelectorProps) {
    const { t } = useTranslation();

    return (
        <div className="w-full h-full bg-background/90 backdrop-blur-sm z-10 flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl h-full flex flex-col">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div>
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
                        </div>
                        <Button variant="ghost" size="icon" onClick={onBack}>
                           <ArrowLeft />
                           <span className="sr-only">{t('quiz.back')}</span>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pr-4">
                            {matches.map((species) => (
                                <Card key={species.id} className="overflow-hidden">
                                    <CardHeader className="p-0">
                                       <div className="relative aspect-video">
                                            <Image
                                                src={species.image}
                                                alt={species.name}
                                                fill
                                                className="object-cover"
                                                data-ai-hint="nature"
                                            />
                                       </div>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <h3 className="font-bold">{species.name}</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{species.keyInformation}</p>
                                    </CardContent>
                                    <CardFooter className="p-2 pt-0">
                                        <Button className="w-full" onClick={() => onSelect(species)}>
                                            {t('quiz.selectMatch')}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}
