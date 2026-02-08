
'use client';

import { useUserVoicesRealtime } from '@/hooks/use-user-voices-realtime';
import { AuthorVoiceCard } from './author-voice-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Inbox } from 'lucide-react';

export function MyUploadedVoicesList() {
  const { voices, isLoading } = useUserVoicesRealtime();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-40 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!voices || voices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-8 bg-white/5 rounded-2xl border border-dashed border-white/10">
        <Inbox className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <h3 className="font-semibold text-muted-foreground">No voices yet</h3>
        <p className="text-xs text-muted-foreground/60 max-w-[200px] mt-1">
          Upload your first 30-second sample to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {voices.map((voice) => (
        <AuthorVoiceCard key={voice.id} voice={voice} />
      ))}
    </div>
  );
}
