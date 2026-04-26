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
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useFirebase } from '@/firebase';
import { signInWithEmail } from '@/lib/auth';
import { doc, getDoc } from 'firebase/firestore';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
  rememberMe: z.boolean().default(false).optional(),
});

export function LoginForm() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const router = useRouter();
  const { auth, firestore } = useFirebase();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!auth || !firestore) return;
    setIsEmailLoading(true);
    try {
      const userCredential = await signInWithEmail(auth, values.email, values.password);
      
      const userDoc = await getDoc(doc(firestore, 'users', userCredential.user.uid));
      const userData = userDoc.data();
      
      if (userData?.role === 'admin') {
        router.replace('/author');
      } else {
        router.replace('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsEmailLoading(false);
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

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
        
        <div className="mb-10">
          <h2 className="text-3xl font-black tracking-tight text-white mb-2">
            Welcome back
          </h2>
          <p className="text-sm text-muted-foreground font-medium">
            Continue your journey with QuantisAI Studio.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative z-10">
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

            <div className="flex items-center justify-between text-xs">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        id="remember-me"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="h-5 w-5 rounded-lg border-white/10 bg-white/5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                    </FormControl>
                    <Label
                      htmlFor="remember-me"
                      className="cursor-pointer font-bold text-muted-foreground hover:text-white transition-colors"
                    >
                      Remember me
                    </Label>
                  </FormItem>
                )}
              />
              <Link
                href="/forgot-password"
                className="font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
              >
                Forgot?
              </Link>
            </div>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                className="h-16 w-full bg-primary text-lg font-black hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 rounded-2xl btn-glow"
                disabled={isEmailLoading}
              >
                {isEmailLoading ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : null}
                {isEmailLoading ? 'Processing...' : 'Sign In'}
              </Button>
            </motion.div>
          </form>
        </Form>
      </div>

      <p className="mt-8 text-center text-sm font-medium text-muted-foreground">
        New to QuantisAI?{' '}
        <Link
          href="/sign-up"
          className="font-black uppercase tracking-widest text-primary hover:underline transition-all ml-1"
        >
          Create account
        </Link>
      </p>
    </motion.div>
  );
}
