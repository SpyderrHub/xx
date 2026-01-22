'use client';

import Link from 'next/link';
import { CheckCircle2, Languages, Zap, Gift } from 'lucide-react';
import Logo from '@/components/logo';
import { SignUpForm } from './_components/sign-up-form';

export default function SignUpPage() {
  return (
    <div className="min-h-screen w-full bg-gray-900 text-white lg:grid lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between p-8 lg:flex">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-tr from-gray-900 via-gray-900 to-indigo-900/50"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-gray-900 to-transparent"></div>
          <div
            className="glow-1 absolute -left-1/2 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-purple-500/20 blur-[150px]"
          ></div>
          <div
            className="glow-2 absolute -right-1/3 top-1/3 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-indigo-500/20 blur-[150px]"
          ></div>
        </div>

        <Link href="/" aria-label="Home">
          <Logo className="h-7" />
        </Link>

        <div className="space-y-6">
          <h1 className="font-headline text-4xl font-bold tracking-tight">
            Create lifelike AI voices in minutes
          </h1>
          <p className="max-w-md text-lg text-gray-300">
            Join thousands of creators using AI voices for videos, audiobooks,
            and apps.
          </p>
          <ul className="space-y-4 pt-4">
            <li className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span>Ultra-realistic voices</span>
            </li>
            <li className="flex items-center gap-3">
              <Languages className="h-5 w-5 text-primary" />
              <span>Multi-language support</span>
            </li>
            <li className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-primary" />
              <span>Fast API access</span>
            </li>
            <li className="flex items-center gap-3">
              <Gift className="h-5 w-5 text-primary" />
              <span>Free credits on signup</span>
            </li>
          </ul>
        </div>
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} VoxAI. All rights reserved.
        </p>
      </div>

      <div className="flex items-center justify-center p-4 lg:p-8">
        <SignUpForm />
      </div>

      <style jsx>{`
        @keyframes glow-1 {
          0% {
            transform: translate(0, -50%) scale(1);
            opacity: 0.7;
          }
          50% {
            transform: translate(20%, -30%) scale(1.2);
            opacity: 0.5;
          }
          100% {
            transform: translate(-20%, -50%) scale(1);
            opacity: 0.7;
          }
        }
        @keyframes glow-2 {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.5;
          }
          50% {
            transform: translate(-20%, 20%) scale(1.2);
            opacity: 0.3;
          }
          100% {
            transform: translate(20%, -20%) scale(1);
            opacity: 0.5;
          }
        }
        .glow-1 {
          animation: glow-1 20s infinite alternate;
        }
        .glow-2 {
          animation: glow-2 25s infinite alternate-reverse;
        }
      `}</style>
    </div>
  );
}
