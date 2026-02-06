
'use client';

import { useMemo, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  MessageSquare,
  Library,
  History,
  CreditCard,
  Settings,
  LogOut,
  Menu,
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
  SidebarMenuSkeleton,
} from '@/components/ui/sidebar';
import Logo from '@/components/logo';
import { useFirebase } from '@/firebase';
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
import { useSidebar } from '@/components/ui/sidebar';
import { useUserRole } from '@/hooks/use-user-role';

const DashboardHeader = ({ title }: { title: string }) => {
  const { isMobile, toggleSidebar } = useSidebar();
  const { user, isUserLoading, auth } = useFirebase();
  const router = useRouter();

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

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {isMobile && (
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-6 w-6" />
        </Button>
      )}
      <h1 className="flex-1 text-xl font-semibold">{title}</h1>
      <div className="flex items-center gap-4">
        <div className="hidden flex-col items-end sm:flex">
          <span className="text-sm font-medium">4,320 / 6,000</span>
          <span className="text-xs text-muted-foreground">Credits Used</span>
        </div>

        <Button className="hidden bg-gradient-to-r from-purple-600 to-indigo-600 font-bold text-white hover:from-purple-700 hover:to-indigo-700 sm:block">
          Upgrade
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
                  <CreditCard className="mr-2 h-4 w-4" />
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
  const { user, isUserLoading, auth } = useFirebase();
  const router = useRouter();

  const handleLogout = async () => {
    if (auth) {
      await logout(auth);
      router.push('/login');
    }
  };

  const navItems = useMemo(
    () => [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      {
        href: '/dashboard/text-to-speech',
        label: 'Text to Speech',
        icon: MessageSquare,
      },
      { href: '/dashboard/voice-library', label: 'Voice Library', icon: Library },
      { href: '/dashboard/my-generations', label: 'My Generations', icon: History },
    ],
    []
  );

  const settingsItems = useMemo(
    () => [
      { href: '/dashboard/subscription', label: 'Subscription', icon: CreditCard },
      { href: '/dashboard/settings', label: 'Settings', icon: Settings },
    ],
    []
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('');
  };

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="border-r border-sidebar-border"
    >
      <SidebarContent>
        <SidebarHeader className="h-16 justify-center p-4">
          <Link href="/" aria-label="Home">
            <Logo className="h-7" />
          </Link>
        </SidebarHeader>
        <SidebarMenu className="flex-1 px-2">
          {isUserLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <SidebarMenuSkeleton key={i} showIcon />
              ))
            : navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={{ children: item.label }}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
        </SidebarMenu>

        <SidebarFooter className="px-2">
          {isUserLoading
            ? Array.from({ length: 2 }).map((_, i) => (
                <SidebarMenuSkeleton key={i} showIcon />
              ))
            : settingsItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={{ children: item.label }}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

          {isUserLoading ? (
            <div className="flex items-center gap-2 p-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-5 w-24" />
            </div>
          ) : user ? (
            <div className="p-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex h-auto w-full items-center justify-start gap-2 p-2"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.photoURL || ''}
                        alt={user.displayName || 'User'}
                      />
                      <AvatarFallback>
                        {user.displayName ? getInitials(user.displayName) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-left">
                      <span className="truncate text-sm font-medium">
                        {user.displayName || user.email}
                      </span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="start" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/dashboard/settings" className="w-full">
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : null}
        </SidebarFooter>
      </SidebarContent>
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

  // Strict Role-based access control for /dashboard
  useEffect(() => {
    if (!isUserLoading && !isRoleLoading) {
      if (!user) {
        router.replace('/login');
      } else if (role === 'admin') {
        // Redirect admins away from the user dashboard to their studio
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
    switch (pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/dashboard/text-to-speech':
        return 'Text to Speech';
      case '/dashboard/voice-library':
        return 'Voice Library';
      case '/dashboard/my-generations':
        return 'My Generations';
      case '/dashboard/subscription':
        return 'Subscription';
      case '/dashboard/settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="dark">
      <SidebarProvider>
        <DashboardSidebar />
        <SidebarInset>
          <DashboardHeader title={getTitle()} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
