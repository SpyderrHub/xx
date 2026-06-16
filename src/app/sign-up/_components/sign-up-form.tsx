'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2, CheckCircle2, ShieldCheck, ArrowRight, RefreshCw, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import { signUpWithEmail } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';
import { doc } from 'firebase/firestore';

const formSchema = z
  .object({
    fullName: z
      .string()
      .min(2, { message: 'Full name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Please enter a valid email.' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

const otpSchema = z.object({
  code: z.string().length(6, { message: 'Verification code must be 6 digits.' }),
});

type Step = 'details' | 'otp';

export function SignUpForm() {
  const [step, setStep] = useState<Step>('details');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { auth, firestore, user } = useFirebase();
  const router = useRouter();
  const searchParams = useSearchParams();
  const referralCode = searchParams.get('ref');

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userData } = useDoc(userDocRef);

  useEffect(() => {
    // Only handle automatic redirection for ALREADY verified users
    if (user && userData?.isVerified) {
      router.push('/dashboard');
    }
  }, [user, userData, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: '' },
  });

  async function onDetailsSubmit(values: z.infer<typeof formSchema>) {
    if (!auth || !firestore) return;
    setIsLoading(true);
    try {
      await signUpWithEmail(
        auth,
        firestore,
        values.fullName,
        values.email,
        values.password,
        referralCode
      );
      setStep('otp');
      toast({ title: "Account Created", description: "Verification code sent to your email." });
    } catch (error: any) {
      console.error('Sign up failed:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function onOtpSubmit(values: z.infer<typeof otpSchema>) {
    if (!user) return;
    setIsLoading(true);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ code: values.code }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast({ title: "Email Verified", description: "Welcome to QuantisAI Labs!" });
      router.push('/dashboard');
    } catch (error: any) {
      toast({ title: "Verification Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  const handleResendOtp = async () => {
    if (!user) return;
    setIsResending(true);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${idToken}` 
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast({ 
        title: "Code Resent", 
        description: "A new 6-digit code has been sent."
      });
    } catch (error: any) {
      toast({ title: "Resend Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsResending(false);
    }
  };

  const PasswordVisibilityToggle = ({
    visible,
    onClick,
  }: {
    visible: boolean;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className="absolute inset-y-0 right-0 flex items-center pr-3"
    >
      {visible ? (
        <EyeOff className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
      ) : (
        <Eye className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
      )}
    </button>
  );

  return (
    <div className="w-full">
      <div className="rounded-[2rem] md:rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-6 md:p-12 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
        
        <AnimatePresence mode="wait">
          {step === 'details' ? (
            <motion.div
              key="details"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-10"
            >
              <div className="mb-8 md:mb-10 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white mb-2">
                  Create account
                </h2>
                <p className="text-xs md:text-sm text-muted-foreground font-medium">
                  {referralCode ? (
                    <span className="text-primary font-bold">Claim your invited reward.</span>
                  ) : (
                    "Start generating studio-quality voices today."
                  )}
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onDetailsSubmit)} className="space-y-4 md:space-y-5">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            {...field}
                            className="h-12 md:h-14 border-white/5 bg-white/5 text-white placeholder:text-gray-700 rounded-xl md:rounded-2xl focus:ring-primary/20 transition-all font-medium text-sm md:text-base"
                          />
                        </FormControl>
                        <FormMessage className="text-[9px] md:text-[10px] font-bold" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            {...field}
                            className="h-12 md:h-14 border-white/5 bg-white/5 text-white placeholder:text-gray-700 rounded-xl md:rounded-2xl focus:ring-primary/20 transition-all font-medium text-sm md:text-base"
                          />
                        </FormControl>
                        <FormMessage className="text-[9px] md:text-[10px] font-bold" />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={passwordVisible ? 'text' : 'password'}
                                placeholder="••••••••"
                                {...field}
                                className="h-12 md:h-14 border-white/5 bg-white/5 text-white placeholder:text-gray-700 rounded-xl md:rounded-2xl focus:ring-primary/20 transition-all font-medium text-sm md:text-base"
                              />
                              <PasswordVisibilityToggle
                                visible={passwordVisible}
                                onClick={() => setPasswordVisible(!passwordVisible)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-[9px] md:text-[10px] font-bold" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Confirm</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={confirmPasswordVisible ? 'text' : 'password'}
                                placeholder="••••••••"
                                {...field}
                                className="h-12 md:h-14 border-white/5 bg-white/5 text-white placeholder:text-gray-700 rounded-xl md:rounded-2xl focus:ring-primary/20 transition-all font-medium text-sm md:text-base"
                              />
                              <PasswordVisibilityToggle
                                visible={confirmPasswordVisible}
                                onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-[9px] md:text-[10px] font-bold" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="h-14 md:h-16 w-full bg-primary text-base md:text-lg font-black hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 rounded-xl md:rounded-2xl btn-glow mt-4"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4 md:h-5 md:w-5" /> : <ArrowRight className="mr-2 h-4 w-4 md:h-5 md:w-5" />}
                    {isLoading ? 'Processing...' : 'Get Started Free'}
                  </Button>
                </form>
              </Form>
            </motion.div>
          ) : (
            <motion.div
              key="otp"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-10"
            >
              <div className="mb-8 md:mb-10 text-center">
                <div className="h-14 md:h-16 w-14 md:w-16 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 mx-auto mb-6">
                  <ShieldCheck className="h-7 md:h-8 w-7 md:w-8 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white mb-2">
                  Verify your email
                </h2>
                <div className="flex flex-col items-center gap-1 px-4 text-center">
                  <p className="text-xs md:text-sm text-muted-foreground font-medium">Enter code sent to</p>
                  <div className="flex items-center gap-2 text-primary font-bold bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                    <Mail className="h-3 w-3" />
                    <span className="text-[10px] md:text-xs truncate max-w-[200px]">{user?.email || form.getValues('email')}</span>
                  </div>
                </div>
              </div>

              <Form {...otpForm}>
                <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-6 md:space-y-8">
                  <FormField
                    control={otpForm.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="000000"
                            maxLength={6}
                            {...field}
                            className="h-14 md:h-16 border-white/10 bg-white/5 text-white text-center text-2xl md:text-3xl font-black tracking-[0.5em] rounded-xl md:rounded-2xl focus:ring-primary/20 transition-all"
                          />
                        </FormControl>
                        <FormMessage className="text-[9px] md:text-[10px] font-bold text-center" />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <Button
                      type="submit"
                      className="h-14 md:h-16 w-full bg-primary text-base md:text-lg font-black hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 rounded-xl md:rounded-2xl btn-glow"
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4 md:h-5 md:w-5" /> : <CheckCircle2 className="mr-2 h-4 w-4 md:h-5 md:w-5" />}
                      Verify & Activate
                    </Button>
                    
                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isResending}
                        className="text-[10px] md:text-xs font-black uppercase tracking-widest text-primary hover:text-primary/80 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mx-auto"
                      >
                        {isResending ? <Loader2 className="h-3 md:h-3.5 w-3 md:w-3.5 animate-spin" /> : <RefreshCw className="h-3 md:h-3.5 w-3 md:w-3.5" />}
                        Resend Code
                      </button>
                    </div>
                  </div>
                </form>
              </Form>

              <button 
                onClick={() => setStep('details')}
                className="mt-10 w-full text-center text-[9px] md:text-[10px] text-muted-foreground hover:text-white transition-colors font-black uppercase tracking-[0.2em]"
              >
                ← Back to details
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {step === 'details' && (
        <>
          <p className="mt-8 text-center text-[10px] md:text-xs text-muted-foreground leading-relaxed font-medium px-4">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-white transition-colors">Terms</Link> and{' '}
            <Link href="/privacy" className="underline hover:text-white transition-colors">Privacy Policy</Link>.
          </p>
          <p className="mt-10 text-center text-xs md:text-sm font-medium text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-black uppercase tracking-widest text-primary hover:underline transition-all ml-1"
            >
              Sign in
            </Link>
          </p>
        </>
      )}
    </div>
  );
}