
"use client";

import { useCallback, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import type { Species } from '@/lib/mock-database';
import { useAuth } from './use-auth';
import { getDb, addItemToDb, removeItemFromDb, getAllItemsFromDb } from '@/lib/collection-db';

// The collection item will now store the specific image URI and user notes
export interface CollectionItem extends Species {
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

    const { data: collection, error } = useSWR<CollectionItem[]>(
        userId ? `${COLLECTION_KEY}_${userId}` : null,
        () => collectionFetcher(userId),
        {
            revalidateOnFocus: false,
        }
    );

    const addItem = useCallback(async (item: Species, imageDataUri: string, notes?: string) => {
        if (!userId) return;
        
        // Use a combination of original ID and image URI for a more unique key in the collection
        // Note: IndexedDB primary key is still the `id` from the Species. 
        // We are ensuring the object we save is unique based on what the user captured.
        const collectionItem: CollectionItem = {
            ...item,
            savedImage: imageDataUri,
            notes: notes || '',
        };
        
        const db = await getDb(userId);
        await addItemToDb(db, collectionItem);
        
        // Optimistically update the local cache, then revalidate
        mutate(`${COLLECTION_KEY}_${userId}`, (currentData: CollectionItem[] = []) => {
            // Avoid duplicates by checking if an item with the same ID and image already exists
            const existingIndex = currentData.findIndex(ci => ci.id === collectionItem.id && ci.savedImage === collectionItem.savedImage);
            if (existingIndex > -1) {
                const updatedData = [...currentData];
                updatedData[existingIndex] = collectionItem;
                return updatedData;
            }
            return [...currentData, collectionItem];
        }, false);
        mutate(`${COLLECTION_KEY}_${userId}`);

    }, [userId]);

    const removeItem = useCallback(async (itemToRemove: CollectionItem) => {
        if (!userId) return;

        const db = await getDb(userId);
        // Use the species ID as the key for deletion
        await removeItemFromDb(db, itemToRemove.id);

        // Optimistically update the local cache, then revalidate
        mutate(`${COLLECTION_KEY}_${userId}`, (currentData: CollectionItem[] = []) => 
            currentData.filter(item => item.id !== itemToRemove.id), false
        );
        mutate(`${COLLECTION_KEY}_${userId}`);
    }, [userId]);
    
    return {
        collection: collection,
        isLoading: !error && !collection && !!userId,
        isError: error,
        addItem,
        removeItem,
    };
}
