
'use client';

import { motion } from 'framer-motion';
import { Laptop, Smartphone, Gamepad2, Headphones, Video, Code2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const platforms = [
  {
    icon: <Laptop className="h-6 w-6" />,
    title: 'Web Apps',
    description: 'Embed natural narration directly inside your websites and SaaS platforms.'
  },
  {
    icon: <Smartphone className="h-6 w-6" />,
    title: 'Mobile Apps',
    description: 'High-performance Android & iOS integration ready for instant interaction.'
  },
  {
    icon: <Gamepad2 className="h-6 w-6" />,
    title: 'Games',
    description: 'Real-time NPC voice generation with low latency for immersive worlds.'
  },
  {
    icon: <Headphones className="h-6 w-6" />,
    title: 'Call Center / IVR',
    description: 'Automate customer support with voices that sound indistinguishable from humans.'
  },
  {
    icon: <Video className="h-6 w-6" />,
    title: 'Content Creation',
    description: 'Ideal for YouTube, Podcasts, Reels, and high-fidelity Audiobooks.'
  },
  {
    icon: <Code2 className="h-6 w-6" />,
    title: 'API Integration',
    description: 'Developer-friendly REST API to scale your voice needs programmatically.'
  }
];

const PlatformsSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Use AI Voices Anywhere
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Saanchi AI provides the flexibility to integrate high-quality speech into any hardware or software platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {platforms.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gradient-to-br from-white/5 to-transparent border-white/5 hover:border-primary/30 transition-all duration-500 h-full relative group">
                <CardContent className="p-8">
                  <div className="mb-6 p-3 rounded-2xl bg-white/5 w-fit group-hover:bg-primary/20 transition-colors text-primary group-hover:text-primary-foreground">
                    {p.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{p.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {p.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformsSection;
