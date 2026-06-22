
'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, TrendingDown } from 'lucide-react';

export default function ComparisonSlider() {
  const [chars, setChars] = useState(600000);

  const elevenLabsPrice = (chars / 1000) * 15.3;
  const quantisaiPrice = (chars / 1000) * 1.0;
  const savings = ((elevenLabsPrice - quantisaiPrice) / elevenLabsPrice) * 100;

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-6 sm:px-10 lg:px-16">
        <div className="max-w-4xl mx-auto text-center mb-20">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-[0.2em] mb-4">
            <TrendingDown className="h-3 w-3" />
            <span>Economic Transparency</span>
          </div>
          <h2 className="text-xl font-black tracking-tight text-white sm:text-6xl mb-6">
            Global Scale. <br /><span className="text-primary">Fractional Cost.</span>
          </h2>
          <p className="text-[10px] text-muted-foreground sm:text-lg max-w-2xl mx-auto">
            Traditional platforms penalize growth with massive markups. We reward it with pure synthesis rates.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-12">
          <div className="space-y-8 glass-card p-10 rounded-[3rem] shadow-3d border-white/5">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Volume Calculator</span>
                <p className="text-xs sm:text-sm font-bold text-muted-foreground">Adjust monthly character volume</p>
              </div>
              <div className="text-right">
                <span className="text-2xl sm:text-5xl font-black text-white tracking-tighter">{(chars / 1000).toLocaleString()}K</span>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Chars / Month</p>
              </div>
            </div>
            
            <Slider 
              value={[chars]}
              onValueChange={(v) => setChars(v[0])}
              min={10000}
              max={1000000}
              step={10000}
              className="h-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            <div>
              <Card className="glass-card border-white/5 bg-white/[0.01] h-full rounded-[2.5rem] shadow-3d">
                <CardContent className="p-10 space-y-6">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Market Standard</span>
                  <div className="text-3xl sm:text-5xl font-black text-white/30 tracking-tighter">₹{Math.round(elevenLabsPrice).toLocaleString()}</div>
                  <p className="text-[10px] sm:text-sm text-muted-foreground leading-relaxed italic">Legacy pricing built on corporate markups and enterprise taxes.</p>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="glass-card border-primary/30 bg-primary/5 h-full rounded-[2.5rem] relative overflow-hidden ring-1 ring-primary/20 shadow-[0_30px_60px_rgba(255,102,0,0.15)]">
                <div className="absolute top-0 right-0 p-6">
                  <div className="bg-primary text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-primary/30">Save {Math.round(savings)}%</div>
                </div>
                <CardContent className="p-10 space-y-6">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary fill-current" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">QuantisAI Labs</span>
                  </div>
                  <div className="text-3xl sm:text-5xl font-black text-white tracking-tighter">₹{Math.round(quantisaiPrice).toLocaleString()}</div>
                  <p className="text-[10px] sm:text-sm text-white/70 leading-relaxed font-medium">Pure neural synthesis. No enterprise tax. Transparent and scalable.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
