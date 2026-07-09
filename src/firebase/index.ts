
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

/**
 * Standard Firebase Initialization.
 * Firestore is initialized using getFirestore to ensure compatibility across 
 * development environments and prevent primary lease acquisition failures.
 */
export function initializeFirebase() {
  const apps = getApps();
  const firebaseApp = apps.length ? getApp() : initializeApp(firebaseConfig);
  
  const auth = getAuth(firebaseApp);
  const storage = getStorage(firebaseApp);
  const firestore = getFirestore(firebaseApp);

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
