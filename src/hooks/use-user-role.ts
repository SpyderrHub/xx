
'use client';

import { useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

export function useUserRole() {
  const { user, firestore } = useFirebase();

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userData, isLoading } = useDoc(userDocRef);

  // Return null for role if still loading or if no data found yet
  // This prevents UI flashing or incorrect redirects before role is known
  return {
    role: userData?.role || null,
    isLoading: isLoading,
    userData
  };
}
