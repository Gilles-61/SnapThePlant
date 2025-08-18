
import 'dotenv/config';
import { collection, getCountFromServer, writeBatch, doc } from 'firebase/firestore';
import { db } from './firebase'; // Adjust path if necessary
import { database as mockDatabase } from './mock-database'; // Adjust path if necessary

const SPECIES_COLLECTION = 'species';

/**
 * Seeds the Firestore database with initial data from the mock database.
 * This function should be called manually via a script.
 */
export async function seedDatabase() {
  const speciesCollection = collection(db, SPECIES_COLLECTION);
  
  try {
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
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

// If this script is run directly from the command line, execute the seed function.
if (require.main === module) {
  seedDatabase().then(() => {
    console.log("Seeding complete.");
    process.exit(0);
  });
}
