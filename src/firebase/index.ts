'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, getFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

/**
 * Standard Firebase Initialization with specialized Firestore SDK caching.
 * Uses persistentLocalCache to store data in the browser's IndexedDB.
 */
export function initializeFirebase() {
  const apps = getApps();
  const firebaseApp = apps.length ? getApp() : initializeApp(firebaseConfig);
  
  const auth = getAuth(firebaseApp);
  const storage = getStorage(firebaseApp);

  // Initialize Firestore with Persistent Local Cache (SDK Cache)
  // We check if it's already initialized to prevent errors during hot-reloading
  let firestore;
  try {
    firestore = initializeFirestore(firebaseApp, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    });
  } catch (e) {
    // If already initialized, fallback to getFirestore
    firestore = getFirestore(firebaseApp);
  }

  return {
    firebaseApp,
    auth,
    firestore,
    storage
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
