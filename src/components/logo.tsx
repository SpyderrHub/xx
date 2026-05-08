
'use client';

import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
// Importing the image directly from the components folder.
// This ensures Next.js bundles it correctly even if it's not in the public folder.
// @ts-ignore
import logoImg from './logo.png';

interface LogoProps {
  className?: string;
}

/**
 * Global Logo component.
 * Uses a relative import to handle the image file located in src/components.
 */
const Logo = ({ className }: LogoProps) => {
  return (
    <div className={cn("relative flex items-center justify-start overflow-hidden", className)}>
      <Image
        src={logoImg}
        alt="QuantisAI Logo"
        width={400}
        height={130}
        className="object-contain w-auto h-full"
        priority
      />
    </div>
  );
};

export default Logo;
