'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, RotateCw, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Premium Fluid Radial Gradient Presets
export const WEAVY_PRESETS = [
  { name: "Cosmic Nebula", base: "bg-[#050505]", blob1: "bg-purple-600", blob2: "bg-blue-600", blob3: "bg-indigo-500", blob4: "bg-fuchsia-400" },
  { name: "Oceanic Depth", base: "bg-[#020817]", blob1: "bg-cyan-600", blob2: "bg-blue-500", blob3: "bg-teal-400", blob4: "bg-sky-300" },
  { name: "Solar Flare", base: "bg-[#0c0500]", blob1: "bg-orange-600", blob2: "bg-rose-600", blob3: "bg-amber-500", blob4: "bg-yellow-400" },
  { name: "Emerald Pulse", base: "bg-[#000804]", blob1: "bg-emerald-600", blob2: "bg-lime-500", blob3: "bg-teal-500", blob4: "bg-green-400" },
  { name: "Cyber Twilight", base: "bg-[#08000c]", blob1: "bg-indigo-600", blob2: "bg-violet-600", blob3: "bg-pink-500", blob4: "bg-blue-400" },
  { name: "Aurora Mist", base: "bg-[#000c0c]", blob1: "bg-cyan-500", blob2: "bg-emerald-400", blob3: "bg-sky-500", blob4: "bg-indigo-300" },
  { name: "Lava Core", base: "bg-[#0c0000]", blob1: "bg-red-600", blob2: "bg-orange-600", blob3: "bg-rose-500", blob4: "bg-amber-400" },
  { name: "Deep Amethyst", base: "bg-[#0a0010]", blob1: "bg-purple-700", blob2: "bg-fuchsia-600", blob3: "bg-indigo-600", blob4: "bg-violet-400" },
];

export function WeavyPattern({ presetIndex, className }: { presetIndex: number, className?: string }) {
  const preset = WEAVY_PRESETS[presetIndex % WEAVY_PRESETS.length];
  
  return (
    <div className={cn("relative w-full h-full overflow-hidden", preset.base, className)}>
      {/* Radial Center Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]" />

      {/* Fluid Liquid Blob 1 - Deep Radial */}
      <motion.div 
        animate={{ 
          scale: [1, 1.4, 1],
          x: ['-20%', '20%', '-20%'],
          y: ['-10%', '10%', '-10%'],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className={cn("absolute -top-1/4 -left-1/4 w-full h-full rounded-full blur-[100px] opacity-60", preset.blob1)} 
      />
      
      {/* Fluid Liquid Blob 2 - Counter Motion */}
      <motion.div 
        animate={{ 
          scale: [1.3, 0.8, 1.3],
          x: ['20%', '-20%', '20%'],
          y: ['15%', '-15%', '15%'],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className={cn("absolute -bottom-1/4 -right-1/4 w-full h-full rounded-full blur-[110px] opacity-50", preset.blob2)} 
      />

      {/* Fluid Liquid Blob 3 - Central Morph */}
      <motion.div 
        animate={{ 
          scale: [0.8, 1.5, 0.8],
          opacity: [0.2, 0.4, 0.2],
          x: ['-10%', '10%', '-10%'],
          y: ['20%', '-20%', '20%'],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className={cn("absolute top-1/4 right-1/4 w-[90%] h-[90%] rounded-full blur-[90px]", preset.blob3)} 
      />

      {/* Fluid Liquid Blob 4 - Detail Layer */}
      <motion.div 
        animate={{ 
          opacity: [0.1, 0.3, 0.1],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className={cn("absolute bottom-1/4 left-1/4 w-[70%] h-[70%] rounded-full blur-[80px]", preset.blob4)} 
      />
      
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Glass & Border Highlight */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 pointer-events-none" />
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
          className="relative h-32 w-32 rounded-[3rem] border-2 border-white/10 bg-[#0B0B0F] overflow-hidden flex items-center justify-center transition-all group-hover:border-primary/60 group-hover:shadow-[0_0_50px_rgba(168,85,247,0.3)] shadow-2xl"
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
                transition={{ duration: 0.8, ease: "circOut" }}
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
          title="Randomize Liquid identity"
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
          <p className="text-xs font-black uppercase tracking-widest text-white">Identity Studio</p>
        </div>
        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Fluid Radial Mesh Gradients</p>
      </div>
    </div>
  );
}