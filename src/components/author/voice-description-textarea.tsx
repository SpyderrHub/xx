
'use client';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface VoiceDescriptionTextareaProps {
  value: string;
  onChange: (value: string) => void;
}

export function VoiceDescriptionTextarea({ value, onChange }: VoiceDescriptionTextareaProps) {
  const minLength = 20;
  const maxLength = 500;
  const currentLength = value.length;
  
  const isTooShort = currentLength > 0 && currentLength < minLength;
  const isAtLimit = currentLength >= maxLength;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium">Voice Description</Label>
        <span className={cn(
          "text-[10px] font-mono",
          isTooShort ? "text-yellow-500" : isAtLimit ? "text-red-500" : "text-muted-foreground"
        )}>
          {currentLength} / {maxLength}
        </span>
      </div>
      
      <div className="relative group">
        <Textarea 
          placeholder="Describe your voice tone, speaking style, emotional range, and best use cases like storytelling, narration, or conversational AI..."
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
          className={cn(
            "min-h-[120px] resize-none rounded-xl bg-white/5 border-white/10 transition-all focus:ring-primary/20 focus:border-primary/50",
            isTooShort && "border-yellow-500/50 focus:border-yellow-500",
            isAtLimit && "border-red-500/50 focus:border-red-500"
          )}
        />
        <motion.div 
          className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity"
          initial={false}
        />
      </div>

      <div className="flex justify-between items-center px-1">
        {isTooShort ? (
          <p className="text-[10px] text-yellow-500 italic">Min. 20 characters required for better discoverability.</p>
        ) : (
          <p className="text-[10px] text-muted-foreground italic">Helps users understand your voice strengths.</p>
        )}
      </div>
    </div>
  );
}
