
import Link from 'next/link';
import { Github, Linkedin, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-black/40 border-t border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" aria-label="Home">
              <Logo className="h-8" />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              The world's most expressive AI text-to-speech platform. Empowering developers and creators with natural, multi-lingual voices.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="rounded-full bg-white/5 hover:bg-primary hover:text-white" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full bg-white/5 hover:bg-primary hover:text-white" aria-label="GitHub">
                <Github className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full bg-white/5 hover:bg-primary hover:text-white" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="/dashboard/voice-library" className="hover:text-primary transition-colors">Voice Library</Link></li>
              <li><Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="#voice-demo" className="hover:text-primary transition-colors">Interactive Demo</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Developers</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="#api" className="hover:text-primary transition-colors">API Reference</Link></li>
              <li><Link href="#docs" className="hover:text-primary transition-colors">Documentation</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
              <li><Link href="/status" className="hover:text-primary transition-colors">System Status</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> support@saanchi.ai</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +1 (555) 123-4567</li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Saanchi AI. All rights reserved.
          </p>
          <div className="flex gap-8 text-xs text-muted-foreground font-bold uppercase tracking-widest">
             <Link href="/privacy" className="hover:text-white">Privacy</Link>
             <Link href="/terms" className="hover:text-white">Terms</Link>
             <Link href="/cookies" className="hover:text-white">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
