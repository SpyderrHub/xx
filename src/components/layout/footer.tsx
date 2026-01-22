import Link from 'next/link';
import { Github, Linkedin, Twitter } from 'lucide-react';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 py-12 md:flex-row">
          <div className="flex flex-col items-center gap-4 md:items-start">
            <Link href="/" aria-label="Home">
              <Logo className="h-7" />
            </Link>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} VoxAI. All rights reserved.
            </p>
          </div>
          <div className="flex flex-col items-center gap-8 md:items-start md:gap-12">
            <nav className="flex gap-6 text-sm font-medium">
              <Link
                href="#features"
                className="transition-colors hover:text-primary"
              >
                Features
              </Link>
              <Link
                href="#api"
                className="transition-colors hover:text-primary"
              >
                API
              </Link>
              <Link
                href="#pricing"
                className="transition-colors hover:text-primary"
              >
                Pricing
              </Link>
            </nav>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="GitHub">
                <Github className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
