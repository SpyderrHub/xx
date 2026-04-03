
'use client';

import { BookOpen, Rocket, Zap, Code2, Sparkles, Mic2 } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

const quickLinks = [
  { title: 'Quick Start', desc: 'Get up and running in 5 minutes.', icon: Rocket, href: '/docs/quick-start' },
  { title: 'Voice Library', desc: 'Explore the full list of available voices.', icon: Mic2, href: '/docs/voice-library' },
  { title: 'API Reference', desc: 'Integrate QuantisAI into your own apps.', icon: Code2, href: '/docs/api-reference' },
];

export default function DocsIndexPage() {
  return (
    <div className="space-y-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6">Documentation</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Welcome to the QuantisAI documentation. Here you'll find comprehensive guides and resources to help you generate high-quality AI speech and manage your audio content.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickLinks.map((link, i) => (
          <Link key={link.title} href={link.href}>
            <Card className="h-full bg-white/[0.03] border-white/5 hover:border-primary/30 transition-all group cursor-pointer shadow-none">
              <CardContent className="p-6">
                <link.icon className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg mb-2">{link.title}</h3>
                <p className="text-sm text-muted-foreground">{link.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold border-b border-white/5 pb-4">Key Features</h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <Zap className="h-6 w-6 text-amber-400 shrink-0" />
            <div>
              <h4 className="font-bold mb-1">Ultra-Realistic Speech</h4>
              <p className="text-sm text-muted-foreground">Learn how our neural models capture human nuances like breathing, emotion, and natural pauses.</p>
            </div>
          </div>
          <div className="flex gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <Sparkles className="h-6 w-6 text-purple-400 shrink-0" />
            <div>
              <h4 className="font-bold mb-1">Voice Customization</h4>
              <p className="text-sm text-muted-foreground">Adjust pitch, speed, and stability to craft the perfect vocal output for your project.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
