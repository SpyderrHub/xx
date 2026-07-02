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
        "fixed top-6 left-0 right-0 z-50 flex justify-center px-4 transition-all duration-500",
        isScrolled ? "top-4" : "top-8"
      )}
    >
      <nav 
        className={cn(
          "flex items-center gap-4 md:gap-8 px-4 md:px-6 py-2 rounded-full border border-white/10 transition-all duration-500",
          "bg-black/20 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
          isScrolled ? "py-2.5 scale-95 md:scale-100" : "py-3"
        )}
      >
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <Logo className="h-7 md:h-9 transition-transform group-hover:scale-105" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8 px-4">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              target={link.name === 'Docs' ? "_blank" : undefined}
              rel={link.name === 'Docs' ? "noopener noreferrer" : undefined}
              className="text-[13px] font-bold text-white/50 hover:text-white transition-colors relative group uppercase tracking-widest"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          {!user ? (
            <>
              <Link 
                href="/login" 
                className="hidden sm:block text-xs font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors px-2"
              >
                Login
              </Link>
              <Button asChild className="h-9 md:h-11 px-4 md:px-7 rounded-full bg-primary hover:bg-primary/90 font-black text-[10px] md:text-xs shadow-lg shadow-primary/20 transition-all hover:scale-[1.05] active:scale-95 btn-glow uppercase tracking-widest">
                <Link href="/sign-up">Start Free</Link>
              </Button>
            </>
          ) : (
            <Button asChild variant="outline" className="h-9 md:h-11 px-4 md:px-7 rounded-full border-white/10 bg-white/5 hover:bg-white/10 font-black text-[10px] md:text-xs shadow-inner transition-all hover:scale-[1.02] uppercase tracking-widest">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          )}

          <button 
            className="lg:hidden p-1.5 text-white/60 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
            className="absolute top-20 left-4 right-4 bg-black/90 backdrop-blur-3xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl lg:hidden p-8"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  target={link.name === 'Docs' ? "_blank" : undefined}
                  rel={link.name === 'Docs' ? "noopener noreferrer" : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-lg font-black uppercase tracking-[0.2em] text-white/80 hover:text-primary transition-colors"
                >
                  {link.name}
                  <ChevronRight className="h-4 w-4 text-primary" />
                </Link>
              ))}
              <div className="pt-8 flex flex-col gap-4 border-t border-white/5 mt-2">
                {!user ? (
                  <>
                    <Link 
                      href="/login" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center font-black uppercase tracking-widest text-white/50 hover:text-white py-2 text-sm"
                    >
                      Sign In
                    </Link>
                    <Button asChild className="w-full h-14 bg-primary font-black rounded-full text-base shadow-xl shadow-primary/20 uppercase tracking-widest">
                      <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>Get Started Free</Link>
                    </Button>
                  </>
                ) : (
                  <Button asChild variant="outline" className="w-full h-14 rounded-full border-white/10 text-base font-black uppercase tracking-widest">
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
