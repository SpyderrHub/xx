'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Globe2 } from 'lucide-react';

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

// Double the languages array for a seamless loop
const marqueeLanguages = [...languages, ...languages, ...languages];

const LanguagesSection = () => {
  return (
    <section className="py-32 bg-transparent relative overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-6 sm:px-10 lg:px-16 mb-20">
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-2">
            <Globe2 className="h-3 w-3" />
            <span>Native Indic Support</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-6xl leading-tight">
            Fluent in Every <br />
            <span className="text-primary">Regional Dialect.</span>
          </h2>
          <p className="mt-6 text-sm sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            QuantisAI Labs is optimized for the linguistic diversity of the Indian subcontinent. Experience perfect prosody in 12+ Indic languages.
          </p>
        </div>
      </div>

      {/* Infinite Marquee Container */}
      <div className="relative flex overflow-x-hidden py-4">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{
            x: ['0%', '-33.33%'],
          }}
          transition={{
            duration: 40,
            ease: 'linear',
            repeat: Infinity,
          }}
        >
          {marqueeLanguages.map((lang, i) => {
            const flagImage = PlaceHolderImages.find((img) => img.id === lang.flagId);

            return (
              <div key={`${lang.name}-${i}`} className="mx-4">
                <Card className="w-64 bg-white/[0.02] backdrop-blur-md border-white/5 hover:border-primary/30 transition-all duration-500 group cursor-default shadow-2xl rounded-2xl overflow-hidden">
                  <CardContent className="p-6 flex items-center gap-4">
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
                      <h3 className="font-black text-white text-lg group-hover:text-primary transition-colors truncate">
                        {lang.name}
                      </h3>
                      <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-black opacity-40">
                        Neural Engine Active
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </motion.div>

        {/* Gradient Overlays for smooth fading edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-[#0B0B0F] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-[#0B0B0F] to-transparent z-10" />
      </div>
      
      <div className="mt-16 text-center">
         <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3">
           <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
           New regional voices added weekly
         </p>
      </div>
    </section>
  );
};

export default LanguagesSection;