'use client';

import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';

export function useUserVoicesRealtime() {
  const { user, firestore } = useFirebase();

  // Optimized query for ownership listing
  const voicesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, 'voices'),
      where('userId', '==', user.uid),
      limit(50)
    );
  }, [user?.uid, firestore]);

  const { data: voices, isLoading, error } = useCollection(voicesQuery);

  return { voices, isLoading, error };
}