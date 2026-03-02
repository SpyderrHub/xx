
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useFirebase } from '@/firebase';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const featureCards = [
  { title: 'Text to Speech', icon: <MessageSquare className="h-6 w-6 text-purple-400" />, href: '/dashboard/text-to-speech' },
  { title: 'Speech to Text', icon: <Ear className="h-6 w-6 text-blue-400" />, href: '/dashboard/speech-to-text' },
  { title: 'Voice Cloning', icon: <Mic2 className="h-6 w-6 text-pink-400" />, href: '/dashboard/voice-cloning' },
  { title: 'Voice Designer', icon: <Sparkles className="h-6 w-6 text-amber-400" />, href: '/dashboard/voice-designer' },
  { title: 'Voice Library', icon: <Library className="h-6 w-6 text-emerald-400" />, href: '/dashboard/voice-library' },
  { title: 'Audio Tools', icon: <Wand2 className="h-6 w-6 text-indigo-400" />, href: '#' },
];

const libraryVoices = [
  { name: 'Aria', desc: 'Versatile, expressive narrator', tags: ['warm', 'friendly'], avatar: 'https://picsum.photos/seed/aria/100/100' },
  { name: 'Javier', desc: 'Deep, authoritative voice', tags: ['calm', 'authoritative'], avatar: 'https://picsum.photos/seed/javier/100/100' },
  { name: 'Chloé', desc: 'Sophisticated French accent', tags: ['calm', 'soft'], avatar: 'https://picsum.photos/seed/chloe/100/100' },
  { name: 'Kenji', desc: 'Energetic, youthful persona', tags: ['energetic', 'friendly'], avatar: 'https://picsum.photos/seed/kenji/100/100' },
  { name: 'Isabella', desc: 'Professional UK news style', tags: ['authoritative', 'clear'], avatar: 'https://picsum.photos/seed/isabella/100/100' },
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
  const { user } = useFirebase();

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Top Section */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">My workspace</p>
        <h1 className="text-3xl font-bold tracking-tight">Good evening, {user?.displayName?.split(' ')[0] || 'User'}</h1>
      </motion.div>

      {/* Feature Cards Grid (6 cards in 2 rows) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {featureCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={card.href}>
              <Card className="h-full border-white/5 bg-white/5 hover:bg-white/10 transition-all group cursor-pointer border-none shadow-none">
                <CardContent className="p-8 flex flex-col items-center justify-center text-center gap-4">
                  <div className="p-3 rounded-2xl bg-white/5 group-hover:scale-110 transition-transform">
                    {card.icon}
                  </div>
                  <span className="text-sm font-bold text-white/90 group-hover:text-white">{card.title}</span>
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
            {libraryVoices.map((voice, i) => (
              <motion.div
                key={voice.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
              >
                <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group">
                  <Avatar className="h-12 w-12 border-2 border-white/5 group-hover:border-primary/30 transition-all">
                    <AvatarImage src={voice.avatar} className="object-cover" />
                    <AvatarFallback className="bg-white/5 text-xs">{voice.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white/90">{voice.name}</span>
                      <div className="flex gap-1">
                        {voice.tags.map(tag => (
                          <span key={tag} className="text-[9px] uppercase font-black tracking-widest text-white/30">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-white/40 truncate">{voice.desc}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlusCircle className="h-5 w-5 text-primary" />
                  </Button>
                </div>
              </motion.div>
            ))}
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
