'use client';

import { useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

export function useUserRole() {
  const { user, firestore } = useFirebase();

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userData, isLoading, error } = useDoc(userDocRef);

  // Effectively loading if we have a user but haven't confirmed their role data yet
  const isEffectivelyLoading = isLoading || (!!user && !userData && !error);

  return {
    role: userData?.role || null,
    isLoading: isEffectivelyLoading,
    userData,
    error
  };
}
