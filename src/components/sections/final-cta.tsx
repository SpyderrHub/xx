
'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';

const FinalCTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-primary/5" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-primary to-indigo-900 rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl shadow-primary/20"
        >
          {/* Decorative Glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 blur-[100px] rounded-full" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-8">
              Start Creating AI Voices Today
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-12">
              Join thousands of developers and creators building the future of audio content with Bhoomi AI. No credit card required to start.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild size="lg" className="h-16 rounded-2xl px-10 text-xl font-bold bg-white text-primary hover:bg-gray-100 transition-transform hover:scale-105 active:scale-95">
                <Link href="/sign-up">Start Free Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-16 rounded-2xl px-10 text-xl font-bold border-white/20 bg-black/10 text-white backdrop-blur-md hover:bg-black/20 transition-transform hover:scale-105 active:scale-95">
                <Link href="#pricing">
                  View Pricing
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="mt-16 flex justify-center items-center gap-12 text-white/60">
             <div className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                <span className="text-sm font-bold uppercase tracking-widest">Instant Setup</span>
             </div>
             <div className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                <span className="text-sm font-bold uppercase tracking-widest">99.9% Uptime</span>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTASection;
