'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Zap } from 'lucide-react';

export default function ComparisonSlider() {
  const [chars, setChars] = useState(600000); // Characters per month

  // Based on user provided rates: 
  // ElevenLabs: ~₹9,179 for 600k chars (₹15.3 per 1k)
  // QuantisAI: ₹999 for 1M chars (₹1.0 per 1k)
  
  const elevenLabsPrice = (chars / 1000) * 15.3;
  const quantisaiPrice = (chars / 1000) * 1.0;
  const savings = ((elevenLabsPrice - quantisaiPrice) / elevenLabsPrice) * 100;

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 sm:px-10 lg:px-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl mb-6">
            Scale Without The Tax
          </h2>
          <p className="text-lg text-muted-foreground">
            Most platforms penalize you for growing. We reward you.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-12">
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <span className="text-sm font-black uppercase tracking-widest text-muted-foreground">Monthly Character Volume</span>
              <span className="text-3xl font-black text-white">{(chars / 1000).toLocaleString()}K <span className="text-lg text-muted-foreground">Chars / Month</span></span>
            </div>
            <Slider 
              value={[chars]}
              onValueChange={(v) => setChars(v[0])}
              min={10000}
              max={1000000}
              step={10000}
              className="h-12"
            />
            <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              <span>10K Characters</span>
              <span>1M Characters</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="glass-card border-white/5 bg-white/[0.02]">
              <CardContent className="p-8 space-y-4">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Traditional Platforms</span>
                <div className="text-4xl font-black text-white/40">₹{Math.round(elevenLabsPrice).toLocaleString()}</div>
                <p className="text-sm text-muted-foreground italic">Legacy volume pricing that isn't built for scale.</p>
              </CardContent>
            </Card>

            <Card className="glass-card border-primary/30 bg-primary/5 relative overflow-hidden ring-2 ring-primary/20">
              <div className="absolute top-0 right-0 p-4">
                <div className="bg-primary text-white text-[10px] font-black uppercase px-3 py-1 rounded-full">Save {Math.round(savings)}%</div>
              </div>
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary fill-current" />
                  <span className="text-xs font-bold text-primary uppercase tracking-widest">QuantisAI</span>
                </div>
                <div className="text-4xl font-black text-white">₹{Math.round(quantisaiPrice).toLocaleString()}</div>
                <p className="text-sm text-white/70">Pure synthesis. No markup. No enterprise tax.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
