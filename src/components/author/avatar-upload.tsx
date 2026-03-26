
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, User, Loader2, RotateCw, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Preset gradients for the "weavy" look
export const WEAVY_PRESETS = [
  { base: "bg-purple-600", blob1: "bg-indigo-400", blob2: "bg-pink-400" },
  { base: "bg-emerald-600", blob1: "bg-teal-400", blob2: "bg-cyan-400" },
  { base: "bg-amber-600", blob1: "bg-orange-400", blob2: "bg-rose-400" },
  { base: "bg-blue-600", blob1: "bg-sky-400", blob2: "bg-indigo-400" },
  { base: "bg-rose-600", blob1: "bg-pink-400", blob2: "bg-purple-400" },
  { base: "bg-indigo-600", blob1: "bg-blue-400", blob2: "bg-violet-400" },
  { base: "bg-cyan-600", blob1: "bg-emerald-400", blob2: "bg-sky-400" },
  { base: "bg-fuchsia-600", blob1: "bg-purple-400", blob2: "bg-pink-400" },
];

export function WeavyPattern({ presetIndex, className }: { presetIndex: number, className?: string }) {
  const preset = WEAVY_PRESETS[presetIndex % WEAVY_PRESETS.length];
  return (
    <div className={cn("relative w-full h-full overflow-hidden", preset.base, className)}>
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          x: [-10, 10, -10],
          y: [-10, 10, -10]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className={cn("absolute -top-1/4 -left-1/4 w-[150%] h-[150%] rounded-full blur-[40px] opacity-60", preset.blob1)} 
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          x: [10, -10, 10],
          y: [10, -10, 10]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className={cn("absolute -bottom-1/4 -right-1/4 w-[150%] h-[150%] rounded-full blur-[40px] opacity-60", preset.blob2)} 
      />
    </div>
  );
}

interface AvatarUploadProps {
  onAvatarSelect: (file: File | null) => void;
  avatarPreview: string | null;
  onGradientSelect: (index: number) => void;
  selectedGradientIndex: number;
}

export function AvatarUpload({ 
  onAvatarSelect, 
  avatarPreview, 
  onGradientSelect, 
  selectedGradientIndex 
}: AvatarUploadProps) {
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PNG, JPG, or WEBP image.",
          variant: "destructive",
        });
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Avatar image must be less than 2MB.",
          variant: "destructive",
        });
        return;
      }
      onAvatarSelect(file);
    }
  };

  const handleRandomize = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIndex = (selectedGradientIndex + 1) % WEAVY_PRESETS.length;
    onGradientSelect(nextIndex);
    if (avatarPreview) {
      onAvatarSelect(null); // Clear image if randomizing color
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div 
        className="relative group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => fileInputRef.current?.click()}
      >
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative h-32 w-32 rounded-[2.5rem] border-2 border-white/10 bg-white/5 overflow-hidden flex items-center justify-center transition-all group-hover:border-primary/60 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] shadow-2xl"
        >
          <AnimatePresence mode="wait">
            {avatarPreview ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full w-full relative"
              >
                <Image 
                  src={avatarPreview} 
                  alt="Speaker Avatar" 
                  fill 
                  className="object-cover"
                />
              </motion.div>
            ) : (
              <motion.div
                key="weavy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full w-full"
              >
                <WeavyPattern presetIndex={selectedGradientIndex} />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isHovered && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm"
              >
                <div className="text-center">
                  <Camera className="h-6 w-6 text-white mx-auto mb-1" />
                  <p className="text-[10px] font-black uppercase text-white tracking-widest">Change Photo</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Randomize Action */}
        <button 
          onClick={handleRandomize}
          className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-xl shadow-primary/20 border border-white/10 hover:scale-110 active:scale-95 transition-all z-20 group/btn"
          title="Randomize Color"
        >
          <RotateCw className="h-4 w-4 group-hover/btn:rotate-180 transition-transform duration-500" />
        </button>

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/png,image/jpeg,image/webp" 
          className="hidden" 
        />
      </div>
      
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-3 w-3 text-primary" />
          <p className="text-xs font-black uppercase tracking-widest text-white">Speaker Identity</p>
        </div>
        <p className="text-[10px] text-muted-foreground font-medium uppercase">Color or Image Identity</p>
      </div>
    </div>
  );
}
