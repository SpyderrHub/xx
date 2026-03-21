
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { ScrollArea } from '@/components/ui/scroll-area';
import Logo from '@/components/logo';
import { cn } from '@/lib/utils';
import { ChevronRight, FileText, Home, Search, BookOpen, Menu } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { firestore } = useFirebase();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const docsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'documentation'), orderBy('order', 'asc'));
  }, [firestore]);

  const { data: documents } = useCollection(docsQuery);

  const SidebarContent = () => (
    <div className="space-y-6">
      <div className="space-y-1">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-3 mb-2">Introduction</h4>
        <Link 
          href="/docs"
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
            pathname === '/docs' ? "bg-primary/10 text-primary font-bold" : "hover:bg-white/5 text-muted-foreground hover:text-white"
          )}
        >
          <Home className="h-4 w-4" />
          Overview
        </Link>
      </div>

      <div className="space-y-1">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-3 mb-2">Knowledge Base</h4>
        {documents?.map((doc) => (
          <Link 
            key={doc.id}
            href={`/docs/${doc.slug}`}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
              pathname === `/docs/${doc.slug}` ? "bg-primary/10 text-primary font-bold" : "hover:bg-white/5 text-muted-foreground hover:text-white"
            )}
          >
            <FileText className="h-4 w-4" />
            {doc.title}
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col border-r border-white/5 bg-background sticky top-0 h-screen">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <Link href="/"><Logo className="h-6" /></Link>
        </div>
        <ScrollArea className="flex-1 p-6">
          <SidebarContent />
        </ScrollArea>
        <div className="p-6 border-t border-white/5">
          <Button variant="outline" size="sm" className="w-full text-[10px] uppercase font-black tracking-widest h-9" asChild>
            <Link href="/dashboard">Back to App</Link>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 border-b border-white/5 bg-background/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-4">
          <Link href="/"><Logo className="h-5" /></Link>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon"><Menu className="h-6 w-6" /></Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-background border-white/10 p-0">
              <div className="h-16 flex items-center px-6 border-b border-white/5">
                <Logo className="h-5" />
              </div>
              <div className="p-6"><SidebarContent /></div>
            </SheetContent>
          </Sheet>
        </header>

        {/* Dynamic Nav Breadcrumbs */}
        <div className="hidden lg:flex items-center gap-2 px-10 pt-8 text-xs text-muted-foreground font-medium">
          <Link href="/" className="hover:text-white">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/docs" className="hover:text-white">Docs</Link>
          {pathname !== '/docs' && (
            <>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white">{documents?.find(d => `/docs/${d.slug}` === pathname)?.title}</span>
            </>
          )}
        </div>

        <main className="flex-1 px-4 py-8 lg:px-10 lg:py-12 max-w-4xl">
          {children}
        </main>

        <footer className="mt-auto border-t border-white/5 p-10 bg-white/[0.01]">
          <div className="flex flex-col md:flex-row justify-between gap-6 items-center">
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Saanchi AI Documentation</p>
            <div className="flex gap-6 text-xs text-muted-foreground font-bold uppercase tracking-widest">
              <Link href="/privacy" className="hover:text-white">Privacy</Link>
              <Link href="/terms" className="hover:text-white">Terms</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
