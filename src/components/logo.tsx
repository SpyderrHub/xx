import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => (
  <div className={cn("relative h-10 w-40", className)}>
    <Image
      src="/logo.jpg"
      alt="QuantisAI Logo"
      fill
      className="object-contain"
      priority
      unoptimized
    />
  </div>
);

export default Logo;
