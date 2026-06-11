
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

/**
 * Updated Logo component for QuantisAI Labs.
 * Features a custom SVG icon based on the brand's visual identity (stylized Q and dot).
 */
const Logo = ({ className }: LogoProps) => {
  return (
    <div className={cn("relative flex items-center justify-start gap-3", className)}>
      {/* Visual Logo Icon */}
      <div className="h-full aspect-square text-primary shrink-0">
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-auto"
        >
          <path 
            d="M72 72C66 78 58 82 50 82C32 82 18 68 18 50C18 32 32 18 50 18C68 18 82 32 82 50C82 58 78 66 72 72L80 82" 
            stroke="currentColor" 
            strokeWidth="12" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <circle cx="92" cy="70" r="7" fill="currentColor" />
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-0.5">
          <span className="text-2xl font-black tracking-tighter text-white">Quantis</span>
          <span className="text-2xl font-black tracking-tighter text-primary">AI</span>
        </div>
        <span className="text-xl font-bold tracking-tighter text-white/50">Labs</span>
      </div>
    </div>
  );
};

export default Logo;
