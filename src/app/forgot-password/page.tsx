'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Key, 
  Mail, 
  ArrowRight, 
  Loader2, 
  ChevronLeft, 
  ShieldCheck, 
  CheckCircle2, 
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';

const emailSchema = z.object({
  email: z.string().email({ message: 'Valid email required' }),
});

const resetSchema = z.object({
  code: z.string().length(6, { message: '6-digit code required' }),
  password: z.string().min(8, { message: 'Min 8 characters required' }),
});

type Step = 'email' | 'otp' | 'success';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const resetForm = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: { code: '', password: '' },
  });

  async function onRequestOtp(values: z.infer<typeof emailSchema>) {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setEmail(values.email);
      setStep('otp');
      toast({ 
        title: "Verification Sent", 
        description: `A security code has been sent to ${values.email}.` 
      });
    } catch (error: any) {
      toast({ title: "Request Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  async function onResetPassword(values: z.infer<typeof resetSchema>) {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          code: values.code, 
          newPassword: values.password 
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setStep('success');
      toast({ title: "Password Updated", description: "You can now sign in with your new password." });
    } catch (error: any) {
      toast({ title: "Reset Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  const handleResend = async () => {
    setIsResending(true);
    try {
      const res = await fetch('/api/auth/forgot-password/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast({ 
        title: "Code Resent", 
        description: "A new security code has been sent to your email." 
      });
    } catch (error: any) {
      toast({ title: "Resend Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0B0F] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Neural Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-orange-600/5 blur-[100px] rounded-full" />
      </div>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 md:mb-10">
        <Link href="/"><Logo className="h-6 md:h-8" /></Link>
      </motion.div>

      <div className="w-full max-w-md">
        <div className="rounded-[2rem] md:rounded-[2.5rem] border border-white/5 bg-white/[0.02] p-6 md:p-12 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
          
          <AnimatePresence mode="wait">
            {step === 'email' ? (
              <motion.div key="email" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <div className="mb-8 md:mb-10">
                  <div className="h-12 md:h-14 w-12 md:w-14 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 mb-6">
                    <Key className="h-6 md:h-7 w-6 md:w-7 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white mb-2">Recovery</h2>
                  <p className="text-xs md:text-sm text-muted-foreground font-medium leading-relaxed">
                    Enter the email address associated with your QuantisAI account to receive a reset code.
                  </p>
                </div>

                <Form {...emailForm}>
                  <form onSubmit={emailForm.handleSubmit(onRequestOtp)} className="space-y-6">
                    <FormField
                      control={emailForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Account Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input placeholder="you@example.com" {...field} className="h-12 md:h-14 pl-12 bg-white/5 border-white/5 rounded-xl md:rounded-2xl focus:ring-primary/20 text-sm md:text-base" />
                            </div>
                          </FormControl>
                          <FormMessage className="text-[9px] md:text-[10px] font-bold" />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isLoading} className="h-14 md:h-16 w-full bg-primary font-black text-base md:text-lg rounded-xl md:rounded-2xl btn-glow transition-all">
                      {isLoading ? <Loader2 className="animate-spin h-4 md:h-5 w-4 md:w-5 mr-2" /> : <ArrowRight className="h-4 md:h-5 w-4 md:w-5 mr-2" />}
                      Send Code
                    </Button>
                  </form>
                </Form>
              </motion.div>
            ) : step === 'otp' ? (
              <motion.div key="otp" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <div className="mb-8 md:mb-10 text-center">
                  <div className="h-14 md:h-16 w-14 md:w-16 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 mx-auto mb-6">
                    <ShieldCheck className="h-7 md:h-8 w-7 md:w-8 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white mb-2">Verify Account</h2>
                  <p className="text-xs md:text-sm text-muted-foreground font-medium">Resetting password for</p>
                  <p className="text-xs md:text-sm font-bold text-primary truncate px-4">{email}</p>
                </div>

                <Form {...resetForm}>
                  <form onSubmit={resetForm.handleSubmit(onResetPassword)} className="space-y-6">
                    <FormField
                      control={resetForm.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Verification Code</FormLabel>
                          <FormControl>
                            <Input placeholder="000000" maxLength={6} {...field} className="h-14 md:h-16 text-center text-2xl md:text-3xl font-black tracking-[0.4em] md:tracking-[0.5em] bg-white/5 border-white/5 rounded-xl md:rounded-2xl" />
                          </FormControl>
                          <FormMessage className="text-[9px] md:text-[10px] font-bold" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={resetForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">New Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input type={passwordVisible ? 'text' : 'password'} placeholder="••••••••" {...field} className="h-12 md:h-14 bg-white/5 border-white/5 rounded-xl md:rounded-2xl pr-12 text-sm md:text-base" />
                              <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                {passwordVisible ? <EyeOff className="h-4 md:h-5 w-4 md:w-5" /> : <Eye className="h-4 md:h-5 w-4 md:w-5" />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-[9px] md:text-[10px] font-bold" />
                        </FormItem>
                      )}
                    />
                    <div className="space-y-4">
                      <Button type="submit" disabled={isLoading} className="h-14 md:h-16 w-full bg-primary font-black text-base md:text-lg rounded-xl md:rounded-2xl btn-glow">
                        {isLoading ? <Loader2 className="animate-spin h-4 md:h-5 w-4 md:w-5 mr-2" /> : <CheckCircle2 className="h-4 md:h-5 w-4 md:w-5 mr-2" />}
                        Update Password
                      </Button>
                      <button type="button" onClick={handleResend} disabled={isResending} className="w-full text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary flex items-center justify-center gap-2 hover:opacity-80 disabled:opacity-50">
                        {isResending ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                        Resend Code
                      </button>
                    </div>
                  </form>
                </Form>
              </motion.div>
            ) : (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                <div className="h-16 md:h-20 w-16 md:w-20 rounded-2xl md:rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-8">
                  <CheckCircle2 className="h-8 md:h-10 w-8 md:w-10 text-emerald-400" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-4">Password Reset</h2>
                <p className="text-xs md:text-sm text-muted-foreground mb-10 leading-relaxed">
                  Your identity has been verified and your password has been updated. You can now securely sign in to the studio.
                </p>
                <Button asChild className="h-14 md:h-16 w-full bg-white text-black font-black text-base md:text-lg rounded-xl md:rounded-2xl hover:bg-white/90">
                  <Link href="/login">Return to Login</Link>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {step !== 'success' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 text-center">
            <Link href="/login" className="inline-flex items-center text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-white transition-colors">
              <ChevronLeft className="h-4 w-4 mr-2" /> Back to Sign In
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}