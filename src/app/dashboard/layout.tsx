'use client';

import { useMemo, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  MessageSquare,
  Library,
  History,
  Settings,
  LogOut,
  Menu,
  Zap,
  Code2,
  Mic2,
  Sparkles,
} from 'lucide-react';
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import Logo from '@/components/logo';
import { useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/auth';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUserRole } from '@/hooks/use-user-role';
import { doc } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const planLimits: Record<string, number> = {
  free: 10000,
  creator: 500000,
  pro: 2000000,
  business: 10000000,
};

const SectionLabel = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("px-4 mb-2 mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60", className)}>
    {children}
  </div>
);

const DashboardHeader = ({ title }: { title: string }) => {
  const { isMobile, toggleSidebar } = useSidebar();
  const { user, isUserLoading, auth, firestore } = useFirebase();
  const router = useRouter();

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userData } = useDoc(userDocRef);

  const handleLogout = async () => {
    if (auth) {
      await logout(auth);
      router.push('/login');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('');
  };

  const creditsRemaining = userData?.credits || 0;
  const plan = userData?.plan || 'free';
  const limit = planLimits[plan] || 10000;
  const creditsUsed = Math.max(0, limit - creditsRemaining);

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background/80 backdrop-blur-md px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {isMobile && (
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-6 w-6" />
        </Button>
      )}
      <h1 className="flex-1 text-xl font-semibold tracking-tight">{title}</h1>
      <div className="flex items-center gap-4">
        {!isUserLoading && user && (
          <div className="hidden flex-col items-end sm:flex">
            <span className="text-sm font-medium">
              {creditsUsed.toLocaleString()} / {limit.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">Characters Used</span>
          </div>
        )}

        <Button asChild className="hidden bg-gradient-to-r from-primary to-indigo-600 font-bold text-white hover:opacity-90 sm:block rounded-xl shadow-lg shadow-primary/20">
          <Link href="/dashboard/subscription">Upgrade</Link>
        </Button>

        {isUserLoading ? (
          <Skeleton className="h-8 w-8 rounded-full" />
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user.photoURL || ''}
                    alt={user.displayName || ''}
                  />
                  <AvatarFallback>
                    {user.displayName ? getInitials(user.displayName) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.displayName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/subscription">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Subscription</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </header>
  );
};

const DashboardSidebar = () => {
  const pathname = usePathname();
  const { user, auth } = useFirebase();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const mainNav = useMemo(() => [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/my-generations', label: 'History', icon: History },
  ], []);

  const studioNav = useMemo(() => [
    { href: '/dashboard/text-to-speech', label: 'AI Text to Speech', icon: MessageSquare },
    { href: '/dashboard/voice-cloning', label: 'AI Voice Cloning', icon: Mic2 },
    { href: '/dashboard/voice-designer', label: 'AI Voice Designer', icon: Sparkles },
    { href: '/dashboard/voice-library', label: 'AI Voice Library', icon: Library },
  ], []);

  const footerNav = useMemo(() => [
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
    { href: '#', label: 'API Docs', icon: Code2 },
  ], []);

  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('');
  };

  const handleLogout = async () => {
    if (auth) await logout(auth);
  };

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r border-white/5 bg-background">
      <SidebarHeader className="h-16 justify-center px-6">
        <Link href="/" aria-label="Home" className="flex items-center gap-2">
          <Logo className="h-7" />
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="px-3 pb-4 scrollbar-hide">
        {!isCollapsed && <SectionLabel>Dashboard</SectionLabel>}
        <SidebarMenu>
          {mainNav.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
                className={cn(
                  "relative rounded-xl h-10 px-3 transition-all duration-200",
                  pathname === item.href 
                    ? "bg-primary/10 text-primary font-bold shadow-[0_0_15px_rgba(168,85,247,0.15)] border border-primary/20" 
                    : "hover:bg-white/5 text-muted-foreground hover:text-white"
                )}
              >
                <Link href={item.href}>
                  <item.icon className={cn("shrink-0", pathname === item.href ? "text-primary" : "")} />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        {!isCollapsed && <SectionLabel>Studio</SectionLabel>}
        <SidebarMenu>
          {studioNav.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
                className={cn(
                  "relative rounded-xl h-10 px-3 transition-all duration-200",
                  pathname === item.href 
                    ? "bg-primary/10 text-primary font-bold shadow-[0_0_15px_rgba(168,85,247,0.15)] border border-primary/20" 
                    : "hover:bg-white/5 text-muted-foreground hover:text-white"
                )}
              >
                <Link href={item.href}>
                  <item.icon className={cn("shrink-0", pathname === item.href ? "text-primary" : "")} />
                  <span>{item.label}</span>
                  {item.label === "AI Voice Designer" && !isCollapsed && (
                    <span className="ml-auto rounded-full bg-primary/20 px-1.5 py-0.5 text-[9px] font-black uppercase text-primary ring-1 ring-primary/20">
                      Pro
                    </span>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        {!isCollapsed && <SectionLabel>Resources</SectionLabel>}
        <SidebarMenu>
          {footerNav.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                tooltip={item.label}
                className="rounded-xl h-10 px-3 hover:bg-white/5 text-muted-foreground hover:text-white transition-all"
              >
                <Link href={item.href}>
                  <item.icon className="shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 pt-0">
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-indigo-600/20 border border-primary/20 p-4 shadow-xl"
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-primary fill-primary animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest text-white">Go Pro</span>
            </div>
            <p className="text-[10px] text-muted-foreground mb-3 leading-relaxed">
              Unlock ultra-realistic cloning and 2M monthly characters.
            </p>
            <Button asChild size="sm" className="w-full h-8 bg-primary hover:bg-primary/90 text-[11px] font-bold rounded-lg shadow-lg shadow-primary/20">
              <Link href="/dashboard/subscription">Upgrade Now</Link>
            </Button>
          </motion.div>
        )}

        <div className="flex flex-col gap-1">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-12 w-full justify-start gap-3 rounded-xl px-2 hover:bg-white/5 group">
                  <Avatar className="h-8 w-8 ring-2 ring-white/5 group-hover:ring-primary/20 transition-all">
                    <AvatarImage src={user.photoURL || ''} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">{getInitials(user.displayName || 'U')}</AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
                    <div className="flex flex-col items-start text-left overflow-hidden">
                      <span className="text-sm font-bold text-white truncate w-full">{user.displayName || 'User'}</span>
                      <span className="text-[10px] text-muted-foreground truncate w-full">{user.email}</span>
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end" className="w-56 rounded-xl border-white/10 bg-black/90 backdrop-blur-xl">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                  <Link href="/dashboard/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="rounded-lg cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useFirebase();
  const { role, isLoading: isRoleLoading } = useUserRole();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isUserLoading && !isRoleLoading) {
      if (!user) {
        router.replace('/login');
      } else if (role === 'admin') {
        router.replace('/author');
      }
    }
  }, [user, isUserLoading, role, isRoleLoading, router]);

  if (isUserLoading || isRoleLoading) {
    return (
      <div className="dark flex min-h-screen items-center justify-center bg-background">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    );
  }

  if (!user || role === 'admin') return null;

  const getTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard Overview';
    if (pathname === '/dashboard/text-to-speech') return 'AI Text to Speech Studio';
    if (pathname === '/dashboard/voice-cloning') return 'AI Voice Cloning Studio';
    if (pathname === '/dashboard/voice-designer') return 'AI Voice Designer Studio';
    if (pathname === '/dashboard/voice-library') return 'AI Voice Library';
    if (pathname === '/dashboard/my-generations') return 'Generation History';
    if (pathname === '/dashboard/subscription') return 'Plan & Billing';
    if (pathname === '/dashboard/settings') return 'Account Settings';
    return 'Dashboard';
  };

  return (
    <div className="dark font-body antialiased">
      <SidebarProvider>
        <DashboardSidebar />
        <SidebarInset className="bg-background/50">
          <DashboardHeader title={getTitle()} />
          <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {children}
            </motion.div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
