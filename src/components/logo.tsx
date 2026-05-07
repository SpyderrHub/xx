import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
// Importing the image directly since it's located in the same folder
import logoImg from './logo.jpg';

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => (
  <div className={cn("relative h-10 w-40 flex items-center", className)}>
    <Image
      src={logoImg}
      alt="QuantisAI Logo"
      className="object-contain"
      priority
      unoptimized
      style={{ width: 'auto', height: '100%' }}
    />
  </div>
);

export default Logo;
