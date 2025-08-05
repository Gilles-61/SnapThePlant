
"use client";

import { useCallback } from 'react';
import useSWR, { mutate } from 'swr';
import type { Species } from '@/lib/mock-database';

const COLLECTION_KEY = 'snaptheplant_collection';

// The fetcher function for SWR. It retrieves data from localStorage.
const getCollectionFromStorage = (): Species[] => {
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
const setCollectionInStorage = (collection: Species[]): Species[] => {
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
    const { data: collection, error } = useSWR<Species[]>(COLLECTION_KEY, getCollectionFromStorage, {
        revalidateOnFocus: false, // Optional: prevents re-fetching on window focus
    });

    const addItem = useCallback((item: Species) => {
        const currentCollection = getCollectionFromStorage();
        if (!currentCollection.some(c => c.id === item.id)) {
            const updatedCollection = [...currentCollection, item];
            // Update localStorage and then revalidate SWR cache
            setCollectionInStorage(updatedCollection);
            mutate(COLLECTION_KEY, updatedCollection, false); // Update local cache without re-fetching
        }
    }, []);

    const removeItem = useCallback((itemId: number) => {
        const currentCollection = getCollectionFromStorage();
        const updatedCollection = currentCollection.filter(item => item.id !== itemId);
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
