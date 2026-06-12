import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Lock, Mail, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);

      const { access_token } = await login(params);
      localStorage.setItem('token', access_token);
      navigate('/dashboard');
    } catch {
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-paper dark:bg-ink p-4">
      {/* Aurora glow — dark mode only */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden dark:block"
      >
        <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/20 blur-3xl animate-aurora" />
        <div className="absolute left-1/2 top-1/3 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400/10 blur-3xl animate-aurora" />
      </div>

      <Card className="relative z-10 w-full max-w-md overflow-hidden border-none shadow-2xl bg-white dark:bg-black">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-sky-400 to-transparent opacity-90"></div>

        <CardHeader className="space-y-4 pt-10 pb-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-500 dark:bg-sky-400/10 dark:text-sky-400 animate-pulse-glow">
            <ShieldCheck size={24} />
          </div>
          <div className="space-y-2">
            <CardTitle className="font-display text-2xl font-black uppercase tracking-tight text-ink dark:text-paper">Admin Portal</CardTitle>
            <CardDescription className="text-sm font-medium text-muted-foreground">Enter credentials to manage your portfolio</CardDescription>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/70">
              <span className="text-sky-500 dark:text-sky-400">●</span> Secure Session
            </p>
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="ml-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Email / Username</Label>
              <div className="relative group">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors group-focus-within:text-sky-400" />
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="h-14 border-gray-100 bg-gray-50/50 pl-12 text-sm font-bold transition-shadow focus-visible:ring-sky-400 dark:border-white/10 dark:bg-black/40"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <Label className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Password</Label>
              </div>
              <div className="relative group">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors group-focus-within:text-sky-400" />
                <Input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="h-14 border-gray-100 bg-gray-50/50 pl-12 text-sm font-bold transition-shadow focus-visible:ring-sky-400 dark:border-white/10 dark:bg-black/40"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-14 w-full rounded-xl bg-ink dark:bg-paper text-paper dark:text-ink font-mono text-xs font-semibold uppercase tracking-widest shadow-xl shadow-black/5 transition-all hover:bg-sky-400 hover:text-white active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Unlock Dashboard"}
            </Button>

            <p className="pt-1 text-center font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground/50">
              Encrypted · Admin Access Only
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
