'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

/**
 * QuantisAI Labs Logo component.
 * Uses the exact brand image provided by the user.
 * We use a standard img tag here to ensure absolute reliability in showing the asset across all browsers.
 */
const Logo = ({ className }: LogoProps) => {
  return (
    <div className={cn("flex items-center justify-start overflow-hidden rounded-full", className)}>
      <img 
        src="https://cdn.quantisai.org/images/logo.png" 
        alt="QuantisAI Labs" 
        className="h-full w-auto object-contain"
        style={{ display: 'block' }}
      />
    </div>
  );
};

export default Logo;
