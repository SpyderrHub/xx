
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, Firestore, getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

/**
 * Aggressive Caching for Firestore:
 * We enable persistent local cache which effectively stores Firestore reads 
 * in IndexedDB for up to 1 year (or until manual clearance).
 * Equivalent to: Cache-Control: public, max-age=31536000, immutable
 */
export function initializeFirebase() {
  const apps = getApps();
  const firebaseApp = apps.length ? apps[0] : initializeApp(firebaseConfig);
  
  const auth = getAuth(firebaseApp);
  const storage = getStorage(firebaseApp);
  
  let firestore: Firestore;
  
  try {
    // Attempt to initialize Firestore with persistent local caching
    // Note: initializeFirestore can only be called once per app instance.
    firestore = initializeFirestore(firebaseApp, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    });
  } catch (error: any) {
    // If initializeFirestore fails (e.g. it was already initialized), 
    // we fallback to getFirestore to return the existing instance.
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
