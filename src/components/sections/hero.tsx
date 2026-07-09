'use client';

import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-40 overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-black uppercase tracking-[0.2em] mb-10 shadow-3d backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 fill-current" />
            <span>The Future of Speech Synthesis</span>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl lg:leading-[1.15] mb-10 max-w-5xl">
            Design the <span className="text-primary">Perfect Voice.</span> <br />
            Just by Describing It.
          </h1>
          
          <p className="max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed mb-14 font-medium opacity-80">
            Generate ultra-realistic AI voices using natural language prompts. Perfect for creators, developers, and global businesses.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center w-full sm:w-auto">
            <Button asChild size="lg" className="h-14 sm:h-16 rounded-2xl px-12 text-base sm:text-lg font-black bg-primary btn-glow shadow-3d">
              <Link href="/sign-up">Start Generating Free</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 sm:h-16 rounded-2xl px-12 text-base sm:text-lg font-bold border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 shadow-3d">
              <Link href="#tts-demo">
                Explore Studio
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-20 opacity-30">
             {['Native Accents', 'Low Latency', 'Commercial Rights', 'API First'].map((item) => (
               <div key={item} className="flex items-center gap-2 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-white">
                 <div className="h-1 w-1 rounded-full bg-primary" />
                 {item}
               </div>
             ))}
          </div>
        </motion.div>
      </div>

      {/* Sophisticated Background Grid */}
      <div className="absolute inset-0 -z-10 opacity-[0.03] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]">
        <div className="h-full w-full bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem] [transform:perspective(1000px)_rotateX(60deg)_translateY(-100px)]" />
      </div>
      
      {/* Refined Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/5 blur-[140px] rounded-full -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full -z-10" />
    </section>
  );
};

export default HeroSection;
