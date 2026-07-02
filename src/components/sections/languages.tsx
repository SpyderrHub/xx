'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Globe2, Sparkles } from 'lucide-react';

const languages = [
  { name: 'Hindi', flagId: 'flag-hindi' },
  { name: 'Bengali', flagId: 'flag-hindi' },
  { name: 'Telugu', flagId: 'flag-telugu' },
  { name: 'Marathi', flagId: 'flag-hindi' },
  { name: 'Tamil', flagId: 'flag-tamil' },
  { name: 'Kannada', flagId: 'flag-hindi' },
  { name: 'Gujarati', flagId: 'flag-hindi' },
  { name: 'Malayalam', flagId: 'flag-hindi' },
  { name: 'Punjabi', flagId: 'flag-hindi' },
];

// Doubling the array for the vertical marquee
const marqueeLanguages = [...languages, ...languages];

const LanguagesSection = () => {
  return (
    <section className="py-24 sm:py-32 bg-transparent relative overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Text Content */}
          <div className="space-y-8 max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
              <Globe2 className="h-3 w-3" />
              <span>Native Indic Support</span>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-6xl leading-tight">
                Fluent in Every <br />
                <span className="text-primary">Regional Dialect.</span>
              </h2>
              <p className="text-sm sm:text-xl text-muted-foreground leading-relaxed font-medium">
                QuantisAI Labs is optimized for the linguistic diversity of the Indian subcontinent. Experience perfect prosody in 12+ Indic languages, capturing the true soul of every region.
              </p>
            </div>

            <ul className="space-y-4 pt-4">
              {['Natural Intonation & Dialects', 'Real-time Phonetic Accuracy', 'Context-aware Synthesis'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-xs sm:text-sm font-bold text-white/80">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="pt-6">
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                New regional voices added weekly
              </p>
            </div>
          </div>

          {/* Right Column: Vertical Marquee */}
          <div className="relative h-[400px] sm:h-[600px] w-full overflow-hidden">
            {/* Gradient Overlays for smooth fading edges */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0B0B0F] to-transparent z-10" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0B0B0F] to-transparent z-10" />

            <motion.div
              className="flex flex-col gap-4"
              animate={{
                y: ['0%', '-50%'],
              }}
              transition={{
                duration: 25,
                ease: 'linear',
                repeat: Infinity,
              }}
            >
              {marqueeLanguages.map((lang, i) => {
                const flagImage = PlaceHolderImages.find((img) => img.id === lang.flagId);

                return (
                  <div key={`${lang.name}-${i}`} className="w-full">
                    <Card className="bg-white/[0.02] backdrop-blur-md border-white/5 hover:border-primary/30 transition-all duration-500 group cursor-default shadow-2xl rounded-2xl overflow-hidden">
                      <CardContent className="p-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="relative h-10 w-14 overflow-hidden rounded-lg border border-white/10 shadow-lg shrink-0">
                            {flagImage ? (
                              <Image
                                src={flagImage.imageUrl}
                                alt={lang.name}
                                fill
                                unoptimized
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            ) : (
                              <div className="h-full w-full bg-primary/10" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-black text-white text-base group-hover:text-primary transition-colors truncate">
                              {lang.name}
                            </h3>
                            <div className="flex items-center gap-1.5">
                              <Sparkles className="h-2.5 w-2.5 text-primary/40" />
                              <p className="text-[8px] uppercase tracking-widest text-muted-foreground font-black opacity-40">
                                Neural Engine Active
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse hidden sm:block" />
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </motion.div>
          </div>

        </div>
      </div>
      
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
    </section>
  );
};

export default LanguagesSection;
