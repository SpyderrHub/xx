
'use client';

import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';

export function useUserVoicesRealtime() {
  const { user, firestore } = useFirebase();

  const voicesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, 'voices'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
  }, [user, firestore]);

  const { data: voices, isLoading, error } = useCollection(voicesQuery);

  return { voices, isLoading, error };
}
