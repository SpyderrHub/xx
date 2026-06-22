
'use client';

import { Button } from '@/components/ui/button';
import { Play, Zap, Check, Sparkles } from 'lucide-react';
import Link from 'next/link';

const ComparisonCard = () => (
  <div className="glass-card rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 space-y-4 sm:space-y-6 relative overflow-hidden shadow-3d border-white/5 backdrop-blur-3xl">
    <div className="absolute top-0 right-0 p-3 sm:p-4">
      <div className="bg-primary/20 text-primary text-[8px] sm:text-[10px] font-black uppercase tracking-widest px-2 sm:px-3 py-1 rounded-full border border-primary/30">
        Best Value
      </div>
    </div>
    
    <div>
      <h3 className="text-lg sm:text-xl font-bold text-white mb-1">Pricing Comparison</h3>
      <p className="text-[10px] sm:text-xs text-muted-foreground">Based on 600K Chars / Month</p>
    </div>

    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/5 shadow-inner">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 font-bold text-[10px] border border-red-500/20">E</div>
          <span className="text-xs sm:text-sm font-medium text-white/70">ElevenLabs</span>
        </div>
        <span className="text-xs sm:text-sm font-bold text-white/50">₹9,179/mo</span>
      </div>
      
      <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/5 shadow-inner">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold text-[10px] border border-red-500/20">A</div>
          <span className="text-xs sm:text-sm font-medium text-white/70">Azure TTS</span>
        </div>
        <span className="text-xs sm:text-sm font-bold text-white/50">₹4,200/mo</span>
      </div>

      <div className="flex items-center justify-between p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-primary/10 border-2 border-primary/40 shadow-[0_20px_60px_rgba(255,102,0,0.2)] relative group">
        <div className="flex items-center gap-2 sm:gap-3 relative z-10">
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
            <Zap className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
          </div>
          <div>
            <span className="text-sm sm:text-base font-black text-white">QuantisAI Labs</span>
            <p className="text-[8px] sm:text-[10px] text-primary font-bold uppercase tracking-widest">Save 92%</p>
          </div>
        </div>
        <div className="text-right relative z-10">
          <span className="text-xl sm:text-2xl font-black text-white">₹799</span>
        </div>
      </div>
    </div>

    <div className="pt-2 grid grid-cols-2 gap-2">
      {['Unlimited Clones', 'Batch Processing', 'No Watermarks', 'API Access'].map((feat) => (
        <div key={feat} className="flex items-center gap-1.5 sm:gap-2 text-[8px] sm:text-[10px] font-bold text-white/60">
          <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-primary shrink-0" />
          <span className="truncate">{feat}</span>
        </div>
      ))}
    </div>
  </div>
);

const HeroSection = () => {
  return (
    <section className="relative pt-24 pb-20 lg:pt-48 lg:pb-40 overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary text-[7px] sm:text-[10px] font-black uppercase tracking-[0.2em] mb-6 sm:mb-8 shadow-3d backdrop-blur-md">
              <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-current" />
              <span>Studio Quality AI Synthesis</span>
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-8xl lg:leading-[1.1] mb-6 sm:mb-8">
              Stop Paying <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-amber-400">
                Enterprise Prices.
              </span>
              <br />
              For Startup Audio.
            </h1>
            
            <p className="max-w-xl text-sm sm:text-lg lg:text-xl text-muted-foreground leading-relaxed mb-10 sm:mb-12">
              QuantisAI Labs provides the most realistic AI text-to-speech platform designed for batch audio, ultra-low latency, and transparent pricing. 
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 w-full sm:w-auto">
              <Link href="/sign-up" className="w-full sm:w-auto">
                <Button size="lg" className="h-12 sm:h-16 w-full rounded-2xl px-8 sm:px-10 text-sm sm:text-lg font-black bg-primary btn-glow shadow-3d">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/#voice-samples" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="h-12 sm:h-16 w-full rounded-2xl px-8 sm:px-10 text-sm sm:text-lg font-bold border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 shadow-3d transition-all">
                    <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5 fill-current" />
                    Listen Demo
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative lg:ml-10 hidden sm:block">
            <ComparisonCard />
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 blur-[100px] rounded-full opacity-20" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-600/5 blur-[100px] rounded-full opacity-10" />
          </div>
        </div>
      </div>

      <div className="absolute inset-0 -z-10 opacity-10 [mask-image:radial-gradient(ellipse_at_center,black,transparent)]">
        <div className="h-full w-full bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem] [transform:perspective(1000px)_rotateX(60deg)_translateY(-100px)]" />
      </div>
    </section>
  );
};

export default HeroSection;
