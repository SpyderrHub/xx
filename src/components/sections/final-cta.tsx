'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Star, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const FinalCTASection = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-6 sm:px-10 lg:px-16 relative z-10 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-[4rem] p-10 sm:p-24 relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-indigo-900/20 border-white/5 shadow-3d"
        >
          <div className="relative z-10 max-w-4xl mx-auto space-y-12">
            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-primary text-primary" />)}
              </div>
              <p className="text-[11px] font-black uppercase tracking-[0.5em] text-primary">Limited Beta Opportunity</p>
            </div>

            <h2 className="text-4xl font-black tracking-tighter text-white sm:text-7xl leading-tight">
              Start Designing <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Your Voice today.</span>
            </h2>
            
            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
              Join thousands of global creators and developers using QuantisAI Labs for studio-quality synthesis.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Button asChild size="lg" className="h-16 sm:h-20 rounded-[1.5rem] px-12 text-lg sm:text-xl font-black bg-primary btn-glow shadow-3d">
                <Link href="/sign-up">Create Free Account</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-16 sm:h-20 rounded-[1.5rem] px-12 text-lg sm:text-xl font-bold border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 shadow-3d">
                <a href="https://docs.quantisai.org/" target="_blank" rel="noopener noreferrer" className="flex items-center">
                  API Reference
                  <Zap className="ml-3 h-5 w-5 fill-current text-primary" />
                </a>
              </Button>
            </div>
            
            <p className="text-xs font-black uppercase tracking-widest text-white/20 pt-4">No credit card required to start free tier.</p>
          </div>
          
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
             <Star className="h-64 w-64 text-white" />
          </div>
        </motion.div>
      </div>
      
      {/* Background Decor */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-[500px] bg-primary/5 blur-[120px] rounded-[100%] -z-10" />
    </section>
  );
};

export default FinalCTASection;
