import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => (
  <div className={cn("relative h-14 w-auto min-w-[200px] flex items-center", className)}>
    <Image
      src="/logo.jpg"
      alt="QuantisAI Logo"
      fill
      className="object-contain object-left"
      priority
      unoptimized
    />
  </div>
);

export default Logo;
