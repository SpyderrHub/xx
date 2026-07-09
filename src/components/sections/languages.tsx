'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Globe2, Sparkles, Star, Languages as LangIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const languages = [
  { name: 'Hindi', flagId: 'flag-hindi', top: '20%', left: '30%', size: 'h-2 w-2' },
  { name: 'Bengali', flagId: 'flag-hindi', top: '40%', left: '15%', size: 'h-3 w-3' },
  { name: 'Telugu', flagId: 'flag-telugu', top: '65%', left: '25%', size: 'h-2 w-2' },
  { name: 'Marathi', flagId: 'flag-hindi', top: '80%', left: '50%', size: 'h-4 w-4' },
  { name: 'Tamil', flagId: 'flag-tamil', top: '60%', left: '75%', size: 'h-3 w-3' },
  { name: 'Kannada', flagId: 'flag-hindi', top: '35%', left: '85%', size: 'h-2 w-2' },
  { name: 'English', flagId: 'flag-english-us', top: '15%', left: '65%', size: 'h-3 w-3' },
  { name: 'Spanish', flagId: 'flag-spanish', top: '85%', left: '80%', size: 'h-2 w-2' },
  { name: 'Japanese', flagId: 'flag-japanese', top: '10%', left: '45%', size: 'h-4 w-4' },
];

const LangGrid = [
  "Hindi", "Sanskrit", "Arabic", "Chinese", "Korean", "French", "German", "Spanish", "Portuguese", "Italian", "Russian", "Turkish", "Vietnamese", "Thai", "Indonesian", "Dutch", "Polish", "Hebrew", "Swahili"
];

export default function LanguagesSection() {
  const [hoveredLang, setHoveredLang] = useState<string | null>(null);

  return (
    <section className="pt-0 pb-24 sm:pt-0 sm:pb-40 bg-transparent relative overflow-hidden">
      <div className="container mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Text Content */}
          <div className="space-y-10 max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-[0.2em]">
              <Globe2 className="h-3 w-3" />
              <span>Native Dialect Support</span>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl leading-tight">
                500+ Global <br />
                <span className="text-primary">Languages.</span>
              </h2>
              <p className="text-base sm:text-xl text-muted-foreground leading-relaxed font-medium">
                Optimized for native Indic support and world dialects. Capture the authentic prosody, local accents, and cultural nuances of every region.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
               {LangGrid.slice(0, 12).map(l => (
                 <div key={l} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors cursor-default text-center">
                    {l}
                 </div>
               ))}
               <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs font-black uppercase tracking-widest text-primary text-center">
                  & 500+ More
               </div>
            </div>

            <div className="pt-6">
              <p className="text-xs text-muted-foreground font-black uppercase tracking-[0.3em] flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                Automatic Language Detection Enabled
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Galaxy */}
          <div className="relative h-[500px] sm:h-[600px] w-full flex items-center justify-center">
            {/* Galaxy Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,102,0,0.05)_0%,transparent_70%)]" />
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute h-64 w-64 bg-primary/20 blur-[100px] rounded-full" 
            />

            {/* Orbiting Language Stars */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
              className="relative w-full h-full"
            >
              {languages.map((lang, i) => (
                <div
                  key={lang.name}
                  className="absolute"
                  style={{ top: lang.top, left: lang.left }}
                >
                  <div className="relative group">
                    <motion.div
                      onMouseEnter={() => setHoveredLang(lang.name)}
                      onMouseLeave={() => setHoveredLang(null)}
                      animate={{ 
                        scale: hoveredLang === lang.name ? 1.5 : [1, 1.2, 1],
                        opacity: hoveredLang === lang.name ? 1 : [0.4, 0.8, 0.4]
                      }}
                      transition={{ 
                        duration: 2 + i % 3, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                      className={cn(
                        "rounded-full cursor-pointer transition-colors duration-300",
                        lang.size,
                        hoveredLang === lang.name ? "bg-primary shadow-[0_0_20px_rgba(255,102,0,0.8)]" : "bg-white/40"
                      )}
                    />

                    <AnimatePresence>
                      {hoveredLang === lang.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.9 }}
                          animate={{ opacity: 1, y: -40, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.9 }}
                          className="absolute bottom-full left-1/2 -translate-x-1/2 z-50 pointer-events-none pb-4"
                        >
                          <div className="bg-black/80 backdrop-blur-xl border border-primary/40 rounded-2xl p-4 shadow-3d flex items-center gap-3 min-w-[160px]">
                            <div className="relative h-8 w-10 overflow-hidden rounded-md border border-white/10 shrink-0">
                              <Image
                                src={PlaceHolderImages.find(img => img.id === lang.flagId)?.imageUrl || ''}
                                alt={lang.name}
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            </div>
                            <div className="text-left">
                              <p className="text-xs font-black text-white uppercase tracking-widest">{lang.name}</p>
                              <div className="flex items-center gap-1 mt-0.5">
                                <Sparkles className="h-2 w-2 text-primary" />
                                <span className="text-[10px] font-bold text-primary/60 uppercase">Native Enabled</span>
                              </div>
                            </div>
                          </div>
                          <div className="absolute top-[calc(100%-16px)] left-1/2 -translate-x-1/2 w-3 h-3 bg-black/80 border-r border-b border-primary/40 rotate-45" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
            </motion.div>

            <div className="absolute pointer-events-none text-center">
              <LangIcon className="h-10 w-10 text-primary/40 mx-auto mb-2" />
              <p className="text-xs font-black uppercase tracking-[0.5em] text-primary/40">Global Hub</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
