'use client';

import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';

/**
 * Hook to fetch all voices across the platform for administrative management.
 * Ordered by most recent uploads first.
 */
export function useAllVoicesRealtime() {
  const { firestore } = useFirebase();

  const voicesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'voices'),
      orderBy('createdAt', 'desc'),
      limit(100) // Shows up to 100 most recent for audit
    );
  }, [firestore]);

  const { data: voices, isLoading, error } = useCollection(voicesQuery);

  return { voices, isLoading, error };
}
