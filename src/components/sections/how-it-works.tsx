'use client';

import { motion } from 'framer-motion';
import { Edit3, Type, Zap, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  {
    icon: <Edit3 className="h-6 w-6" />,
    title: "Describe your voice",
    desc: "Use natural language to specify tone, age, accent, and emotional delivery.",
    color: "from-blue-500"
  },
  {
    icon: <Type className="h-6 w-6" />,
    title: "Enter your script",
    desc: "Type or paste the text you want the AI to speak. Supports 500+ languages.",
    color: "from-purple-500"
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Generate speech",
    desc: "Our neural engine builds the identity and synthesizes the audio in seconds.",
    color: "from-orange-500"
  },
  {
    icon: <Download className="h-6 w-6" />,
    title: "Download audio",
    desc: "Export high-fidelity 48kHz audio with full commercial usage rights.",
    color: "from-emerald-500"
  }
];

export default function HowItWorks() {
  return (
    <section className="py-24 relative overflow-hidden bg-transparent">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-20">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Identity Synthesis in <span className="text-primary">Seconds.</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto">
            Our streamlined workflow removes the technical barrier to high-end vocal production.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              {/* Connector line for desktop */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-white/10 to-transparent z-0 translate-x-4" />
              )}
              
              <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                <div className={cn(
                  "h-24 w-24 rounded-[2.5rem] bg-white/[0.03] border border-white/10 flex items-center justify-center transition-all duration-500 group-hover:border-primary/40 group-hover:scale-110 group-hover:bg-primary/5",
                )}>
                  <div className="text-primary">{step.icon}</div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">Step 0{i + 1}</div>
                  <h3 className="text-lg font-bold text-white">{step.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">
                    {step.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}