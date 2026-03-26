'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, User, Loader2, RotateCw, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Premium Fluid Gradients
export const WEAVY_PRESETS = [
  { base: "bg-indigo-900", blob1: "bg-purple-500", blob2: "bg-blue-400", blob3: "bg-pink-500" },
  { base: "bg-emerald-900", blob1: "bg-teal-500", blob2: "bg-cyan-400", blob3: "bg-lime-500" },
  { base: "bg-amber-900", blob1: "bg-orange-500", blob2: "bg-rose-400", blob3: "bg-yellow-500" },
  { base: "bg-rose-900", blob1: "bg-pink-500", blob2: "bg-purple-400", blob3: "bg-indigo-500" },
  { base: "bg-blue-900", blob1: "bg-sky-500", blob2: "bg-indigo-400", blob3: "bg-violet-500" },
  { base: "bg-violet-900", blob1: "bg-purple-500", blob2: "bg-fuchsia-400", blob3: "bg-pink-500" },
  { base: "bg-cyan-900", blob1: "bg-emerald-500", blob2: "bg-sky-400", blob3: "bg-blue-500" },
  { base: "bg-fuchsia-900", blob1: "bg-purple-500", blob2: "bg-pink-400", blob3: "bg-rose-500" },
];

export function WeavyPattern({ presetIndex, className }: { presetIndex: number, className?: string }) {
  const preset = WEAVY_PRESETS[presetIndex % WEAVY_PRESETS.length];
  
  return (
    <div className={cn("relative w-full h-full overflow-hidden", preset.base, className)}>
      {/* Blob 1 - Primary Motion */}
      <motion.div 
        animate={{ 
          scale: [1, 1.4, 1],
          x: ['-20%', '20%', '-20%'],
          y: ['-10%', '10%', '-10%'],
          rotate: [0, 45, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className={cn("absolute -top-1/4 -left-1/4 w-[150%] h-[150%] rounded-full blur-[50px] opacity-70", preset.blob1)} 
      />
      
      {/* Blob 2 - Secondary Offset Motion */}
      <motion.div 
        animate={{ 
          scale: [1.2, 0.8, 1.2],
          x: ['20%', '-20%', '20%'],
          y: ['10%', '-10%', '10%'],
          rotate: [0, -45, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className={cn("absolute -bottom-1/4 -right-1/4 w-[150%] h-[150%] rounded-full blur-[60px] opacity-60", preset.blob2)} 
      />

      {/* Blob 3 - Tertiary Highlight */}
      <motion.div 
        animate={{ 
          scale: [0.8, 1.2, 0.8],
          opacity: [0.3, 0.6, 0.3],
          x: ['-10%', '10%', '-10%'],
          y: ['20%', '-20%', '20%'],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className={cn("absolute top-1/4 right-1/4 w-[100%] h-[100%] rounded-full blur-[40px]", preset.blob3)} 
      />
      
      {/* Texture Overlay */}
      <div className="absolute inset-0 bg-white/[0.03] backdrop-overlay" />
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
          className="relative h-32 w-32 rounded-[2.5rem] border-2 border-white/10 bg-white/5 overflow-hidden flex items-center justify-center transition-all group-hover:border-primary/60 group-hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] shadow-2xl"
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
                key={selectedGradientIndex}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                transition={{ duration: 0.5 }}
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
                className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm z-10"
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
          title="Randomize Fluid Identity"
        >
          <RotateCw className="h-4 w-4 group-hover/btn:rotate-180 transition-transform duration-700 ease-out" />
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
        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Fluid Motion or Image Profile</p>
      </div>
    </div>
  );
}
