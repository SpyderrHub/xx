'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, Zap, Check, Sparkles } from 'lucide-react';
import Link from 'next/link';

const ComparisonCard = () => (
  <motion.div 
    initial={{ rotateY: 15, rotateX: 10, y: 0 }}
    animate={{ 
      rotateY: [15, 5, 15], 
      rotateX: [10, 0, 10],
      y: [0, -20, 0] 
    }}
    transition={{ 
      duration: 6, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }}
    className="glass-card rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden group shadow-3d border-white/5 backdrop-blur-3xl"
  >
    <div className="absolute top-0 right-0 p-4">
      <motion.div 
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-primary/30"
      >
        Best Value
      </motion.div>
    </div>
    
    <div>
      <h3 className="text-xl font-bold text-white mb-1">Pricing Comparison</h3>
      <p className="text-xs text-muted-foreground">Based on 600K Characters / Month</p>
    </div>

    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 shadow-inner">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 font-bold text-xs border border-red-500/20">E</div>
          <span className="text-sm font-medium text-white/70">ElevenLabs</span>
        </div>
        <span className="text-sm font-bold text-white/50">₹9,179/mo</span>
      </div>
      
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 shadow-inner">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold text-xs border border-blue-500/20">A</div>
          <span className="text-sm font-medium text-white/70">Azure TTS</span>
        </div>
        <span className="text-sm font-bold text-white/50">₹4,200/mo</span>
      </div>

      <motion.div 
        whileHover={{ scale: 1.05, rotateY: -5 }}
        className="flex items-center justify-between p-6 rounded-3xl bg-primary/10 border-2 border-primary/40 shadow-[0_20px_60px_rgba(255,102,0,0.2)] relative group cursor-pointer"
      >
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
        <div className="flex items-center gap-3 relative z-10">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
            <Zap className="h-5 w-5 fill-current animate-pulse" />
          </div>
          <div>
            <span className="text-base font-black text-white">QuantisAI Labs</span>
            <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Save 92%</p>
          </div>
        </div>
        <div className="text-right relative z-10">
          <span className="text-2xl font-black text-white">₹799</span>
          <p className="text-[10px] text-muted-foreground uppercase font-bold">Estimated</p>
        </div>
      </motion.div>
    </div>

    <div className="pt-2 grid grid-cols-2 gap-2">
      {['Unlimited Clones', 'Batch Processing', 'No Watermarks', 'API Access'].map((feat) => (
        <div key={feat} className="flex items-center gap-2 text-[10px] font-bold text-white/60">
          <Check className="h-3 w-3 text-primary shrink-0" />
          <span className="truncate">{feat}</span>
        </div>
      ))}
    </div>
  </motion.div>
);

const HeroSection = () => {
  return (
    <section className="relative pt-24 pb-20 lg:pt-48 lg:pb-40 overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-start"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary text-[7px] sm:text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-3d backdrop-blur-md"
            >
              <Sparkles className="h-3.5 w-3.5 fill-current animate-pulse" />
              <span>Studio Quality AI Synthesis</span>
            </motion.div>
            
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-white sm:text-6xl lg:text-8xl lg:leading-[1.1] mb-8">
              Stop Paying <br />
              <motion.span 
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-amber-400 bg-[length:200%_200%]"
              >
                Enterprise Prices.
              </motion.span>
              <br />
              For Startup Audio.
            </h1>
            
            <p className="max-w-xl text-[10px] sm:text-sm text-muted-foreground sm:text-xl leading-relaxed mb-12">
              QuantisAI Labs provides the most realistic AI text-to-speech platform designed for batch audio, ultra-low latency, and transparent pricing. 
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
              <Link href="/sign-up" className="w-full sm:w-auto">
                <Button size="lg" className="h-12 sm:h-16 w-full rounded-2xl px-10 text-[10px] sm:text-lg font-black bg-primary btn-glow shadow-3d hover:scale-105 transition-transform">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/#voice-samples" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="h-12 sm:h-16 w-full rounded-2xl px-10 text-[10px] sm:text-lg font-bold border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 shadow-3d transition-all">
                    <Play className="mr-2 h-5 w-5 fill-current" />
                    Listen Demo
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative lg:ml-10 perspective-1000"
          >
            <ComparisonCard />
            
            {/* Background Neural Orbs with subtle breath motion */}
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 blur-[100px] rounded-full" 
            />
            <motion.div 
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full" 
            />
          </motion.div>
        </div>
      </div>

      {/* Decorative perspective lines */}
      <div className="absolute inset-0 -z-10 opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent)]">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        <div className="h-full w-full bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem] [transform:perspective(1000px)_rotateX(60deg)_translateY(-100px)]" />
      </div>
    </section>
  );
};

export default HeroSection;
