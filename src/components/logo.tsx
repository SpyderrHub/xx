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
      />
    </div>
  );
};

export default Logo;
