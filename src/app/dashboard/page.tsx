
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Ear,
  Mic2,
  Sparkles,
  Library,
  ChevronRight,
  ArrowRight,
  Loader2,
  Play,
  Pause,
  Music
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { motion } from 'framer-motion';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { WeavyPattern } from '@/components/author/avatar-upload';

const featureCards = [
  { title: 'Text to Speech', icon: <MessageSquare className="h-6 w-6 text-purple-400" />, href: '/dashboard/text-to-speech' },
  { title: 'Speech to Text', icon: <Ear className="h-6 w-6 text-blue-400" />, href: '/dashboard/speech-to-text' },
  { title: 'Voice Cloning', icon: <Mic2 className="h-6 w-6 text-pink-400" />, href: '/dashboard/voice-cloning' },
  { title: 'Voice Designer', icon: <Sparkles className="h-6 w-6 text-amber-400" />, href: '/dashboard/voice-designer' },
  { title: 'Music Generator', icon: <Music className="h-6 w-6 text-emerald-400" />, href: '/dashboard/music-generator' },
  { title: 'Voice Library', icon: <Library className="h-6 w-6 text-indigo-400" />, href: '/dashboard/voice-library' },
];

const studioCards = [
  { 
    title: 'Voice Designer', 
    desc: 'Design a new voice from text prompt', 
    icon: <Sparkles className="h-5 w-5 text-amber-400" />,
    href: '/dashboard/voice-designer'
  },
  { 
    title: 'Clone Your Voice', 
    desc: 'Create a realistic clone of your voice', 
    icon: <Mic2 className="h-5 w-5 text-pink-400" />,
    href: '/dashboard/voice-cloning'
  },
  { 
    title: 'Voice Library', 
    desc: 'Browse and manage voices', 
    icon: <Library className="h-5 w-5 text-emerald-400" />,
    href: '/dashboard/voice-library'
  },
];

export default function DashboardPage() {
  const { user, firestore } = useFirebase();
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch the latest 5 voices from Firestore
  const voicesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'voices'),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
  }, [firestore]);

  const { data: latestVoices, isLoading: isVoicesLoading } = useCollection(voicesQuery);

  const togglePlay = useCallback((e: React.MouseEvent, voice: any) => {
    e.preventDefault();
    e.stopPropagation();

    if (!voice.audioUrl) return;

    if (playingVoiceId === voice.id) {
      audioRef.current?.pause();
      setPlayingVoiceId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(voice.audioUrl);
      audioRef.current.onended = () => setPlayingVoiceId(null);
      audioRef.current.play().catch(err => console.error("Playback error:", err));
      setPlayingVoiceId(voice.id);
    }
  }, [playingVoiceId]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Clean Greeting Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-2"
      >
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">My Workspace</p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
          Welcome, {user?.displayName?.split(' ')[0] || 'User'}
        </h1>
      </motion.div>

      {/* Feature Square Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {featureCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={card.href}>
              <Card className="h-full aspect-square border-none bg-white/[0.03] backdrop-blur-sm hover:bg-white/10 transition-all group cursor-pointer shadow-none rounded-[2rem] overflow-hidden">
                <CardContent className="p-0 h-full flex flex-col items-center justify-center text-center gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 group-hover:scale-110 transition-transform duration-300">
                    {card.icon}
                  </div>
                  <span className="text-xs md:text-sm font-bold text-white/90 group-hover:text-white px-2">
                    {card.title}
                  </span>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Bottom Section (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 pt-4">
        
        {/* Left Column: Latest from the library */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">Latest from the library</h2>
          </div>
          
          <div className="space-y-3">
            {isVoicesLoading ? (
              <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary/50" />
              </div>
            ) : latestVoices && latestVoices.length > 0 ? (
              latestVoices.map((voice, i) => {
                const isGradient = voice.avatarUrl?.startsWith('weavy:');
                const gradientIndex = isGradient ? parseInt(voice.avatarUrl.split(':')[1]) : 0;
                
                return (
                  <motion.div
                    key={voice.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                  >
                    <Link href="/dashboard/voice-library">
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all cursor-pointer group relative shadow-sm">
                        <Avatar className="h-12 w-12 border-2 border-white/5 group-hover:border-primary/30 transition-all overflow-hidden bg-white/5">
                          {isGradient ? (
                            <WeavyPattern presetIndex={gradientIndex} />
                          ) : (
                            <>
                              <AvatarImage src={voice.avatarUrl} className="object-cover" />
                              <AvatarFallback className="bg-white/5 text-xs">{voice.voiceName[0]}</AvatarFallback>
                            </>
                          )}
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "font-bold transition-colors",
                              playingVoiceId === voice.id ? "text-primary" : "text-white/90"
                            )}>
                              {voice.voiceName}
                            </span>
                            {voice.style && (
                              <span className="text-[9px] uppercase font-black tracking-widest text-white/30">{voice.style}</span>
                            )}
                          </div>
                          <p className="text-xs text-white/40 truncate">{voice.description || voice.language}</p>
                        </div>
                        <Button 
                          variant="secondary" 
                          size="icon" 
                          onClick={(e) => togglePlay(e, voice)}
                          className={cn(
                            "h-10 w-10 rounded-full transition-all duration-300 relative z-10",
                            playingVoiceId === voice.id 
                              ? "bg-primary text-white scale-110 shadow-lg shadow-primary/20" 
                              : "bg-white/10 text-white/60 hover:text-primary hover:bg-white/20"
                          )}
                        >
                          {playingVoiceId === voice.id ? (
                            <Pause className="h-5 w-5 fill-current" />
                          ) : (
                            <Play className="h-5 w-5 fill-current ml-0.5" />
                          )}
                        </Button>
                      </div>
                    </Link>
                  </motion.div>
                );
              })
            ) : (
              <div className="p-8 text-center rounded-3xl bg-white/5 border border-dashed border-white/10">
                <p className="text-sm text-white/20 italic">No voices found in the library.</p>
              </div>
            )}
          </div>

          <Button variant="ghost" className="w-full text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 rounded-xl h-12" asChild>
            <Link href="/dashboard/voice-library">
              Explore Library
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Right Column: Create or clone a voice */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold tracking-tight text-center lg:text-left">Create or clone a voice</h2>
          
          <div className="space-y-4">
            {studioCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
              >
                <Link href={card.href}>
                  <Card className="border-white/5 bg-white/5 hover:bg-white/10 transition-all group cursor-pointer border-none shadow-none rounded-2xl overflow-hidden">
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="p-2.5 rounded-xl bg-white/5 shrink-0 group-hover:text-white transition-colors">
                        {card.icon}
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-white/90 group-hover:text-white">{card.title}</h3>
                        <p className="text-xs text-white/40 leading-relaxed">{card.desc}</p>
                      </div>
                      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                        <ArrowRight className="h-4 w-4 text-white/40" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
