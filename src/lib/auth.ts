'use client';

import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  UserCredential,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, Firestore, getDoc, setDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { toast } from '@/hooks/use-toast';

export async function signUpWithEmail(
  auth: Auth,
  firestore: Firestore,
  fullName: string,
  email: string,
  password: string
): Promise<UserCredential> {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(userCredential.user, { displayName: fullName });

    const user = userCredential.user;

    const userData = {
      uid: user.uid,
      name: fullName,
      email: user.email,
      createdAt: new Date().toISOString(),
      plan: 'free',
      credits: 10000, // 10k initial characters
      role: 'user',
      subscriptionId: null,
      paymentStatus: 'inactive',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: null,
    };

    const userDocRef = doc(firestore, 'users', user.uid);

    setDoc(userDocRef, userData).catch((serverError) => {
      const permissionError = new FirestorePermissionError({
        path: userDocRef.path,
        operation: 'create',
        requestResourceData: userData,
      });
      errorEmitter.emit('permission-error', permissionError);

      toast({
        variant: 'destructive',
        title: 'Firestore Error',
        description: 'Could not save user data. Please try again.',
      });
    });

    return userCredential;
  } catch (error: any) {
    toast({
      variant: 'destructive',
      title: 'Sign-up failed',
      description:
        error.code === 'auth/email-already-in-use'
          ? 'This email is already registered.'
          : error.message,
    });
    throw error;
  }
}

export async function signInWithEmail(
  auth: Auth,
  email: string,
  password: string
): Promise<UserCredential> {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    toast({
      variant: 'destructive',
      title: 'Login failed',
      description:
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/user-not-found'
          ? 'Invalid email or password.'
          : 'An unexpected error occurred.',
    });
    throw error;
  }
}

export async function signInWithGoogle(auth: Auth, firestore: Firestore): Promise<UserCredential> {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user already exists in Firestore
    const userDocRef = doc(firestore, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // Create new user entry
      const userData = {
        uid: user.uid,
        name: user.displayName || 'Anonymous User',
        email: user.email,
        createdAt: new Date().toISOString(),
        plan: 'free',
        credits: 10000,
        role: 'user',
        subscriptionId: null,
        paymentStatus: 'inactive',
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: null,
      };
      await setDoc(userDocRef, userData);
    }

    return result;
  } catch (error: any) {
    console.error('Google Sign-In failed:', error);
    toast({
      variant: 'destructive',
      title: 'Authentication failed',
      description: error.message || 'Failed to sign in with Google.',
    });
    throw error;
  }
}

export async function logout(auth: Auth): Promise<void> {
  try {
    await signOut(auth);
  } catch (error: any) {
    toast({
      variant: 'destructive',
      title: 'Logout failed',
      description: error.message,
    });
    throw error;
  }
}
