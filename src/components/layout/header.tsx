import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label="Home">
          <Logo className="h-7" />
        </Link>
        <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
          <Link
            href="/#features"
            className="transition-colors hover:text-primary"
          >
            Features
          </Link>
          <Link href="/#api" className="transition-colors hover:text-primary">
            API
          </Link>
          <Link
            href="/#pricing"
            className="transition-colors hover:text-primary"
          >
            Pricing
          </Link>
        </nav>
        <Button asChild>
          <Link href="/sign-up">Get Started</Link>
        </Button>
      </div>
    </header>
  );
};

export default Header;
