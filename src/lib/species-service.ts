
'use server';

import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Species } from '@/lib/mock-database';
import { seedDatabase } from './seed';
import { getCachedImage, deleteCachedImage } from './image-cache-service';


const SPECIES_COLLECTION = 'species';

/**
 * Fetches all species from the Firestore database.
 * If the collection is empty, it will be seeded from the mock database.
 * It also enriches the data with any cached images.
 * @returns A promise that resolves to an array of species.
 */
export async function getAllSpecies(): Promise<Species[]> {
  try {
    const speciesCollection = collection(db, SPECIES_COLLECTION);
    let snapshot = await getDocs(speciesCollection);
    
    if (snapshot.empty) {
      console.warn("Firestore collection is empty. Running the seeder.");
      await seedDatabase();
      snapshot = await getDocs(speciesCollection);
       if (snapshot.empty) {
        console.error("Seeding seems to have failed. Still no data.");
        return [];
      }
    }

    const speciesList = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: parseInt(doc.id, 10),
    })) as Species[];
    
    // Enrich with cached images
    const enrichedSpeciesList = await Promise.all(
        speciesList.map(async (species) => {
            const cachedUrl = await getCachedImage(species.id);
            if (cachedUrl) {
                return { ...species, image: cachedUrl };
            }
            return species;
        })
    );

    // Sort by ID to maintain a consistent order
    return enrichedSpeciesList.sort((a, b) => a.id - b.id);
  } catch (error) {
      console.error("Error fetching species from Firestore:", error);
      return [];
  }
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
        // Also delete the cached image
        await deleteCachedImage(speciesId);
        console.log(`Successfully deleted species and cached image with ID: ${speciesId}`);
        return { success: true };
    } catch (error) {
        console.error("Error deleting species:", error);
        return { success: false };
    }
}
