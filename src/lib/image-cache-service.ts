
'use server';

import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const IMAGE_CACHE_COLLECTION = 'imageCache';

/**
 * Caches an image data URI for a given species ID in Firestore.
 * @param speciesId The ID of the species.
 * @param imageDataUri The data URI of the generated image.
 */
export async function cacheImage(speciesId: number, imageDataUri: string): Promise<void> {
  try {
    const docRef = doc(db, IMAGE_CACHE_COLLECTION, String(speciesId));
    await setDoc(docRef, {
      imageDataUri,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error(`Error caching image for species ID ${speciesId}:`, error);
  }
}

/**
 * Retrieves a cached image data URI for a given species ID from Firestore.
 * @param speciesId The ID of the species.
 * @returns The cached data URI or null if not found.
 */
export async function getCachedImage(speciesId: number): Promise<string | null> {
  try {
    const docRef = doc(db, IMAGE_CACHE_COLLECTION, String(speciesId));
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data().imageDataUri;
    }
    return null;
  } catch (error) {
    console.error(`Error retrieving cached image for species ID ${speciesId}:`, error);
    return null;
  }
}

/**
 * Deletes a cached image for a given species ID from Firestore.
 * This should be called when a species is deleted.
 * @param speciesId The ID of the species whose cached image should be deleted.
 */
export async function deleteCachedImage(speciesId: number): Promise<void> {
  try {
    const docRef = doc(db, IMAGE_CACHE_COLLECTION, String(speciesId));
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting cached image for species ID ${speciesId}:`, error);
  }
}
