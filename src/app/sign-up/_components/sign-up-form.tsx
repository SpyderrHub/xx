'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

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
import { useFirebase } from '@/firebase';
import { signUpWithEmail } from '@/lib/auth';

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

export function SignUpForm() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const { auth, firestore } = useFirebase();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!auth || !firestore) return;
    setIsEmailLoading(true);
    try {
      await signUpWithEmail(
        auth,
        firestore,
        values.fullName,
        values.email,
        values.password
      );
      router.push('/dashboard');
    } catch (error) {
      console.error('Sign up failed:', error);
    } finally {
      setIsEmailLoading(false);
    }
  }

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
        <EyeOff className="h-5 w-5 text-gray-400" />
      ) : (
        <Eye className="h-5 w-5 text-gray-400" />
      )}
    </button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full"
    >
      <div className="rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-8 md:p-12 shadow-2xl backdrop-blur-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
        
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-3xl font-black tracking-tight text-white mb-2">
            Create account
          </h2>
          <p className="text-sm text-muted-foreground font-medium">
            Start generating studio-quality voices today.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 relative z-10">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                      className="h-14 border-white/5 bg-white/5 text-white placeholder:text-gray-700 rounded-2xl focus:ring-primary/20 transition-all font-medium"
                    />
                  </FormControl>
                  <FormMessage className="text-[10px] font-bold" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                      className="h-14 border-white/5 bg-white/5 text-white placeholder:text-gray-700 rounded-2xl focus:ring-primary/20 transition-all font-medium"
                    />
                  </FormControl>
                  <FormMessage className="text-[10px] font-bold" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={passwordVisible ? 'text' : 'password'}
                        placeholder="••••••••"
                        {...field}
                        className="h-14 border-white/5 bg-white/5 text-white placeholder:text-gray-700 rounded-2xl focus:ring-primary/20 transition-all font-medium"
                      />
                      <PasswordVisibilityToggle
                        visible={passwordVisible}
                        onClick={() => setPasswordVisible(!passwordVisible)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px] font-bold" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={confirmPasswordVisible ? 'text' : 'password'}
                        placeholder="••••••••"
                        {...field}
                        className="h-14 border-white/5 bg-white/5 text-white placeholder:text-gray-700 rounded-2xl focus:ring-primary/20 transition-all font-medium"
                      />
                      <PasswordVisibilityToggle
                        visible={confirmPasswordVisible}
                        onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px] font-bold" />
                </FormItem>
              )}
            />

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="pt-4">
              <Button
                type="submit"
                className="h-16 w-full bg-primary text-lg font-black hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 rounded-2xl btn-glow"
                disabled={isEmailLoading}
              >
                {isEmailLoading ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : null}
                {isEmailLoading ? 'Creating account...' : 'Get Started Free'}
              </Button>
            </motion.div>
          </form>
        </Form>

        <p className="mt-8 text-center text-xs text-muted-foreground leading-relaxed font-medium">
          By signing up, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-white transition-colors">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline hover:text-white transition-colors">
            Privacy Policy
          </Link>
          .
        </p>
      </div>

      <p className="mt-10 text-center text-sm font-medium text-muted-foreground">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-black uppercase tracking-widest text-primary hover:underline transition-all ml-1"
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
