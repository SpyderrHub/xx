'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

/**
 * Optimized Text-based Logo component for QuantisAI.
 * Eliminates build-time image processing dependencies for Vercel.
 */
const Logo = ({ className }: LogoProps) => {
  return (
    <div className={cn("relative flex items-center justify-start overflow-hidden", className)}>
      <div className="flex items-center gap-0.5">
        <span className="text-2xl font-black tracking-tighter text-white">Quantis</span>
        <span className="text-2xl font-black tracking-tighter text-primary">AI</span>
      </div>
    </div>
  );
};

export default Logo;
