import Link from 'next/link';
import Logo from '@/components/logo';

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-8 text-white">
      <Logo className="h-8" />
      <h1 className="mt-8 text-2xl font-bold">Forgot Password</h1>
      <p className="mt-2 text-gray-400">This page is under construction.</p>
      <div className="mt-8 max-w-2xl space-y-4 text-center text-gray-300">
        <p>
          Functionality to reset your password will be available here soon.
        </p>
      </div>
      <Link href="/login" className="mt-8 text-primary hover:underline">
        Go back to Login
      </Link>
    </div>
  );
}
