
'use client';

import { useState, useMemo, useCallback } from 'react';
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
import { AuthGuard } from '@/components/auth-guard';
import { AlertTriangle, Camera, Droplets, Sun, Telescope, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SearchInput } from '@/components/search-input';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

const getAvailableFilters = (category: Category) => {
    const speciesInCategory = database.filter(s => s.category === category);
    if (speciesInCategory.length === 0) return {};
    
    const allKeys = speciesInCategory.flatMap(s => Object.keys(s.attributes));
    const uniqueKeys = [...new Set(allKeys)];
    
    const filters: Record<string, string[]> = {};
    uniqueKeys.forEach(key => {
        if (key === 'light_requirement' || key === 'watering_frequency') return;
        const allValues = speciesInCategory.map(s => s.attributes[key]).filter(Boolean) as string[];
        filters[key] = [...new Set(allValues)];
    });
    return filters;
};

export default function ExplorePage() {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
    const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
    const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);
    const [isResultOpen, setIsResultOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [hiddenItems, setHiddenItems] = useState<number[]>([]);

    const availableFilters = useMemo(() => {
        if (selectedCategory === 'all') return {};
        return getAvailableFilters(selectedCategory);
    }, [selectedCategory]);

    const filteredData = useMemo(() => {
        let data = database;

        if (selectedCategory !== 'all') {
            data = data.filter(species => species.category === selectedCategory);
        }

        if (searchQuery) {
            data = data.filter(species => 
                species.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                species.scientificName.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        for (const key in activeFilters) {
            if (activeFilters[key] && activeFilters[key] !== 'all') {
                data = data.filter(species => species.attributes[key] === activeFilters[key]);
            }
        }

        // Filter out hidden items at the very end
        return data.filter(species => !hiddenItems.includes(species.id));

    }, [selectedCategory, activeFilters, searchQuery, hiddenItems]);

    const handleCategoryChange = (categoryName: Category | 'all') => {
        setSelectedCategory(categoryName);
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
    
    const handleHideItem = useCallback((speciesId: number) => {
        setHiddenItems(prev => [...prev, speciesId]);
        toast({
            title: "Item Hidden",
            description: "The item has been hidden from your view.",
        });
    }, [toast]);

    return (
        <AuthGuard requirePaid={true}>
            <div className="flex flex-col min-h-screen bg-background text-foreground">
                <SiteHeader />
                <main className="flex-1 flex flex-col md:flex-row">
                    <aside className="w-full md:w-80 border-b md:border-r md:border-b-0 p-4">
                        <ScrollArea className="h-full pr-4">
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Telescope /> Explore</h2>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold mb-2">Search by Name</h3>
                                    <SearchInput onSearch={setSearchQuery} />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Category</h3>
                                    <div className="grid grid-cols-3 gap-2">
                                        <Button
                                            variant={selectedCategory === 'all' ? 'default' : 'outline'}
                                            onClick={() => handleCategoryChange('all')}
                                            className="w-full"
                                        >
                                            All
                                        </Button>
                                        {categories.map(cat => (
                                            <Button 
                                                key={cat.name} 
                                                variant={selectedCategory === cat.name ? 'default' : 'outline'}
                                                onClick={() => handleCategoryChange(cat.name)}
                                                className="w-full"
                                            >
                                                {cat.name}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                                
                                {selectedCategory !== 'all' && Object.keys(availableFilters).map(filterKey => (
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

                                <Button asChild size="lg" className="w-full mt-6">
                                    <Link href="/">
                                        <Camera className="mr-2 h-5 w-5" />
                                        Identify a New Species
                                    </Link>
                                </Button>
                            </div>
                        </ScrollArea>
                    </aside>

                    <div className="flex-1 p-6">
                        <ScrollArea className="h-full">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredData.map(species => (
                                    <Card key={species.id} className="overflow-hidden flex flex-col group transition-shadow hover:shadow-lg relative">
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 z-10 h-7 w-7 opacity-80 hover:opacity-100"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleHideItem(species.id);
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Delete</span>
                                        </Button>
                                        <CardHeader className="p-0">
                                            <div className="relative aspect-video">
                                                <Image 
                                                    src={species.image} 
                                                    alt={species.name} 
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    className="object-cover transition-transform group-hover:scale-105"
                                                    data-ai-hint={species['data-ai-hint'] || 'plant'}
                                                />
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-4 flex-1 flex flex-col">
                                            <div className="flex justify-between items-start gap-2">
                                                <h3 className="font-bold text-lg">{species.name}</h3>
                                                <div className="flex items-center gap-2 text-muted-foreground shrink-0">
                                                   {species.attributes.light_requirement === 'full sun' && <Sun className="h-4 w-4 text-amber-500" title="Full Sun" />}
                                                    {species.attributes.light_requirement === 'partial shade' && <Sun className="h-4 w-4 text-gray-400" title="Partial Shade" />}
                                                    {species.attributes.watering_frequency === 'high' && <Droplets className="h-4 w-4 text-blue-500" title="High Watering" />}
                                                    {species.attributes.watering_frequency === 'low' && <Droplets className="h-4 w-4 text-gray-400" title="Low Watering" />}
                                                    {species.isPoisonous && <AlertTriangle className="h-4 w-4 text-destructive" title="Poisonous/Toxic" />}
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground italic -mt-1">{species.scientificName}</p>

                                            <p className="text-sm text-muted-foreground mt-2 line-clamp-3 flex-1">{species.keyInformation}</p>
                                        </CardContent>
                                        <CardFooter className="p-2 pt-0">
                                            <Button className="w-full" variant="secondary" onClick={() => handleSpeciesSelect(species)}>View Details</Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                            {filteredData.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                                    <p className="text-lg font-semibold">No results found.</p>
                                    <p>Try adjusting your search or filters.</p>
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
        </AuthGuard>
    );
}

    