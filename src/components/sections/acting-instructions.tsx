'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, UserCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
    <section className="w-full bg-[#F7F7F2] py-20 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Panel: Interactive Demo */}
          <div className="space-y-10">
            <div className="relative bg-[#EBEBEB] rounded-[32px] p-10 md:p-20 flex flex-col items-center justify-center min-h-[450px] md:min-h-[550px] shadow-sm">
              
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
                          opacity: isActive ? 1 : 0.4 - offset * 0.1,
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        style={{ zIndex: 10 - offset }}
                        className={cn(
                          "absolute inset-0 rounded-[24px] flex flex-col items-center justify-center p-8 text-center shadow-xl backdrop-blur-md border border-white/20",
                          isActive ? "bg-[#DCD0E8] text-[#1F1F1F]" : "bg-white/80"
                        )}
                      >
                        <p className={cn(
                          "text-xl md:text-2xl font-bold leading-tight",
                          !isActive && "blur-[1px]"
                        )}>
                          "{INSTRUCTIONS[index]}"
                        </p>
                        
                        {isActive && (
                          <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute bottom-6 h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
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
                  className="absolute -left-12 md:-left-16 top-1/2 -translate-y-1/2 p-3 text-[#1F1F1F]/40 hover:text-[#1F1F1F] transition-colors"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <button 
                  onClick={nextInstruction}
                  className="absolute -right-12 md:-right-16 top-1/2 -translate-y-1/2 p-3 text-[#1F1F1F]/40 hover:text-[#1F1F1F] transition-colors"
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
                      "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300",
                      activeChar === char.id 
                        ? "bg-[#1A1A1A] text-white shadow-lg" 
                        : "bg-[#DEDEDE] text-[#1F1F1F] hover:bg-[#D5D5D5]"
                    )}
                  >
                    <div className={cn(
                      "h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black",
                      activeChar === char.id ? "bg-white text-black" : "bg-black/10"
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
          <div className="max-w-[500px] space-y-6">
            <h2 className="text-[40px] md:text-[56px] font-bold text-[#1F1F1F] leading-[1.1] tracking-tight">
              Acting instructions
            </h2>
            <p className="text-lg md:text-xl text-[#1F1F1F]/60 leading-relaxed font-medium">
              Direct the emotional delivery of every line. Specify tone, pacing, emphasis, and mood with natural language instructions.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
