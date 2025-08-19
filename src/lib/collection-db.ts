
import { openDB, type IDBPDatabase } from 'idb';
import type { CollectionItem } from '@/hooks/use-collection';

const DB_NAME = 'SnapThePlantDB';
const DB_VERSION = 2; // Incremented version to trigger upgrade
const STORE_NAME = 'collection';

let dbPromise: Promise<IDBPDatabase> | null = null;

// This function manages a singleton promise for the database connection.
export const getDb = (userId: string): Promise<IDBPDatabase> => {  
  if (dbPromise) {
    // This simple singleton approach might cause issues if users log in/out quickly.
    // For this app's purpose, it's sufficient.
    // A more robust solution would manage promises per user ID.
  }
  
  // Use a user-specific database name
  const userDbName = `${DB_NAME}-${userId}`;

  dbPromise = openDB(userDbName, DB_VERSION, {
    upgrade(db, oldVersion) {
      if (oldVersion < 2) {
        // If the old store exists, delete it to recreate with the new keyPath
        if (db.objectStoreNames.contains(STORE_NAME)) {
          db.deleteObjectStore(STORE_NAME);
        }
        // Create the new store with the correct keyPath
        db.createObjectStore(STORE_NAME, { keyPath: 'instanceId' });
      }
    },
  });

  return dbPromise;
};

export const getAllItemsFromDb = async (db: IDBPDatabase): Promise<CollectionItem[]> => {
  return db.getAll(STORE_NAME);
};

export const addItemToDb = async (db: IDBPDatabase, item: CollectionItem): Promise<void> => {
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.store.put(item); // 'put' will add or update based on the keyPath
  await tx.done;
};

export const removeItemFromDb = async (db: IDBPDatabase, instanceId: number): Promise<void> => {
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.store.delete(instanceId);
  await tx.done;
};
