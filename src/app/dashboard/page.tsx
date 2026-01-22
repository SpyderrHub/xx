'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import { useFirebase } from '@/firebase';
import { logout } from '@/lib/auth';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user, isUserLoading, auth } = useFirebase();
  const router = useRouter();

  const handleLogout = async () => {
    if (auth) {
      await logout(auth);
      router.push('/login');
    }
  };

  if (isUserLoading) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    // This should ideally be handled by middleware, but as a fallback
    if (typeof window !== 'undefined') {
      router.replace('/login');
    }
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-secondary">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2" aria-label="Home">
            <Logo className="h-7" />
          </Link>
          <Button variant="outline" onClick={handleLogout}>
            Log Out
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">
            Welcome, {user.displayName || user.email}!
          </h1>
          <p className="mt-2 text-muted-foreground">
            This is your dashboard. More features coming soon.
          </p>
          <div className="mt-8 space-y-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <h2 className="text-xl font-semibold">Your Details</h2>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>UID:</strong> {user.uid}
            </p>
            <p>
              <strong>Joined:</strong>{' '}
              {user.metadata.creationTime
                ? new Date(user.metadata.creationTime).toLocaleDateString()
                : 'N/A'}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

const DashboardSkeleton = () => (
  <div className="flex min-h-screen flex-col bg-secondary">
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo className="h-7" />
        <Skeleton className="h-10 w-24" />
      </div>
    </header>
    <main className="flex-1">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="h-9 w-1/2" />
        <Skeleton className="mt-2 h-6 w-1/3" />
        <div className="mt-8 space-y-4 rounded-lg border bg-card p-6">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
        </div>
      </div>
    </main>
  </div>
);
