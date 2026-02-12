
'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, Mic, Waves, ArrowRight, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const HeroSection = () => {
  const [waveHeights, setWaveHeights] = useState<number[]>([]);

  useEffect(() => {
    // Generate random heights only on the client to avoid hydration mismatch
    setWaveHeights(Array.from({ length: 24 }, () => Math.random() * 80 + 20));
  }, []);

  return (
    <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-48">
      {/* Background Neural Glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 blur-[120px] rounded-full opacity-50" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-start text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6">
              <Zap className="h-3.5 w-3.5" />
              <span>The Next Generation of AI Voice Technology</span>
            </div>
            <h1 className="font-headline text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.1]">
              Generate Real Human <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-indigo-400">
                AI Voices in Seconds
              </span>
            </h1>
            <p className="mt-8 max-w-xl text-lg text-muted-foreground sm:text-xl leading-relaxed">
              Experience ultra-realistic, multi-language AI voices for apps, videos, games, call centers, and automation. Studio quality at scale.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button asChild size="lg" className="h-14 rounded-xl px-8 text-lg font-bold bg-primary shadow-lg shadow-primary/20">
                <Link href="/sign-up">Start Free Trial</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 rounded-xl px-8 text-lg border-white/10 bg-white/5 backdrop-blur-sm">
                <Link href="#voice-demo">
                  <Play className="mr-2 h-5 w-5 fill-current" />
                  Listen Demo Voices
                </Link>
              </Button>
            </div>
            
            <div className="mt-12 flex items-center gap-8 opacity-60">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">40+</span>
                <span className="text-xs uppercase tracking-widest text-muted-foreground">Languages</span>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">500+</span>
                <span className="text-xs uppercase tracking-widest text-muted-foreground">Premium Voices</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            {/* Product UI Mockup */}
            <div className="relative z-10 rounded-2xl border border-white/10 bg-black/40 p-2 shadow-2xl backdrop-blur-xl">
              <div className="rounded-xl bg-gray-900 overflow-hidden border border-white/5">
                <div className="bg-white/5 p-4 border-b border-white/5 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500/50" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                    <div className="h-3 w-3 rounded-full bg-green-500/50" />
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono">Saanchi Studio Pro v2.4</div>
                </div>
                <div className="p-6 space-y-6">
                  <div className="h-32 rounded-lg bg-white/5 border border-white/5 p-4 relative overflow-hidden">
                    <div className="text-xs text-primary/70 mb-2">Text Input</div>
                    <div className="text-sm text-gray-400">Welcome to Saanchi AI. Experience the future of voice...</div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/20" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-20 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center flex-col gap-1">
                      <Mic className="h-4 w-4 text-primary" />
                      <span className="text-[10px] text-muted-foreground">Aria (Female)</span>
                    </div>
                    <div className="h-20 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center flex-col gap-1">
                      <Waves className="h-4 w-4 text-indigo-400" />
                      <span className="text-[10px] text-muted-foreground">Dynamic Waveform</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-primary/10 p-3 rounded-xl border border-primary/20">
                    <Button size="icon" className="h-10 w-10 rounded-full bg-primary">
                      <Play className="h-5 w-5 fill-current ml-0.5" />
                    </Button>
                    <div className="flex-1 h-6 flex items-center gap-1 justify-center">
                       {waveHeights.map((height, i) => (
                         <div 
                          key={i} 
                          className="w-1 bg-primary/40 rounded-full" 
                          style={{ height: `${height}%` }}
                         />
                       ))}
                       {waveHeights.length === 0 && Array.from({ length: 24 }).map((_, i) => (
                         <div key={i} className="w-1 bg-primary/40 rounded-full h-[50%]" />
                       ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 z-20 bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl hidden md:block"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Fast Rendering</div>
                  <div className="text-[10px] text-muted-foreground">0.2s Latency</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
