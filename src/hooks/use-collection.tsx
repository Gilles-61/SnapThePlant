
"use client";

import { useCallback } from 'react';
import useSWR, { mutate } from 'swr';
import type { Species } from '@/lib/mock-database';
import { useAuth } from './use-auth';
import { getDb, addItemToDb, removeItemFromDb, getAllItemsFromDb } from '@/lib/collection-db';

// The collection item will now store the specific image URI and user notes
export interface CollectionItem extends Omit<Species, 'id'> {
    // A unique ID for the saved instance, generated on save.
    // Can be a timestamp or a more robust unique identifier.
    instanceId: number; 
    // The original ID from the mock database, used for reference.
    speciesId: number;
    savedImage: string;
    notes?: string;
}


const COLLECTION_KEY = 'snaptheplant_collection';

// The fetcher function for SWR. It retrieves data from IndexedDB.
const collectionFetcher = async (userId: string | null): Promise<CollectionItem[]> => {
    if (typeof window === 'undefined' || !userId) {
        return [];
    }
    const db = await getDb(userId);
    return getAllItemsFromDb(db);
};

export function useCollection() {
    const { user } = useAuth();
    const userId = user?.uid ?? null;

    const { data: collection, error, isLoading } = useSWR<CollectionItem[]>(
        userId ? `${COLLECTION_KEY}_${userId}` : null,
        () => collectionFetcher(userId),
        {
            revalidateOnFocus: false, // Prevents re-fetching on window focus
        }
    );

    const addItem = useCallback(async (item: Species | Omit<CollectionItem, 'instanceId'>, imageDataUri: string, notes?: string) => {
        if (!userId) return;
        
        // Check if the item is already a collection item (e.g., during an update)
        const isUpdate = 'instanceId' in item && typeof item.instanceId === 'number';

        const speciesData: Omit<CollectionItem, 'instanceId' | 'savedImage' | 'notes'> = {
            speciesId: 'speciesId' in item ? item.speciesId : item.id,
            name: item.name,
            scientificName: item.scientificName,
            category: item.category,
            keyInformation: item.keyInformation,
            furtherReading: item.furtherReading,
            image: item.image,
            attributes: item.attributes,
            careTips: item.careTips,
            isPoisonous: item.isPoisonous,
            toxicityWarning: item.toxicityWarning,
            'data-ai-hint': item['data-ai-hint'],
        };
        
        const collectionItem: CollectionItem = {
            ...speciesData,
            instanceId: isUpdate ? item.instanceId : Date.now(),
            savedImage: imageDataUri,
            notes: notes || ('notes' in item ? item.notes : '') || '',
        };
        
        const db = await getDb(userId);
        await addItemToDb(db, collectionItem);
        
        // Use mutate to update the local cache without re-fetching from the server
        mutate(`${COLLECTION_KEY}_${userId}`, (currentData: CollectionItem[] = []) => {
            const existingIndex = currentData.findIndex(ci => ci.instanceId === collectionItem.instanceId);
            if (existingIndex > -1) {
                // Update existing item
                const updatedData = [...currentData];
                updatedData[existingIndex] = collectionItem;
                return updatedData;
            }
            // Add new item
            return [...currentData, collectionItem];
        }, false); // `false` prevents revalidation, we trust our optimistic update

    }, [userId]);

    const removeItem = useCallback(async (itemToRemove: CollectionItem) => {
        if (!userId) return;

        const db = await getDb(userId);
        await removeItemFromDb(db, itemToRemove.instanceId);

        // Optimistically update local cache
        mutate(`${COLLECTION_KEY}_${userId}`, (currentData: CollectionItem[] = []) => 
            currentData.filter(item => item.instanceId !== itemToRemove.instanceId), false
        );
    }, [userId]);
    
    return {
        collection: collection,
        isLoading: isLoading && !!userId,
        isError: error,
        addItem,
        removeItem,
    };
}
