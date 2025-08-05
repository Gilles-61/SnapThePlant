
'use client';

import { useState, useMemo } from 'react';
import { SiteHeader } from '@/components/site-header';
import { useTranslation } from '@/hooks/use-language';
import { database, type Species } from '@/lib/mock-database';
import { categories, type Category } from '@/lib/categories';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { IdentificationResult } from '@/components/identification-result';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

const getAvailableFilters = (category: Category) => {
    const speciesInCategory = database.filter(s => s.category === category);
    if (speciesInCategory.length === 0) return {};
    
    const allKeys = speciesInCategory.flatMap(s => Object.keys(s.attributes));
    const uniqueKeys = [...new Set(allKeys)];
    
    const filters: Record<string, string[]> = {};
    uniqueKeys.forEach(key => {
        const allValues = speciesInCategory.map(s => s.attributes[key]).filter(Boolean) as string[];
        filters[key] = [...new Set(allValues)];
    });
    return filters;
};

export default function ExplorePage() {
    const { t } = useTranslation();
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
    const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);
    const [isResultOpen, setIsResultOpen] = useState(false);

    const availableFilters = useMemo(() => {
        if (!selectedCategory) return {};
        return getAvailableFilters(selectedCategory);
    }, [selectedCategory]);

    const filteredData = useMemo(() => {
        return database.filter(species => {
            if (selectedCategory && species.category !== selectedCategory) {
                return false;
            }
            for (const key in activeFilters) {
                if (activeFilters[key] && activeFilters[key] !== 'all' && species.attributes[key] !== activeFilters[key]) {
                    return false;
                }
            }
            return true;
        });
    }, [selectedCategory, activeFilters]);

    const handleCategoryChange = (categoryName: string) => {
        const category = categories.find(c => c.name === categoryName) || null;
        setSelectedCategory(category?.name ?? null);
        setActiveFilters({});
    };
    
    const handleFilterChange = (filterKey: string, value: string) => {
        setActiveFilters(prev => ({
            ...prev,
            [filterKey]: value
        }));
    };

    const handleSpeciesSelect = (species: Species) => {
        setSelectedSpecies(species);
        setIsResultOpen(true);
    };

    const handleResultClose = () => {
        setIsResultOpen(false);
        setTimeout(() => setSelectedSpecies(null), 300);
    };
    
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <SiteHeader />
            <main className="flex-1 flex flex-col md:flex-row">
                <aside className="w-full md:w-72 border-b md:border-r md:border-b-0 p-4">
                    <ScrollArea className="h-full pr-4">
                        <h2 className="text-xl font-bold mb-4">Filters</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold mb-2">Category</h3>
                                <Select onValueChange={handleCategoryChange} value={selectedCategory ?? ''}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(cat => (
                                            <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            {selectedCategory && Object.keys(availableFilters).map(filterKey => (
                                <div key={filterKey}>
                                    <h3 className="font-semibold mb-2 capitalize">{filterKey.replace(/_/g, ' ')}</h3>
                                    <Select onValueChange={(value) => handleFilterChange(filterKey, value)} value={activeFilters[filterKey] ?? 'all'}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={`All ${filterKey.replace(/_/g, ' ')}s`} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            {availableFilters[filterKey].map(option => (
                                                 <SelectItem key={option} value={option}>{option}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </aside>

                <div className="flex-1 p-6">
                    <ScrollArea className="h-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredData.map(species => (
                                <Card key={species.id} className="overflow-hidden flex flex-col">
                                    <CardHeader className="p-0">
                                        <div className="relative aspect-video">
                                            <Image 
                                                src={species.image} 
                                                alt={species.name} 
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                className="object-cover"
                                                data-ai-hint={species['data-ai-hint'] || 'succulent plant'}
                                            />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4 flex-1 flex flex-col">
                                        <h3 className="font-bold">{species.name}</h3>
                                        <p className="text-sm text-muted-foreground italic">{species.scientificName}</p>

                                        <p className="text-sm text-muted-foreground mt-2 line-clamp-3 flex-1">{species.keyInformation}</p>
                                    </CardContent>
                                    <CardFooter className="pt-2">
                                        <Button className="w-full" onClick={() => handleSpeciesSelect(species)}>View Details</Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                        {filteredData.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                                <p className="text-lg">No results match your filters.</p>
                                <p>Try selecting a category or adjusting your filters.</p>
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </main>

            <IdentificationResult
                open={isResultOpen}
                onOpenChange={(open) => {
                    if (!open) handleResultClose();
                }}
                result={selectedSpecies}
                capturedImage={null}
                onConfirm={handleResultClose}
                onReject={handleResultClose}
            />
        </div>
    );
}
