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
  { name: 'Docs', href: 'https://docs.quantisai.org/' },
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
        "fixed top-8 left-0 right-0 z-50 flex justify-center px-4 transition-all duration-500",
        isScrolled ? "top-4" : "top-8"
      )}
    >
      <nav 
        className={cn(
          "flex items-center justify-between w-[95%] max-w-7xl px-8 md:px-14 rounded-full border border-white/10 transition-all duration-500",
          "bg-black/30 backdrop-blur-3xl shadow-[0_12px_48px_rgba(0,0,0,0.5)]",
          isScrolled ? "py-3 scale-95 md:scale-100" : "py-5 md:py-6"
        )}
      >
        <div className="flex items-center gap-12 md:gap-16">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <Logo className="h-9 md:h-12 transition-transform group-hover:scale-105" />
          </Link>

          {/* Desktop Nav - Moved to Left */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                target={link.name === 'Docs' ? "_blank" : undefined}
                rel={link.name === 'Docs' ? "noopener noreferrer" : undefined}
                className="text-[13px] font-black text-white/50 hover:text-white transition-colors relative group uppercase tracking-[0.2em]"
              >
                {link.name}
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6 md:gap-10 shrink-0">
          {!user ? (
            <>
              <Link 
                href="/login" 
                className="hidden sm:block text-[11px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors px-2"
              >
                Login
              </Link>
              <Button asChild className="h-11 md:h-14 px-6 md:px-10 rounded-full bg-primary hover:bg-primary/90 font-black text-xs md:text-sm shadow-lg shadow-primary/20 transition-all hover:scale-[1.05] active:scale-95 btn-glow uppercase tracking-[0.2em]">
                <Link href="/sign-up">Start Free</Link>
              </Button>
            </>
          ) : (
            <Button asChild variant="outline" className="h-11 md:h-14 px-6 md:px-10 rounded-full border-white/10 bg-white/5 hover:bg-white/10 font-black text-xs md:text-sm shadow-inner transition-all hover:scale-[1.02] uppercase tracking-[0.2em]">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          )}

          <button 
            className="lg:hidden p-2 text-white/60 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.3, ease: "circOut" }}
            className="absolute top-24 left-4 right-4 bg-black/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl lg:hidden p-10"
          >
            <div className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  target={link.name === 'Docs' ? "_blank" : undefined}
                  rel={link.name === 'Docs' ? "noopener noreferrer" : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-xl font-black uppercase tracking-[0.2em] text-white/80 hover:text-primary transition-colors"
                >
                  {link.name}
                  <ChevronRight className="h-5 w-5 text-primary" />
                </Link>
              ))}
              <div className="pt-10 flex flex-col gap-6 border-t border-white/5 mt-2">
                {!user ? (
                  <>
                    <Link 
                      href="/login" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center font-black uppercase tracking-widest text-white/50 hover:text-white py-3 text-sm"
                    >
                      Sign In
                    </Link>
                    <Button asChild className="w-full h-16 bg-primary font-black rounded-full text-lg shadow-xl shadow-primary/20 uppercase tracking-[0.2em]">
                      <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>Get Started Free</Link>
                    </Button>
                  </>
                ) : (
                  <Button asChild variant="outline" className="w-full h-16 rounded-full border-white/10 text-lg font-black uppercase tracking-[0.2em]">
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
