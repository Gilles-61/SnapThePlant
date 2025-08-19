
import { openDB, type IDBPDatabase } from 'idb';
import type { CollectionItem } from '@/hooks/use-collection';

const DB_NAME = 'SnapThePlantDB';
const DB_VERSION = 1;
const STORE_NAME = 'collection';

let dbPromise: Promise<IDBPDatabase> | null = null;

// This function manages a singleton promise for the database connection.
export const getDb = (userId: string): Promise<IDBPDatabase> => {  
  if (dbPromise) {
    return dbPromise;
  }
  
  // Use a user-specific database name
  const userDbName = `${DB_NAME}-${userId}`;

  dbPromise = openDB(userDbName, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
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
  await tx.store.put(item);
  await tx.done;
};

export const removeItemFromDb = async (db: IDBPDatabase, id: number): Promise<void> => {
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.store.delete(id);
  await tx.done;
};
