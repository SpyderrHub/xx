'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const languages = [
  { name: 'Hindi', flagId: 'flag-hindi' },
  { name: 'English (US)', flagId: 'flag-english-us' },
  { name: 'Telugu', flagId: 'flag-telugu' },
  { name: 'Tamil', flagId: 'flag-tamil' },
  { name: 'Spanish', flagId: 'flag-spanish' },
  { name: 'Arabic', flagId: 'flag-arabic' },
  { name: 'French', flagId: 'flag-french' },
  { name: 'German', flagId: 'flag-german' },
  { name: 'Japanese', flagId: 'flag-japanese' },
];

// Double the languages array for a seamless loop
const marqueeLanguages = [...languages, ...languages];

const LanguagesSection = () => {
  return (
    <section className="py-24 bg-black/20 relative overflow-hidden">
      <div className="container mx-auto px-6 sm:px-10 lg:px-16 mb-16">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Global Language Support
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Speak to your audience in their native tongue with studio-quality voices in 40+ languages.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Infinite Marquee Container */}
      <div className="relative flex overflow-x-hidden py-10">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{
            x: ['0%', '-50%'],
          }}
          transition={{
            duration: 30,
            ease: 'linear',
            repeat: Infinity,
          }}
        >
          {marqueeLanguages.map((lang, i) => {
            const flagImage = PlaceHolderImages.find((img) => img.id === lang.flagId);

            return (
              <div key={`${lang.name}-${i}`} className="mx-4">
                <Card className="w-64 bg-white/5 backdrop-blur-md border-white/10 hover:border-primary/50 transition-all duration-300 group cursor-default">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="relative h-10 w-14 overflow-hidden rounded-md border border-white/10 shadow-lg">
                      {flagImage ? (
                        <Image
                          src={flagImage.imageUrl}
                          alt={lang.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          data-ai-hint={flagImage.imageHint}
                        />
                      ) : (
                        <div className="h-full w-full bg-primary/10" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg group-hover:text-primary transition-colors">
                        {lang.name}
                      </h3>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                        Ready to Use
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </motion.div>

        {/* Gradient Overlays for smooth fading edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
      </div>
      
      <div className="mt-16 text-center">
         <p className="text-sm text-muted-foreground font-medium flex items-center justify-center gap-2">
           <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
           New regional dialects added every month
         </p>
      </div>
    </section>
  );
};

export default LanguagesSection;
