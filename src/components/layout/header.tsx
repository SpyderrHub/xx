'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import { useFirebase } from '@/firebase';
import { cn } from '@/lib/utils';
import { Menu, X, ChevronRight } from 'lucide-react';

const navLinks = [
  { name: 'Product', href: '/#features' },
  { name: 'Voices', href: '/dashboard/voice-library' },
  { name: 'Pricing', href: '/#pricing' },
  { name: 'Docs', href: '/docs' },
];

export default function Header() {
  const { user } = useFirebase();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled 
          ? "py-4 bg-background/80 backdrop-blur-xl border-b border-white/5 shadow-2xl" 
          : "py-6 bg-transparent border-b border-transparent"
      )}
    >
      <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-2 group">
            <Logo className="h-7 transition-transform group-hover:scale-105" />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="text-sm font-bold text-white/60 hover:text-white transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Link 
                href="/login" 
                className="hidden sm:block text-sm font-bold text-white/60 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Button asChild className="h-11 px-6 rounded-xl bg-primary hover:bg-primary/90 font-black text-sm shadow-lg shadow-primary/20 transition-all hover:scale-[1.03] active:scale-95 btn-glow">
                <Link href="/sign-up">Get Started Free</Link>
              </Button>
            </>
          ) : (
            <Button asChild variant="outline" className="h-11 px-6 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 font-bold text-sm shadow-inner transition-all hover:scale-[1.02]">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          )}

          <button 
            className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-background border-b border-white/5 overflow-hidden shadow-2xl"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-lg font-bold text-white/80 hover:text-white transition-colors py-2"
                >
                  {link.name}
                  <ChevronRight className="h-4 w-4 text-primary" />
                </Link>
              ))}
              <div className="pt-6 flex flex-col gap-4 border-t border-white/5 mt-2">
                {!user ? (
                  <>
                    <Link 
                      href="/login" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center font-bold text-white/60 hover:text-white py-2"
                    >
                      Sign In
                    </Link>
                    <Button asChild className="w-full h-14 bg-primary font-black rounded-2xl text-lg shadow-xl shadow-primary/20">
                      <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>Get Started Free</Link>
                    </Button>
                  </>
                ) : (
                  <Button asChild variant="outline" className="w-full h-14 rounded-2xl border-white/10 text-lg">
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>Go to Dashboard</Link>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
