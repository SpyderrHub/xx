'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, Zap, Check } from 'lucide-react';
import Link from 'next/link';

const ComparisonCard = () => (
  <div className="glass-card rounded-[2rem] p-8 space-y-6 relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4">
      <div className="bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-primary/30">
        Best Value
      </div>
    </div>
    
    <div>
      <h3 className="text-xl font-bold text-white mb-1">Pricing Comparison</h3>
      <p className="text-xs text-muted-foreground">Based on 600K Characters / Month</p>
    </div>

    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 font-bold text-xs">E</div>
          <span className="text-sm font-medium text-white/70">ElevenLabs</span>
        </div>
        <span className="text-sm font-bold text-white/50">₹9,179/mo</span>
      </div>
      
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold text-xs">A</div>
          <span className="text-sm font-medium text-white/70">Azure TTS</span>
        </div>
        <span className="text-sm font-bold text-white/50">₹4,200/mo</span>
      </div>

      <motion.div 
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="flex items-center justify-between p-5 rounded-2xl bg-primary/10 border-2 border-primary/50 shadow-[0_0_30px_rgba(255,102,0,0.2)]"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg">
            <Zap className="h-5 w-5 fill-current" />
          </div>
          <div>
            <span className="text-base font-black text-white">QuantisAI Labs</span>
            <p className="text-[10px] text-primary font-bold uppercase">Save 92%</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xl font-black text-white">₹799</span>
          <p className="text-[10px] text-muted-foreground">Estimated</p>
        </div>
      </motion.div>
    </div>

    <div className="pt-2">
      <ul className="space-y-2">
        {['Unlimited Clones', 'Batch Processing', 'No Watermarks'].map((feat) => (
          <li key={feat} className="flex items-center gap-2 text-xs text-muted-foreground">
            <Check className="h-3.5 w-3.5 text-primary" />
            {feat}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const HeroSection = () => {
  return (
    <section className="relative pt-24 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-start"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <Zap className="h-3.5 w-3.5 fill-current" />
              <span>Studio Quality AI Synthesis</span>
            </div>
            
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-8xl leading-[1.05] mb-8">
              Stop Paying <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-amber-400">
                Enterprise Prices.
              </span>
              <br />
              For Startup Audio.
            </h1>
            
            <p className="max-w-xl text-lg text-muted-foreground sm:text-xl leading-relaxed mb-12">
              QuantisAI Labs provides the most realistic AI text-to-speech platform designed for batch audio, ultra-low latency, and transparent pricing. 
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
              <Link href="/sign-up" className="w-full sm:w-auto">
                <Button size="lg" className="h-16 w-full rounded-2xl px-10 text-lg font-black bg-primary btn-glow">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/#voice-samples" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="h-16 w-full rounded-2xl px-10 text-lg font-bold border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10">
                    <Play className="mr-2 h-5 w-5 fill-current" />
                    Listen Demo
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative lg:ml-10"
          >
            <ComparisonCard />
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
