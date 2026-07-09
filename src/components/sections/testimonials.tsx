'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Quote, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const reviews = [
  {
    name: "Arjun Mehta",
    role: "Content Creator, 2M+ subs",
    content: "The ability to describe a voice and have it ready in seconds has transformed our production. The Hindi accents are remarkably natural.",
    avatar: "https://picsum.photos/seed/arjun/100/100"
  },
  {
    name: "Sarah Jenkins",
    role: "Game Developer, PixelForge",
    content: "We use the API for dynamic NPC dialogue. The latency is practically non-existent, and the character consistency is unmatched.",
    avatar: "https://picsum.photos/seed/sarah/100/100"
  },
  {
    name: "Vikram Shah",
    role: "Head of Marketing, EduStream",
    content: "Switching from ElevenLabs to QuantisAI Labs saved us thousands. The quality is identical, but the batch processing is way faster.",
    avatar: "https://picsum.photos/seed/vikram/100/100"
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
            <Star className="h-3 w-3 fill-current" />
            <span>Trusted by 10k+ Creators</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
            The New Standard.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, i) => (
            <motion.div
              key={rev.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-white/[0.02] border-white/5 rounded-[2.5rem] p-8 shadow-3d group hover:border-primary/30 transition-all">
                <CardContent className="p-0 flex flex-col h-full space-y-6">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-primary text-primary" />)}
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed italic flex-1">
                    "{rev.content}"
                  </p>
                  <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                    <Avatar className="h-10 w-10 border border-white/10">
                      <AvatarImage src={rev.avatar} unoptimized />
                      <AvatarFallback>{rev.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                       <h4 className="text-sm font-bold text-white">{rev.name}</h4>
                       <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{rev.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
