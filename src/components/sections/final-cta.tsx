'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Zap, Star } from 'lucide-react';

const FinalCTASection = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-card rounded-[3.5rem] p-10 sm:p-20 text-center relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-indigo-900/10 border-white/5 shadow-3d"
        >
          {/* Subtle Decorative Elements */}
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,102,0,0.1),transparent_50%)]" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full" />
          
          <div className="relative z-10 max-w-4xl mx-auto space-y-12">
            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-primary text-primary" />)}
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">The New Standard in Synthesis</p>
            </div>

            <h2 className="text-xl font-black tracking-tight text-white sm:text-7xl leading-tight">
              Scale Your Voice <br />
              <span className="text-primary">Without Limits.</span>
            </h2>
            
            <p className="text-[10px] sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
              Join thousands of creators using QuantisAI Labs for studio-quality batch audio. Get 10,000 characters free every month.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Button asChild size="lg" className="h-14 sm:h-16 rounded-[1.25rem] px-12 text-xs sm:text-xl font-black bg-primary btn-glow shadow-3d">
                <Link href="/sign-up">Start Free Account</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 sm:h-16 rounded-[1.25rem] px-12 text-xs sm:text-xl font-bold border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 shadow-3d">
                <a href="https://docs.quantisai.org/" target="_blank" rel="noopener noreferrer" className="flex items-center">
                  Developer Docs
                  <ArrowRight className="ml-3 h-5 w-5 sm:h-6 sm:w-6" />
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Extreme background glow */}
      <div className="absolute -bottom-96 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
    </section>
  );
};

export default FinalCTASection;