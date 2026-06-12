import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Lock, Mail } from 'lucide-react';
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
    <div className="flex min-h-[100dvh] items-center justify-center bg-paper dark:bg-ink p-4">
      <Card className="w-full max-w-md border-none shadow-2xl bg-white dark:bg-black overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600"></div>

        <CardHeader className="space-y-4 pt-10 pb-6 text-center">
          <div className="mx-auto w-12 h-12 bg-sky-50 dark:bg-sky-900/20 rounded-2xl flex items-center justify-center text-sky-400">
            <Lock size={24} />
          </div>
          <div>
            <CardTitle className="font-display text-2xl font-black uppercase tracking-tight text-ink dark:text-paper">Admin Portal</CardTitle>
            <CardDescription className="text-sm font-medium text-gray-400">Enter credentials to manage your portfolio</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="ml-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">Email / Username</Label>
              <div className="relative group">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-sky-400 transition-colors" />
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="bg-gray-50/50 dark:bg-black/50 border-gray-100 dark:border-white/10 h-14 pl-12 text-sm font-bold focus-visible:ring-sky-400"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <Label className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">Password</Label>
              </div>
              <div className="relative group">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-sky-400 transition-colors" />
                <Input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="bg-gray-50/50 dark:bg-black/50 border-gray-100 dark:border-white/10 h-14 pl-12 text-sm font-bold focus-visible:ring-sky-400"
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
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
