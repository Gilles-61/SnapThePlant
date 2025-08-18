
'use server';

import { collection, getDocs, writeBatch, doc, deleteDoc, getCountFromServer } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { database as mockDatabase, type Species } from '@/lib/mock-database';

const SPECIES_COLLECTION = 'species';

/**
 * Seeds the Firestore database with initial data from the mock database.
 * This function checks if the collection is empty before seeding to prevent duplicates.
 */
export async function seedDatabase() {
  const speciesCollection = collection(db, SPECIES_COLLECTION);
  const snapshot = await getCountFromServer(speciesCollection);

  if (snapshot.data().count === 0) {
    console.log('Species collection is empty. Seeding database...');
    const batch = writeBatch(db);
    mockDatabase.forEach((species) => {
      // Use the numeric ID from the mock database as the document ID in Firestore
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
 * @returns A promise that resolves to an array of species.
 */
export async function getAllSpecies(): Promise<Species[]> {
  try {
    // Ensure the database is seeded if it's empty
    await seedDatabase();
    
    const speciesCollection = collection(db, SPECIES_COLLECTION);
    const snapshot = await getDocs(speciesCollection);
    const speciesList = snapshot.docs.map(doc => ({
      ...doc.data(),
      // Ensure the id from the document is correctly typed
      id: parseInt(doc.id, 10), 
    })) as Species[];
    // Sort by ID to maintain a consistent order
    return speciesList.sort((a, b) => a.id - b.id);
  } catch (error) {
    console.error("Error fetching species:", error);
    // Fallback to mock database in case of Firestore error
    return mockDatabase;
  }
}

/**
 * Deletes a species from the Firestore database.
 * @param speciesId The ID of the species to delete.
 * @returns A promise that resolves when the deletion is complete.
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
