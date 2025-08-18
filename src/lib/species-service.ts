
'use server';

import { collection, getDocs, writeBatch, doc, deleteDoc, getCountFromServer } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { database as mockDatabase, type Species } from '@/lib/mock-database';

const SPECIES_COLLECTION = 'species';

/**
 * Seeds the Firestore database with initial data from the mock database.
 * This function should be called manually or under controlled conditions,
 * not as part of the regular data fetching process.
 */
export async function seedDatabase() {
  const speciesCollection = collection(db, SPECIES_COLLECTION);
  const snapshot = await getCountFromServer(speciesCollection);

  if (snapshot.data().count === 0) {
    console.log('Species collection is empty. Seeding database...');
    const batch = writeBatch(db);
    mockDatabase.forEach((species) => {
      const docRef = doc(db, SPECIES_COLLECTION, String(species.id));
      batch.set(docRef, species);
    });
    await batch.commit();
    console.log('Database seeded successfully.');
    return { success: true, message: 'Database seeded successfully.' };
  } else {
    console.log('Database already contains data. Skipping seed.');
    return { success: false, message: 'Database already seeded.' };
  }
}

/**
 * Fetches all species from the Firestore database.
 * It will attempt to seed the database ONLY if it's completely empty.
 * @returns A promise that resolves to an array of species.
 */
export async function getAllSpecies(): Promise<Species[]> {
  // Attempt to seed the database only if it's empty. This is a one-time operation.
  await seedDatabase();
  
  const speciesCollection = collection(db, SPECIES_COLLECTION);
  const snapshot = await getDocs(speciesCollection);
  
  if (snapshot.empty) {
    console.warn("Firestore collection is empty and seeding may have failed.");
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
