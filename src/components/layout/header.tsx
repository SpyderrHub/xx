
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import { useFirebase } from '@/firebase';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

const Header = () => {
  const { user } = useFirebase();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300 border-b",
      isScrolled 
        ? "bg-background/80 backdrop-blur-md border-white/10" 
        : "bg-transparent border-transparent"
    )}>
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2" aria-label="Home">
            <Logo className="h-7" />
          </Link>
          <nav className="hidden items-center space-x-8 text-sm font-medium lg:flex">
            <Link href="/#features" className="text-muted-foreground transition-colors hover:text-primary">Product</Link>
            <Link href="/dashboard/voice-library" className="text-muted-foreground transition-colors hover:text-primary">Voices</Link>
            <Link href="/#pricing" className="text-muted-foreground transition-colors hover:text-primary">Pricing</Link>
            <Link href="/#api" className="text-muted-foreground transition-colors hover:text-primary">API</Link>
            <Link href="/#docs" className="text-muted-foreground transition-colors hover:text-primary">Docs</Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </>
          ) : (
            <Button asChild variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
