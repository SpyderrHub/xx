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
import { signUpWithEmail, signInWithGoogle } from '@/lib/auth';

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

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width="20"
    height="20"
    {...props}
  >
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    />
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    />
    <path
      fill="#1976D2"
      d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.902,35.61,44,29.813,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    />
  </svg>
);

export function SignUpForm() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
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

  async function handleGoogleSignIn() {
    if (!auth || !firestore) return;
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle(auth, firestore);
      router.push('/dashboard');
    } catch (error) {
      console.error('Google sign up failed:', error);
    } finally {
      setIsGoogleLoading(false);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsEmailLoading(true);
    try {
      await signUpWithEmail(
        auth!,
        firestore!,
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
                disabled={isEmailLoading || isGoogleLoading}
              >
                {isEmailLoading ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : null}
                {isEmailLoading ? 'Creating account...' : 'Get Started Free'}
              </Button>
            </motion.div>
          </form>
        </Form>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/5"></span>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-[#0B0B0F] px-4 text-muted-foreground font-black tracking-[0.3em]">
              Or join with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1">
          <Button
            variant="outline"
            className="h-14 border-white/5 bg-white/5 text-white hover:bg-white/10 rounded-2xl font-bold text-xs"
            onClick={handleGoogleSignIn}
            disabled={isEmailLoading || isGoogleLoading}
          >
            {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2" />}
            Continue with Google
          </Button>
        </div>

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
