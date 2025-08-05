
"use client";

import { useCallback } from 'react';
import useSWR, { mutate } from 'swr';
import type { Species } from '@/lib/mock-database';

// The collection item will now store the specific image URI
export interface CollectionItem extends Species {
    savedImage: string;
}

const COLLECTION_KEY = 'snaptheplant_collection';

// The fetcher function for SWR. It retrieves data from localStorage.
const getCollectionFromStorage = (): CollectionItem[] => {
    if (typeof window === 'undefined') {
        return [];
    }
    try {
        const item = window.localStorage.getItem(COLLECTION_KEY);
        return item ? JSON.parse(item) : [];
    } catch (error) {
        console.error("Error reading from localStorage", error);
        return [];
    }
};

// The updater function for SWR. It writes data to localStorage.
const setCollectionInStorage = (collection: CollectionItem[]): CollectionItem[] => {
    if (typeof window === 'undefined') {
        return [];
    }
    try {
        window.localStorage.setItem(COLLECTION_KEY, JSON.stringify(collection));
    } catch (error) {
        console.error("Error writing to localStorage", error);
    }
    return collection;
};

export function useCollection() {
    const { data: collection, error } = useSWR<CollectionItem[]>(COLLECTION_KEY, getCollectionFromStorage, {
        revalidateOnFocus: false, // Optional: prevents re-fetching on window focus
    });

    const addItem = useCallback((item: Species, imageDataUri: string) => {
        const currentCollection = getCollectionFromStorage();
        // Use a composite key of id and original image to allow saving duplicates if they have different images
        const uniqueKey = `${item.id}-${item.image}`; 
        if (!currentCollection.some(c => c.id === item.id && c.savedImage === imageDataUri)) {
            const collectionItem: CollectionItem = {
                ...item,
                savedImage: imageDataUri,
            };
            const updatedCollection = [...currentCollection, collectionItem];
            // Update localStorage and then revalidate SWR cache
            setCollectionInStorage(updatedCollection);
            mutate(COLLECTION_KEY, updatedCollection, false); // Update local cache without re-fetching
        }
    }, []);

    const removeItem = useCallback((itemToRemove: CollectionItem) => {
        const currentCollection = getCollectionFromStorage();
        const updatedCollection = currentCollection.filter(item => 
            !(item.id === itemToRemove.id && item.savedImage === itemToRemove.savedImage)
        );
        // Update localStorage and then revalidate SWR cache
        setCollectionInStorage(updatedCollection);
        mutate(COLLECTION_KEY, updatedCollection, false); // Update local cache without re-fetching
    }, []);
    
    return {
        collection: collection,
        isLoading: !error && !collection,
        isError: error,
        addItem,
        removeItem,
    };
}
