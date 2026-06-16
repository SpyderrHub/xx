'use client';

import { useAllVoicesRealtime } from '@/hooks/use-all-voices-realtime';
import { AuthorVoiceCard } from './author-voice-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Library, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AllVoicesList() {
  const { voices, isLoading, error } = useAllVoicesRealtime();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-44 rounded-2xl bg-white/5" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-8 bg-red-500/5 rounded-2xl border border-red-500/20">
        <AlertCircle className="h-10 w-10 text-red-400 mb-4" />
        <h3 className="font-bold text-red-400">Query Error</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-[250px]">
          Unable to fetch platform voices. Check your internet connection or console for permissions.
        </p>
      </div>
    );
  }

  if (!voices || voices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-8 bg-white/5 rounded-2xl border border-dashed border-white/10">
        <Library className="h-12 w-12 text-muted-foreground/20 mb-4" />
        <h3 className="font-semibold text-muted-foreground">Library is Empty</h3>
        <p className="text-xs text-muted-foreground/60 max-w-[200px] mt-1">
          Once users or admins upload voice samples, they will appear here for management.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <AnimatePresence mode="popLayout">
        {voices.map((voice) => (
          <AuthorVoiceCard key={voice.id} voice={voice} />
        ))}
      </AnimatePresence>
    </div>
  );
}
