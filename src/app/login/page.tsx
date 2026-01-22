import Link from 'next/link';
import Logo from '@/components/logo';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <Logo className="h-8" />
      <h1 className="mt-8 text-2xl font-bold">Login</h1>
      <p className="mt-2 text-gray-400">This page is under construction.</p>
      <Link href="/" className="mt-8 text-primary hover:underline">
        Go back to Home
      </Link>
    </div>
  );
}
