
"use client";

import { useCallback, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
import type { Species } from '@/lib/mock-database';
import { useAuth } from './use-auth';
import { getDb, addItemToDb, removeItemFromDb, getAllItemsFromDb } from '@/lib/collection-db';

// The collection item will now store the specific image URI
export interface CollectionItem extends Species {
    savedImage: string;
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

    const addItem = useCallback(async (item: Species, imageDataUri: string) => {
        if (!userId) return;
        
        const collectionItem: CollectionItem = {
            ...item,
            savedImage: imageDataUri,
        };
        
        const db = await getDb(userId);
        await addItemToDb(db, collectionItem);
        
        // Optimistically update the local cache, then revalidate
        mutate(`${COLLECTION_KEY}_${userId}`, (currentData: CollectionItem[] = []) => [...currentData, collectionItem], false);
        mutate(`${COLLECTION_KEY}_${userId}`);

    }, [userId]);

    const removeItem = useCallback(async (itemToRemove: CollectionItem) => {
        if (!userId) return;

        const db = await getDb(userId);
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
