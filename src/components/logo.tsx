'use client';

import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
// Importing the image directly from the components folder as requested by user
// This ensures Next.js bundles it correctly even if it's not in the public folder
// @ts-ignore
import logoImg from './logo.png';

interface LogoProps {
  className?: string;
}

/**
 * Global Logo component.
 * Uses a relative import to handle the image file located in the same directory (src/components).
 * The height is controlled via the className passed from parent layouts.
 */
const Logo = ({ className }: LogoProps) => {
  return (
    <div className={cn("relative flex items-center justify-start", className)}>
      <Image
        src={logoImg}
        alt="QuantisAI Logo"
        height={120}
        width={380}
        className="object-contain h-auto w-auto max-h-full"
        priority
      />
    </div>
  );
};

export default Logo;
