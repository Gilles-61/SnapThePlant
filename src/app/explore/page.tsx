
'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { SiteHeader } from '@/components/site-header';
import { useTranslation } from '@/hooks/use-language';
import { type Species } from '@/lib/mock-database';
import { categories, type Category } from '@/lib/categories';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { IdentificationResult } from '@/components/identification-result';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AuthGuard } from '@/components/auth-guard';
import { AlertTriangle, Camera, Droplets, Sun, Telescope, Trash2, Loader, Image as ImageIcon } from 'lucide-react';
import { SearchInput } from '@/components/search-input';
import Link from 'next/link';
import { getAllSpecies, deleteSpecies } from '@/lib/species-service';
import { useToast } from '@/hooks/use-toast';
import { getCachedImage, cacheImage } from '@/lib/image-cache-service';
import { generateImage } from '@/ai/flows/generate-image-flow';
import { Skeleton } from '@/components/ui/skeleton';


const getAvailableFilters = (speciesList: Species[], category: Category) => {
    const speciesInCategory = speciesList.filter(s => s.category === category);
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
    const [allSpecies, setAllSpecies] = useState<Species[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
    const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
    const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);
    const [isResultOpen, setIsResultOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [imageUrls, setImageUrls] = useState<Record<number, string>>({});
    const [generatingImageId, setGeneratingImageId] = useState<number | null>(null);


    useEffect(() => {
        const fetchSpeciesAndCheckCache = async () => {
            setIsLoading(true);
            const speciesFromDb = await getAllSpecies();
            setAllSpecies(speciesFromDb);
            
            // Just check the cache, don't generate images here
            for (const species of speciesFromDb) {
                const cachedUrl = await getCachedImage(species.id);
                if (cachedUrl) {
                    setImageUrls(prev => ({ ...prev, [species.id]: cachedUrl }));
                }
            }
            setIsLoading(false);
        };
        
        fetchSpeciesAndCheckCache();
    }, []);

    const handleGenerateImage = async (species: Species) => {
        setGeneratingImageId(species.id);
        try {
            const result = await generateImage({ name: species.name, category: species.category });
            const newUrl = result.imageDataUri;
            if (newUrl && !newUrl.includes('placehold.co')) {
                await cacheImage(species.id, newUrl);
                setImageUrls(prev => ({ ...prev, [species.id]: newUrl }));
            } else {
                 toast({
                    title: "Image Generation Failed",
                    description: "Could not generate a unique image. Please try again.",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error(`Failed to generate image for ${species.name}:`, error);
            toast({
                title: "Error",
                description: "An error occurred while generating the image.",
                variant: "destructive"
            });
        } finally {
            setGeneratingImageId(null);
        }
    };

    const availableFilters = useMemo(() => {
        if (selectedCategory === 'all') return {};
        return getAvailableFilters(allSpecies, selectedCategory);
    }, [selectedCategory, allSpecies]);

    const filteredData = useMemo(() => {
        let data = allSpecies;

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
        
        return data;

    }, [allSpecies, selectedCategory, activeFilters, searchQuery]);
    

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
        const speciesWithImage = { ...species, image: imageUrls[species.id] || species.image };
        setSelectedSpecies(speciesWithImage);
        setIsResultOpen(true);
    };

    const handleResultClose = () => {
        setIsResultOpen(false);
        setTimeout(() => setSelectedSpecies(null), 300);
    };
    
    const handleRemoveItem = async (speciesId: number) => {
        const result = await deleteSpecies(speciesId);
        if (result.success) {
            setAllSpecies(prevSpecies => prevSpecies.filter(s => s.id !== speciesId));
            toast({ title: "Success", description: "Item permanently removed from the database." });
        } else {
            toast({ title: "Error", description: "Failed to remove item. Please try again.", variant: 'destructive' });
        }
    };

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
                       {isLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <Card key={i} className="overflow-hidden flex flex-col">
                                        <Skeleton className="aspect-video w-full" />
                                        <CardContent className="p-4 flex-1 flex flex-col">
                                            <Skeleton className="h-5 w-3/4 mb-2" />
                                            <Skeleton className="h-4 w-1/2" />
                                            <Skeleton className="h-12 w-full mt-2" />
                                        </CardContent>
                                        <CardFooter className="p-2 pt-0">
                                            <Skeleton className="h-10 w-full" />
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <ScrollArea className="h-full">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredData.map(species => (
                                        <Card key={species.id} className="overflow-hidden flex flex-col group transition-shadow hover:shadow-lg relative">
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2 z-10 h-7 w-7"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveItem(species.id);
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">Delete</span>
                                            </Button>
                                            <CardHeader className="p-0">
                                                <div className="relative aspect-video bg-muted">
                                                    {imageUrls[species.id] ? (
                                                        <Image 
                                                            src={imageUrls[species.id]}
                                                            alt={species.name} 
                                                            fill
                                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                            className="object-cover transition-transform group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            {generatingImageId === species.id ? (
                                                                <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
                                                            ) : (
                                                                <Button 
                                                                    variant="secondary"
                                                                    onClick={() => handleGenerateImage(species)}
                                                                >
                                                                    <ImageIcon className="mr-2 h-4 w-4" />
                                                                    Generate Image
                                                                </Button>
                                                            )}
                                                        </div>
                                                    )}
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
                                {filteredData.length === 0 && !isLoading && (
                                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                                        <p className="text-lg font-semibold">No results found.</p>
                                        <p>Try adjusting your search or filters.</p>
                                    </div>
                                )}
                            </ScrollArea>
                       )}
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
