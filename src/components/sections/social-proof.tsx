
'use client';

import { motion } from 'framer-motion';

const logos = [
  'TechFlow', 'AudioSync', 'GameCraft', 'PixelArt', 'VoxMedia', 'CloudStudio'
];

const SocialProofSection = () => {
  return (
    <section className="py-20 border-t border-white/5">
      <div className="container mx-auto px-6 sm:px-10 lg:px-16">
        <p className="text-center text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground mb-12">
          Trusted by Innovative Creators and Studios
        </p>
        <div className="flex flex-wrap justify-center gap-12 lg:gap-24 items-center grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
           {logos.map((logo) => (
             <span key={logo} className="text-2xl font-black text-white italic">{logo}</span>
           ))}
        </div>
        
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              quote: "The voice quality is miles ahead of anything else we tested. Truly indistinguishable.",
              author: "Alex Rivera",
              role: "Creative Director at GameCraft"
            },
            {
              quote: "Saanchi AI has cut our audiobook production time by 80%. The Hindi voices are exceptionally natural.",
              author: "Priya Sharma",
              role: "Head of Content, VoxMedia"
            },
            {
              quote: "Developer-friendly API and instant scaling. Exactly what we needed for our accessibility tools.",
              author: "James Wilson",
              role: "CTO, TechFlow"
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="bg-white/5 p-8 rounded-2xl border border-white/10"
            >
              <p className="text-lg text-gray-300 mb-6 italic">"{item.quote}"</p>
              <div>
                <div className="font-bold text-white">{item.author}</div>
                <div className="text-xs text-primary font-bold uppercase tracking-wider">{item.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
