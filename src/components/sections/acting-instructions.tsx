'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause, Quote, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';

const SCENARIOS = [
  { 
    instruction: "Speak with a sarcastic tone", 
    reference: "Oh sure, because building an entire neural engine in a weekend is totally normal behavior." 
  },
  { 
    instruction: "Whisper this like a secret", 
    reference: "The key to the vault is hidden behind the third portrait in the library, don't tell anyone." 
  },
  { 
    instruction: "Deliver with high energy", 
    reference: "Welcome everyone to the grand opening of QuantisAI Labs! Today we change everything!" 
  },
  { 
    instruction: "Sound calm and meditative", 
    reference: "Close your eyes and breathe deeply. Imagine a world where your voice can reach anyone, anywhere." 
  },
];

export default function ActingInstructionsSection() {
  const { firestore } = useFirebase();
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeCharName, setActiveCharName] = useState('Sameer');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch specific voices from the database
  const voicesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'voices'),
      where('voiceName', 'in', ['Sameer', 'Anaya', 'Manvi', 'Kabir', 'Zoya']),
      limit(5)
    );
  }, [firestore]);

  const { data: dbVoices, isLoading: voicesLoading } = useCollection(voicesQuery);

  // Map database voices or use fallbacks
  const characters = useMemo(() => {
    const defaults = [
      { id: 'sameer', name: 'Sameer', initials: 'S', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', refText: null },
      { id: 'anaya', name: 'Anaya', initials: 'A', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', refText: null },
      { id: 'manvi', name: 'Manvi', initials: 'M', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', refText: null },
      { id: 'kabir', name: 'Kabir', initials: 'K', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', refText: null },
      { id: 'zoya', name: 'Zoya', initials: 'Z', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', refText: null },
    ];

    if (!dbVoices) return defaults;

    return defaults.map(def => {
      const dbMatch = dbVoices.find(v => v.voiceName.toLowerCase() === def.name.toLowerCase());
      if (dbMatch) {
        return {
          ...def,
          audio: dbMatch.audioUrl || def.audio,
          refText: dbMatch.referenceText || null
        };
      }
      return def;
    });
  }, [dbVoices]);

  const selectedVoice = useMemo(() => 
    characters.find(c => c.name === activeCharName) || characters[0]
  , [characters, activeCharName]);

  const nextInstruction = () => {
    stopAudio();
    setActiveIndex((prev) => (prev + 1) % SCENARIOS.length);
  };
  
  const prevInstruction = () => {
    stopAudio();
    setActiveIndex((prev) => (prev - 1 + SCENARIOS.length) % SCENARIOS.length);
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  const handlePlayToggle = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (selectedVoice) {
      if (audioRef.current) {
        audioRef.current.src = selectedVoice.audio;
      } else {
        audioRef.current = new Audio(selectedVoice.audio);
      }
      audioRef.current.onended = () => setIsPlaying(false);
    }
    return () => stopAudio();
  }, [selectedVoice]);

  return (
    <section className="w-full bg-[#0B0B0F] py-20 lg:py-40 overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Panel: Interactive Demo */}
          <div className="space-y-10">
            <div className="relative bg-white/[0.02] border border-white/5 rounded-[32px] p-6 md:p-12 flex flex-col items-center justify-center min-h-[500px] md:min-h-[600px] shadow-2xl backdrop-blur-sm overflow-hidden">
              
              {/* Sliding Carousel */}
              <div className="relative w-full max-w-[400px] h-[320px] flex items-center justify-center">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={`${activeIndex}-${activeCharName}`}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className="absolute inset-0 rounded-[32px] flex flex-col items-center justify-center p-8 text-center shadow-2xl backdrop-blur-md border bg-[#DCD0E8] text-[#1F1F1F] border-white/40"
                  >
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Instruction</span>
                        <p className="text-xl md:text-2xl font-black leading-tight tracking-tight">
                          "{SCENARIOS[activeIndex].instruction}"
                        </p>
                      </div>

                      <div className="h-px w-12 bg-black/10 mx-auto" />

                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-50">
                          <Quote className="h-3 w-3 fill-current" />
                          <span>Reference Text</span>
                        </div>
                        <p className="text-sm md:text-base font-medium leading-relaxed italic text-black/70 px-4 line-clamp-4">
                          {selectedVoice.refText || SCENARIOS[activeIndex].reference}
                        </p>
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handlePlayToggle}
                      disabled={voicesLoading}
                      className="absolute -bottom-6 h-16 w-16 rounded-full bg-[#1F1F1F] text-white flex items-center justify-center shadow-2xl border-4 border-[#0B0B0F] z-20 group"
                    >
                      {voicesLoading ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : isPlaying ? (
                        <Pause className="h-6 w-6 fill-current" />
                      ) : (
                        <Play className="h-6 w-6 fill-current ml-1 group-hover:text-primary transition-colors" />
                      )}
                    </motion.button>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                <button 
                  onClick={prevInstruction}
                  className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 p-3 text-white/20 hover:text-white transition-colors z-30"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button 
                  onClick={nextInstruction}
                  className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 p-3 text-white/20 hover:text-white transition-colors z-30"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              </div>

              {/* Character Pills */}
              <div className="mt-20 flex flex-wrap justify-center gap-3">
                {characters.map((char) => (
                  <button
                    key={char.id}
                    onClick={() => {
                      stopAudio();
                      setActiveCharName(char.name);
                    }}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 border",
                      activeCharName === char.name 
                        ? "bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.15)] scale-105" 
                        : "bg-white/5 text-white/40 border-white/5 hover:bg-white/10"
                    )}
                  >
                    <div className={cn(
                      "h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black transition-colors",
                      activeCharName === char.name ? "bg-black text-white" : "bg-white/10"
                    )}>
                      {char.initials}
                    </div>
                    {char.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Description */}
          <div className="max-w-[500px] space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
              <span>Directorial Control</span>
            </div>
            <h2 className="text-[40px] md:text-[64px] font-black text-white leading-[1.05] tracking-tight">
              Acting <br />
              <span className="text-primary">instructions</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium">
              Direct the emotional delivery of every line. Specify tone, pacing, emphasis, and mood with natural language instructions.
            </p>
            <ul className="space-y-4 pt-4">
               {['Custom Emotional States', 'Whisper & Shout Modes', 'Variable Pacing Control'].map((item) => (
                 <li key={item} className="flex items-center gap-3 text-sm font-bold text-white/80">
                   <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                   {item}
                 </li>
               ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
