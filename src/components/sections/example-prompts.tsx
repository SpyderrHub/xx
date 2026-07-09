'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Quote, Play, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const examples = [
  { 
    title: "Friendly Female", 
    prompt: "A cheerful, upbeat American female in her late 20s. She sounds like a helpful customer success agent, with clear enunciation and a friendly, welcoming smile in her voice.",
    color: "from-purple-500/20"
  },
  { 
    title: "Deep Narrator", 
    prompt: "A low-pitched, authoritative male voice with a slight British accent. Perfect for cinematic trailers or documentary narration. He speaks slowly with dramatic pauses.",
    color: "from-blue-500/20"
  },
  { 
    title: "Anime Hero", 
    prompt: "An energetic, high-spirited young male Japanese character. He sounds determined, slightly raspy, and full of emotion, as if he's giving a speech before a battle.",
    color: "from-red-500/20"
  },
  { 
    title: "Podcast Host", 
    prompt: "A relaxed, conversational male in his 40s. He sounds natural, with subtle filler breaths, occasional laughs, and a warm, reliable tone that builds trust with listeners.",
    color: "from-emerald-500/20"
  },
  { 
    title: "Meditation Guide", 
    prompt: "A soft, breathy female voice with a gentle, hypnotic pace. Every word is delivered calmly, with long silences and a soothing quality that induces relaxation.",
    color: "from-indigo-500/20"
  },
  { 
    title: "News Presenter", 
    prompt: "A professional, neutral Indian male voice. He speaks with perfect Hindi-English code-switching, a steady rhythm, and the sharp clarity of a broadcast news anchor.",
    color: "from-amber-500/20"
  },
];

export default function ExamplePrompts() {
  return (
    <section className="py-24 bg-[#0B0B0F]">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div className="max-w-2xl space-y-4">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest">
               <Sparkles className="h-3 w-3" />
               <span>Character Archetypes</span>
             </div>
             <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl leading-tight">
               Built for Every <span className="text-primary">Vocal Persona.</span>
             </h2>
             <p className="text-muted-foreground text-sm sm:text-lg">
               Browse example descriptions used to generate our most popular studio voices. 
             </p>
          </div>
          <div className="hidden md:block">
             <div className="h-10 w-1 bg-primary/20 rounded-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {examples.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-white/[0.02] border-white/5 hover:border-primary/40 transition-all duration-500 rounded-[2rem] overflow-hidden group">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-black text-white uppercase tracking-widest">{item.title}</h3>
                    <div className={cn("h-2 w-2 rounded-full animate-pulse bg-gradient-to-r", item.color)} />
                  </div>
                  <div className="relative">
                    <Quote className="absolute -top-4 -left-4 h-12 w-12 text-white/5 -z-10" />
                    <p className="text-sm text-muted-foreground leading-relaxed italic line-clamp-4">
                      "{item.prompt}"
                    </p>
                  </div>
                  <div className="pt-4 flex items-center justify-between border-t border-white/5">
                    <div className="flex items-center gap-2">
                       <Play className="h-3 w-3 text-primary fill-current" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-primary">Preview Archetype</span>
                    </div>
                    <span className="text-[9px] font-mono text-white/20 uppercase tracking-tighter">Neural v2.1</span>
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
