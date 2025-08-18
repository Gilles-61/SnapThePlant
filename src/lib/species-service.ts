
'use server';

import { collection, getDocs, writeBatch, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Species } from '@/lib/mock-database';

const SPECIES_COLLECTION = 'species';

/**
 * Fetches all species from the Firestore database.
 * @returns A promise that resolves to an array of species.
 */
export async function getAllSpecies(): Promise<Species[]> {
  const speciesCollection = collection(db, SPECIES_COLLECTION);
  const snapshot = await getDocs(speciesCollection);
  
  if (snapshot.empty) {
    console.warn("Firestore collection is empty. You may need to run the seed script.");
    return [];
  }

  const speciesList = snapshot.docs.map(doc => ({
    ...doc.data(),
    id: parseInt(doc.id, 10),
  })) as Species[];
  
  // Sort by ID to maintain a consistent order
  return speciesList.sort((a, b) => a.id - b.id);
}

/**
 * Deletes a species from the Firestore database.
 * @param speciesId The ID of the species to delete.
 * @returns A promise that resolves to an object indicating success or failure.
 */
export async function deleteSpecies(speciesId: number): Promise<{ success: boolean }> {
    try {
        const docRef = doc(db, SPECIES_COLLECTION, String(speciesId));
        await deleteDoc(docRef);
        console.log(`Successfully deleted species with ID: ${speciesId}`);
        return { success: true };
    } catch (error) {
        console.error("Error deleting species:", error);
        return { success: false };
    }
}
