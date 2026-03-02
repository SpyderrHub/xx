'use client';

import Link from 'next/link';
import {
  MessageSquare,
  Ear,
  Mic2,
  Sparkles,
  Library,
  Wand2,
  ChevronRight,
  ArrowRight,
  PlusCircle,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { motion } from 'framer-motion';
import { collection, query, orderBy, limit } from 'firebase/firestore';

const featureCards = [
  { title: 'Text to Speech', icon: <MessageSquare className="h-6 w-6 text-purple-400" />, href: '/dashboard/text-to-speech' },
  { title: 'Speech to Text', icon: <Ear className="h-6 w-6 text-blue-400" />, href: '/dashboard/speech-to-text' },
  { title: 'Voice Cloning', icon: <Mic2 className="h-6 w-6 text-pink-400" />, href: '/dashboard/voice-cloning' },
  { title: 'Voice Designer', icon: <Sparkles className="h-6 w-6 text-amber-400" />, href: '/dashboard/voice-designer' },
  { title: 'Voice Library', icon: <Library className="h-6 w-6 text-emerald-400" />, href: '/dashboard/voice-library' },
  { title: 'Audio Tools', icon: <Wand2 className="h-6 w-6 text-indigo-400" />, href: '#' },
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
              <Card className="h-full aspect-square border-white/5 bg-white/5 hover:bg-white/10 transition-all group cursor-pointer border-none shadow-none rounded-[2rem]">
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
          
          <div className="space-y-2">
            {isVoicesLoading ? (
              <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary/50" />
              </div>
            ) : latestVoices && latestVoices.length > 0 ? (
              latestVoices.map((voice, i) => (
                <motion.div
                  key={voice.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                >
                  <Link href="/dashboard/voice-library">
                    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group">
                      <Avatar className="h-12 w-12 border-2 border-white/5 group-hover:border-primary/30 transition-all">
                        <AvatarImage src={voice.avatarUrl} className="object-cover" />
                        <AvatarFallback className="bg-white/5 text-xs">{voice.voiceName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white/90">{voice.voiceName}</span>
                          {voice.style && (
                            <span className="text-[9px] uppercase font-black tracking-widest text-white/30">{voice.style}</span>
                          )}
                        </div>
                        <p className="text-xs text-white/40 truncate">{voice.description || voice.language}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <PlusCircle className="h-5 w-5 text-primary" />
                      </Button>
                    </div>
                  </Link>
                </motion.div>
              ))
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
