
'use client';

import { motion } from 'framer-motion';
import { Globe, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const languages = [
  { name: 'Hindi', voices: '24 Voices', region: 'South Asia', male: true, female: true },
  { name: 'English (US)', voices: '120 Voices', region: 'Americas', male: true, female: true },
  { name: 'Telugu', voices: '18 Voices', region: 'South Asia', male: true, female: true },
  { name: 'Tamil', voices: '16 Voices', region: 'South Asia', male: true, female: true },
  { name: 'Spanish', voices: '45 Voices', region: 'Europe/LatAm', male: true, female: true },
  { name: 'Arabic', voices: '22 Voices', region: 'Middle East', male: true, female: true },
  { name: 'French', voices: '38 Voices', region: 'Europe', male: true, female: true },
  { name: 'German', voices: '32 Voices', region: 'Europe', male: true, female: true },
  { name: 'Japanese', voices: '28 Voices', region: 'East Asia', male: true, female: true },
];

const LanguagesSection = () => {
  return (
    <section className="py-24 bg-black/20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Supports Multiple Languages
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Create natural voices in major global and regional languages. Reach your audience in their native tongue.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {languages.map((lang, i) => (
            <motion.div
              key={lang.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white/5 border-white/10 hover:border-primary/50 transition-all duration-300 group cursor-default h-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <Globe className="h-5 w-5" />
                      </div>
                      <h3 className="font-bold text-white text-lg">{lang.name}</h3>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">{lang.region}</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Available Voices</span>
                      <span className="text-white font-medium">{lang.voices}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <div className="h-4 w-4 rounded-full bg-green-500/20 flex items-center justify-center">
                          <Check className="h-2.5 w-2.5 text-green-500" />
                        </div>
                        Male
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <div className="h-4 w-4 rounded-full bg-green-500/20 flex items-center justify-center">
                          <Check className="h-2.5 w-2.5 text-green-500" />
                        </div>
                        Female
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LanguagesSection;
