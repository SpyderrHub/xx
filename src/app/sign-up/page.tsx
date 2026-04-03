
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Logo from '@/components/logo';
import { SignUpForm } from './_components/sign-up-form';

const AuthIllustration = () => (
  <div className="relative flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500/20 to-primary/20 rounded-full border border-white/10 shadow-2xl">
    <div className="absolute inset-0 bg-purple-500/10 rounded-full animate-ping opacity-20" />
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary relative z-10">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" x2="12" y1="19" y2="22"/>
    </svg>
  </div>
);

const WaveformAnimation = () => (
  <div className="flex items-center justify-center gap-1.5 h-10 mb-8">
    {[...Array(15)].map((_, i) => (
      <motion.div
        key={i}
        className="w-1 bg-primary/40 rounded-full"
        animate={{
          height: [8, 32, 12, 24, 8],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          delay: i * 0.08,
          ease: "easeInOut"
        }}
      />
    ))}
  </div>
);

export default function SignUpPage() {
  return (
    <div className="min-h-screen w-full bg-[#0B0B0F] text-white flex flex-col items-center justify-center p-6 md:p-10 relative overflow-hidden">
      {/* Background Neural Glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full" />
      </div>

      <div className="w-full max-w-md flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <Link href="/" aria-label="Home">
            <Logo className="h-8" />
          </Link>
        </motion.div>

        <AuthIllustration />
        <WaveformAnimation />

        <SignUpForm />

        <p className="mt-12 text-sm text-gray-500 font-medium text-center">
          © {new Date().getFullYear()} QuantisAI. All rights reserved.
        </p>
      </div>
    </div>
  );
}
