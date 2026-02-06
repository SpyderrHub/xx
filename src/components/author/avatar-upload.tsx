
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { toast } from '@/hooks/use-toast';

interface AvatarUploadProps {
  onAvatarSelect: (file: File | null) => void;
  avatarPreview: string | null;
}

export function AvatarUpload({ onAvatarSelect, avatarPreview }: AvatarUploadProps) {
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

  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        className="relative group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => fileInputRef.current?.click()}
      >
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative h-24 w-24 rounded-full border-2 border-dashed border-primary/30 bg-primary/5 overflow-hidden flex items-center justify-center transition-all group-hover:border-primary/60 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]"
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
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <User className="h-10 w-10 text-muted-foreground/50" />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isHovered && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 flex items-center justify-center"
              >
                <Camera className="h-6 w-6 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/png,image/jpeg,image/webp" 
          className="hidden" 
        />
      </div>
      
      <div className="text-center">
        <p className="text-sm font-medium">Speaker Avatar</p>
        <p className="text-xs text-muted-foreground">PNG, JPG or WEBP (Max 2MB)</p>
      </div>
    </div>
  );
}
