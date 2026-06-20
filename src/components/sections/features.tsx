'use client';

import { motion } from 'framer-motion';
import { Zap, Layers, BarChart3, Cloud } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const features = [
  {
    icon: <Layers className="h-7 w-7 text-primary" />,
    title: 'Batch Audio Engine',
    description: 'Process thousands of documents into high-quality narration simultaneously with zero bottleneck.',
  },
  {
    icon: <Zap className="h-7 w-7 text-primary" />,
    title: '2s Neural Latency',
    description: 'Average latency of ~2s globally. Ideal for interactive agents and real-time content delivery.',
  },
  {
    icon: <BarChart3 className="h-7 w-7 text-primary" />,
    title: 'Linear Scaling',
    description: 'Pay for what you use. No hidden fees, no enterprise taxes, and no minimum monthly spend.',
  },
  {
    icon: <Cloud className="h-7 w-7 text-primary" />,
    title: 'Edge Synthesis',
    description: 'Our neural models run on distributed edge infrastructure for reliable performance anywhere.',
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-32">
      <div className="container mx-auto px-6 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-3xl text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl font-black tracking-tight text-white sm:text-5xl leading-tight"
          >
            Built for High-Throughput <br />
            <span className="text-primary">Vocal Production.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-[10px] sm:text-lg text-muted-foreground leading-relaxed"
          >
            QuantisAI Labs is a developer-first platform designed to replace legacy TTS providers with unmatched speed and efficiency.
          </motion.p>
        </div>
        <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div 
              key={feature.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ 
                y: -10,
                rotateX: 5,
                rotateY: 2,
                boxShadow: "0 20px 40px rgba(255,102,0,0.1)"
              }}
              className="perspective-1000"
            >
              <Card className="glass-card border-white/5 bg-white/[0.02] hover:bg-white/[0.04] h-full rounded-[2.5rem] shadow-3d group transition-all duration-300">
                <CardHeader className="p-8">
                  <div className="mb-6 h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-primary/50 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-black text-white group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="pt-4 text-[10px] sm:text-sm text-muted-foreground leading-relaxed">
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
