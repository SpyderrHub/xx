'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

const CHARACTERS = [
  { id: 'turtle', name: 'Turtle Guru', initials: 'TG' },
  { id: 'tea', name: 'Aunt Tea', initials: 'AT' },
  { id: 'sitcom', name: 'Sitcom Guy', initials: 'SG' },
];

const INSTRUCTIONS = [
  "Speak with a sarcastic tone",
  "Whisper this like a secret",
  "Deliver with high energy",
  "Sound calm and meditative",
];

export default function ActingInstructionsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeChar, setActiveChar] = useState('turtle');

  const nextInstruction = () => setActiveIndex((prev) => (prev + 1) % INSTRUCTIONS.length);
  const prevInstruction = () => setActiveIndex((prev) => (prev - 1 + INSTRUCTIONS.length) % INSTRUCTIONS.length);

  return (
    <section className="w-full bg-[#0B0B0F] py-20 lg:py-40 overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Panel: Interactive Demo */}
          <div className="space-y-10">
            <div className="relative bg-white/[0.02] border border-white/5 rounded-[32px] p-10 md:p-20 flex flex-col items-center justify-center min-h-[450px] md:min-h-[550px] shadow-2xl backdrop-blur-sm">
              
              {/* Stacked Carousel */}
              <div className="relative w-full max-w-[320px] h-[240px] flex items-center justify-center">
                <AnimatePresence mode="popLayout">
                  {[2, 1, 0].map((offset) => {
                    const index = (activeIndex + offset) % INSTRUCTIONS.length;
                    const isActive = offset === 0;
                    
                    return (
                      <motion.div
                        key={index}
                        initial={false}
                        animate={{
                          scale: isActive ? 1 : 1 - offset * 0.08,
                          y: offset * -15,
                          z: -offset * 50,
                          opacity: isActive ? 1 : 0.2 - offset * 0.05,
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        style={{ zIndex: 10 - offset }}
                        className={cn(
                          "absolute inset-0 rounded-[24px] flex flex-col items-center justify-center p-8 text-center shadow-2xl backdrop-blur-md border",
                          isActive 
                            ? "bg-[#DCD0E8] text-[#1F1F1F] border-white/40" 
                            : "bg-white/10 border-white/5"
                        )}
                      >
                        <p className={cn(
                          "text-xl md:text-2xl font-black leading-tight tracking-tight",
                          !isActive && "blur-[2px] text-white"
                        )}>
                          "{INSTRUCTIONS[index]}"
                        </p>
                        
                        {isActive && (
                          <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute bottom-6 h-12 w-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
                          >
                            <Play className="h-5 w-5 fill-current ml-1" />
                          </motion.button>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Navigation Arrows */}
                <button 
                  onClick={prevInstruction}
                  className="absolute -left-12 md:-left-16 top-1/2 -translate-y-1/2 p-3 text-white/20 hover:text-white transition-colors"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button 
                  onClick={nextInstruction}
                  className="absolute -right-12 md:-right-16 top-1/2 -translate-y-1/2 p-3 text-white/20 hover:text-white transition-colors"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              </div>

              {/* Character Pills */}
              <div className="mt-16 flex flex-wrap justify-center gap-3">
                {CHARACTERS.map((char) => (
                  <button
                    key={char.id}
                    onClick={() => setActiveChar(char.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 border",
                      activeChar === char.id 
                        ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.1)]" 
                        : "bg-white/5 text-white/40 border-white/5 hover:bg-white/10"
                    )}
                  >
                    <div className={cn(
                      "h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black",
                      activeChar === char.id ? "bg-black text-white" : "bg-white/10"
                    )}>
                      {char.initials}
                    </div>
                    {char.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Description */}
          <div className="max-w-[500px] space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
              <span>Directorial Control</span>
            </div>
            <h2 className="text-[40px] md:text-[64px] font-black text-white leading-[1.05] tracking-tight">
              Acting <br />
              <span className="text-primary">instructions</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium">
              Direct the emotional delivery of every line. Specify tone, pacing, emphasis, and mood with natural language instructions.
            </p>
            <ul className="space-y-4 pt-4">
               {['Custom Emotional States', 'Whisper & Shout Modes', 'Variable Pacing Control'].map((item) => (
                 <li key={item} className="flex items-center gap-3 text-sm font-bold text-white/80">
                   <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                   {item}
                 </li>
               ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
