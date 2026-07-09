'use client';

import { Zap, Layers, BarChart3, Cloud } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <Layers className="h-6 w-6 text-primary" />,
    title: 'Batch Audio Engine',
    description: 'Process thousands of documents into high-quality narration simultaneously with zero bottleneck.',
  },
  {
    icon: <Zap className="h-6 w-6 text-primary" />,
    title: '2s Neural Latency',
    description: 'Average latency of ~2s globally. Ideal for interactive agents and real-time content delivery.',
  },
  {
    icon: <BarChart3 className="h-6 w-6 text-primary" />,
    title: 'Linear Scaling',
    description: 'Pay for what you use. No hidden fees, no enterprise taxes, and no minimum monthly spend.',
  },
  {
    icon: <Cloud className="h-6 w-6 text-primary" />,
    title: 'Edge Synthesis',
    description: 'Our neural models run on distributed edge infrastructure for reliable performance anywhere.',
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="mx-auto max-w-3xl text-center mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest">
            <span>Capabilities</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl leading-tight">
            Built for High-Throughput <br />
            <span className="text-primary">Vocal Production.</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed opacity-80">
            QuantisAI Labs is a developer-first platform designed to replace legacy TTS providers with unmatched speed and efficiency.
          </p>
        </div>
        
        <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="glass-card border-white/5 bg-white/[0.01] hover:bg-white/[0.03] h-full rounded-[2.5rem] shadow-3d transition-all duration-500 group">
                <CardHeader className="p-8 sm:p-10">
                  <div className="mb-8 h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/5 transition-all duration-500">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-black text-white tracking-tight">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="pt-4 text-sm text-muted-foreground leading-relaxed font-medium">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
