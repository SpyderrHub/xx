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
  setDoc
} from 'firebase/firestore';
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

async function triggerServerSideOtp(user: any) {
  try {
    const idToken = await user.getIdToken();
    const res = await fetch('/api/auth/resend-otp', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`
      }
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to trigger verification email');

    if (data.debugCode && process.env.NODE_ENV === 'development') {
      console.log(`[DEV] Verification OTP: ${data.debugCode}`);
    }
  } catch (error) {
    console.error('[AUTH] Failed to trigger server-side OTP:', error);
    throw error;
  }
}

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
    const userIp = await getPublicIp();

    const userData = {
      uid: user.uid,
      name: fullName,
      email: user.email,
      createdAt: new Date().toISOString(),
      subscriptionPlan: 'free',
      subscriptionType: 'monthly',
      credits: 3000,
      role: 'user',
      subscriptionId: null,
      paymentStatus: 'inactive',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: null,
      lastIp: userIp,
      isVerified: false,
    };

    const userDocRef = doc(firestore, 'users', user.uid);
    await setDoc(userDocRef, userData);

    await triggerServerSideOtp(user);

    return userCredential;
  } catch (error: any) {
    console.error('[AUTH] Sign-up sequence failed:', error);
    toast({
      variant: 'destructive',
      title: 'Registration failed',
      description:
        error.code === 'auth/email-already-in-use'
          ? 'This email is already registered.'
          : error.message || 'Could not complete registration.',
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
