'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';

const FinalCTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 sm:px-10 lg:px-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-[3rem] p-12 lg:p-24 text-center relative overflow-hidden bg-gradient-to-br from-primary/20 to-indigo-900/20 border-white/10"
        >
          {/* Decorative Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-10">
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-7xl leading-tight">
              Stop Overpaying. <br />
              <span className="text-primary">Start Saving.</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Join the new generation of batch synthesis. Get 10,000 characters free every month. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild size="lg" className="h-16 rounded-2xl px-12 text-xl font-black bg-primary btn-glow">
                <Link href="/sign-up">Get Started For Free</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-16 rounded-2xl px-12 text-xl font-bold border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10">
                <a href="https://docs.quantisai.org/" target="_blank" rel="noopener noreferrer" className="flex items-center">
                  Documentation
                  <ArrowRight className="ml-2 h-6 w-6" />
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTASection;