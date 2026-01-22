import Link from 'next/link';
import Logo from '@/components/logo';

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white p-8">
      <Logo className="h-8" />
      <h1 className="mt-8 text-2xl font-bold">Privacy Policy</h1>
      <p className="mt-2 text-gray-400">This page is under construction.</p>
      <div className="mt-8 max-w-2xl text-gray-300 space-y-4 text-center">
        <p>Your privacy is important to us. Our full Privacy Policy will be available here soon.</p>
      </div>
      <Link href="/sign-up" className="mt-8 text-primary hover:underline">
        Go back to Sign Up
      </Link>
    </div>
  );
}
