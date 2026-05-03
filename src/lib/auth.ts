
'use client';

import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  UserCredential,
} from 'firebase/auth';
import { 
  doc, 
  Firestore, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  limit 
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { toast } from '@/hooks/use-toast';

async function getPublicIp(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Failed to capture IP address:', error);
    return 'unknown';
  }
}

/**
 * Generates a unique 8-character fixed referral code for a new user.
 */
function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function signUpWithEmail(
  auth: Auth,
  firestore: Firestore,
  fullName: string,
  email: string,
  password: string,
  referralCodeFromUrl?: string | null
): Promise<UserCredential> {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(userCredential.user, { displayName: fullName });

    const user = userCredential.user;
    const userIp = await getPublicIp();
    const referralCode = generateReferralCode();

    let referredByUid: string | null = null;
    
    // Check if the user was referred by someone
    if (referralCodeFromUrl) {
      const referrersQuery = query(
        collection(firestore, 'users'), 
        where('referralCode', '==', referralCodeFromUrl), 
        limit(1)
      );
      const referrerSnapshot = await getDocs(referrersQuery);
      if (!referrerSnapshot.empty) {
        referredByUid = referrerSnapshot.docs[0].id;
        
        // Log the referral in the referrer's list as pending
        const referralRecordRef = doc(firestore, 'users', referredByUid, 'referrals', user.uid);
        await setDoc(referralRecordRef, {
          referredUserId: user.uid,
          referredUserName: fullName,
          referredUserEmail: email,
          status: 'pending',
          createdAt: new Date().toISOString(),
          rewardClaimed: false
        });
      }
    }

    const userData = {
      uid: user.uid,
      name: fullName,
      email: user.email,
      createdAt: new Date().toISOString(),
      plan: 'free',
      credits: 3000,
      role: 'user',
      subscriptionId: null,
      paymentStatus: 'inactive',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: null,
      lastIp: userIp,
      referralCode: referralCode,
      referredBy: referredByUid,
    };

    const userDocRef = doc(firestore, 'users', user.uid);

    await setDoc(userDocRef, userData).catch((serverError) => {
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
