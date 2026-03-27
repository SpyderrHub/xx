'use client';

import { useState, useRef, useEffect } from 'react';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { 
  Play, 
  Pause, 
  Download, 
  Clock, 
  Mic2, 
  FileText, 
  Loader2, 
  Inbox,
  ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const GenerationRow = ({ gen, playingId, onTogglePlay }: { gen: any, playingId: string | null, onTogglePlay: (gen: any) => void }) => {
  const isPlaying = playingId === gen.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Card className="bg-white/[0.02] border-white/5 hover:bg-white/[0.04] transition-all hover:border-primary/20 group-hover:shadow-lg rounded-2xl overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            {/* Play Button */}
            <div className="shrink-0">
              <Button 
                onClick={() => onTogglePlay(gen)}
                className={cn(
                  "h-12 w-12 rounded-xl transition-all",
                  isPlaying ? "bg-primary text-white" : "bg-white/5 text-white/60 hover:bg-primary/20 hover:text-primary"
                )}
              >
                {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
              </Button>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-3">
                <span className="font-bold text-white/90 truncate">{gen.text}</span>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">
                  <Mic2 className="h-3 w-3" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{gen.voiceName}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 opacity-50" />
                  <span>{new Date(gen.createdAt).toLocaleDateString()} at {new Date(gen.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 opacity-50" />
                  <span>{gen.characters} Characters</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:ml-auto">
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white/5 text-muted-foreground hover:text-white" asChild>
                <a href={gen.audioUrl} download={`saanchi_${gen.id}.mp3`}>
                  <Download className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function MyGenerationsPage() {
  const { user, firestore } = useFirebase();
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const gensQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, 'users', user.uid, 'generations'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
  }, [user, firestore]);

  const { data: generations, isLoading } = useCollection(gensQuery);

  const togglePlay = (gen: any) => {
    if (playingId === gen.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) audioRef.current.pause();
      audioRef.current = new Audio(gen.audioUrl);
      audioRef.current.onended = () => setPlayingId(null);
      audioRef.current.play();
      setPlayingId(gen.id);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Generation History</h1>
          <p className="text-muted-foreground mt-1 text-sm">Access and download your previous AI vocal syntheses.</p>
        </div>
        <Button asChild className="rounded-xl bg-primary hover:bg-primary/90 font-bold group">
          <Link href="/dashboard/text-to-speech">
            New Generation
            <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </Button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
          </div>
        ) : generations && generations.length > 0 ? (
          generations.map((gen) => (
            <GenerationRow 
              key={gen.id} 
              gen={gen} 
              playingId={playingId} 
              onTogglePlay={togglePlay} 
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-80 border-2 border-dashed border-white/5 rounded-[2.5rem] bg-white/[0.02]">
            <div className="h-16 w-16 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
              <Inbox className="h-8 w-8 text-muted-foreground/30" />
            </div>
            <h3 className="text-xl font-bold text-white/80">No generations yet</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs text-center leading-relaxed">
              Your synthesized audio files will appear here once you start using the studio.
            </p>
            <Button variant="link" className="mt-4 text-primary" asChild>
              <Link href="/dashboard/text-to-speech">Open Studio Workspace</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
