'use client';

import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

/**
 * QuantisAI Labs Logo component.
 * Uses the exact brand image provided by the user.
 * Includes unoptimized prop to ensure visibility in all environments.
 */
const Logo = ({ className }: LogoProps) => {
  return (
    <div className={cn("relative flex items-center justify-start", className)}>
      <Image 
        src="/logo.png" 
        alt="QuantisAI Labs" 
        width={300} 
        height={80} 
        className="h-full w-auto object-contain"
        priority
        unoptimized
      />
    </div>
  );
};

export default Logo;
