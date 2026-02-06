
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Mic,
  Library,
  BookOpen,
  User,
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
import { Badge } from '@/components/ui/badge';

const AuthorHeader = ({ title }: { title: string }) => {
  const { isMobile, toggleSidebar } = useSidebar();
  const { user, auth } = useFirebase();
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
      <div className="flex flex-1 items-center gap-4">
        <h1 className="text-xl font-semibold">{title}</h1>
        <Badge variant="outline" className="border-primary/50 text-primary">Author Studio</Badge>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
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

export default function AuthorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, isLoading: isRoleLoading } = useUserRole();
  const { user, isUserLoading } = useFirebase();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !isRoleLoading) {
      if (!user) {
        router.replace('/login');
      } else if (role !== 'admin') {
        router.replace('/dashboard');
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

  if (!user || role !== 'admin') return null;

  return (
    <div className="dark">
      <SidebarProvider>
        <Sidebar collapsible="icon" className="border-r border-sidebar-border">
          <SidebarContent>
            <SidebarHeader className="h-16 justify-center p-4">
              <Link href="/" aria-label="Home">
                <Logo className="h-7" />
              </Link>
            </SidebarHeader>
            <SidebarMenu className="flex-1 px-2">
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Upload Voice">
                  <Link href="/author">
                    <Mic />
                    <span>Upload Voice</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="My Uploaded Voices">
                  <Link href="/author/voices">
                    <Library />
                    <span>My Uploaded Voices</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Upload Guidelines">
                  <Link href="/author/guidelines">
                    <BookOpen />
                    <span>Upload Guidelines</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarFooter className="px-2">
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Profile">
                  <Link href="/author/profile">
                    <User />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarFooter>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <AuthorHeader title="Author Studio" />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
