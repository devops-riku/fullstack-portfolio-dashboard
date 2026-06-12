import { useEffect, useState } from 'react';
import { getMe, updateMe, type User } from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User as UserIcon, Mail, Loader2, Save, Key, UserIcon as EditUser, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export const UserProfile = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

    const [fullName, setFullName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [updatingProfile, setUpdatingProfile] = useState(false);
    const [updatingEmail, setUpdatingEmail] = useState(false);
    const [updatingPassword, setUpdatingPassword] = useState(false);

    useEffect(() => {
        getMe()
            .then(u => {
                setUser(u);
                setFullName(u.full_name || '');
                setNewEmail(u.email);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdatingProfile(true);
        try {
            const updated = await updateMe({ full_name: fullName });
            setUser(updated);
            toast.success('Full name updated successfully');
        } catch {
            toast.error('Failed to update profile');
        } finally {
            setUpdatingProfile(false);
        }
    };

    const handleUpdateEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newEmail === user?.email) return;
        setUpdatingEmail(true);
        try {
            await updateMe({ email: newEmail });
            localStorage.removeItem('token');
            window.location.href = '/login';
        } catch {
            toast.error('Failed to update email. It might already be in use.');
        } finally {
            setUpdatingEmail(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPassword) return;
        setUpdatingPassword(true);
        try {
            await updateMe({ password: newPassword });
            setNewPassword('');
            toast.success('Password updated successfully');
        } catch {
            toast.error('Failed to update password');
        } finally {
            setUpdatingPassword(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-sky-400" size={32} />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-12 text-center">
                <p className="text-gray-400 font-black uppercase tracking-widest">User not found</p>
            </div>
        );
    }

    const initials = user.full_name
        ? user.full_name.charAt(0).toUpperCase()
        : user.email.charAt(0).toUpperCase();

    const tabs = [
        { id: 'profile', name: 'Identity', icon: UserIcon },
        { id: 'security', name: 'Security', icon: ShieldCheck }
    ];

    return (
        <div className="p-6 max-w-2xl mx-auto space-y-8">
            {/* COMPACT HEADER */}
            <div className="flex items-center gap-4 bg-white/50 dark:bg-black/50 backdrop-blur-md p-6 rounded-[2.5rem] border border-gray-100 dark:border-white/5">
                <div className="relative group shrink-0">
                    <div className="absolute inset-0 bg-sky-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all"></div>
                    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-white/10 rounded-full flex items-center justify-center text-xl text-sky-400 font-black shadow-inner relative z-10">
                        {initials}
                    </div>
                </div>
                <div>
                    <h1 className="font-display text-xl font-black uppercase tracking-tight text-ink dark:text-paper">
                        {user.full_name || 'Anonymous'}
                    </h1>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Mail size={12} className="text-sky-400" />
                        {user.email}
                    </div>
                </div>
            </div>

            {/* MINIMAL TAB NAVIGATION */}
            <div className="flex p-1 bg-gray-50 dark:bg-white/5 rounded-2xl w-fit mx-auto md:mx-0 border border-gray-100 dark:border-white/10">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as 'profile' | 'security')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${isActive ? 'text-black dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="tab-active"
                                    className="absolute inset-0 bg-white dark:bg-white/10 rounded-xl shadow-sm z-0"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <Icon size={14} className={`relative z-10 ${isActive ? 'text-sky-400' : ''}`} />
                            <span className="relative z-10">{tab.name}</span>
                        </button>
                    );
                })}
            </div>

            {/* TAB CONTENT */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'profile' ? (
                        <Card className="border-none shadow-sm bg-white dark:bg-black p-4 md:p-8 rounded-[2rem]">
                            <CardHeader className="px-0 pt-0">
                                <CardTitle className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-6">Profile Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="px-0 pb-0">
                                <form onSubmit={handleUpdateProfile} className="space-y-6">
                                    <div className="space-y-3">
                                        <Label className="font-mono text-[10px] font-semibold uppercase tracking-wider text-gray-400 ml-1">Full Identity Name</Label>
                                        <div className="relative group">
                                            <EditUser size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-sky-400 transition-colors" />
                                            <Input
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                className="bg-gray-50 dark:bg-gray-900 border-none h-14 pl-12 text-sm font-bold focus-visible:ring-sky-400 rounded-xl"
                                                placeholder="Enter full name"
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={updatingProfile}
                                        className="h-14 px-8 rounded-xl bg-ink dark:bg-paper text-paper dark:text-ink font-mono text-xs font-semibold uppercase tracking-widest hover:bg-sky-400 hover:text-white transition-all shadow-xl shadow-sky-500/10 active:scale-95"
                                    >
                                        {updatingProfile ? <Loader2 className="animate-spin" size={16} /> : <><Save className="mr-2" size={16} /> Save Changes</>}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-none shadow-sm bg-white dark:bg-black p-4 md:p-8 rounded-[2rem]">
                            <CardHeader className="px-0 pt-0">
                                <CardTitle className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-6">Credential Management</CardTitle>
                            </CardHeader>
                            <CardContent className="px-0 pb-0 space-y-10">
                                <form onSubmit={handleUpdateEmail} className="space-y-6">
                                    <div className="space-y-3">
                                        <Label className="font-mono text-[10px] font-semibold uppercase tracking-wider text-gray-400 ml-1">Primary Email Access</Label>
                                        <div className="relative group">
                                            <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-sky-400 transition-colors" />
                                            <Input
                                                type="email"
                                                value={newEmail}
                                                onChange={(e) => setNewEmail(e.target.value)}
                                                className="bg-gray-50 dark:bg-gray-900 border-none h-14 pl-12 text-sm font-bold focus-visible:ring-sky-400 rounded-xl"
                                                placeholder="New contact email"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                                        <Button
                                            type="submit"
                                            disabled={updatingEmail || newEmail === user.email}
                                            className="h-14 px-8 rounded-xl bg-ink dark:bg-paper text-paper dark:text-ink font-mono text-xs font-semibold uppercase tracking-widest hover:bg-sky-400 hover:text-white transition-all shadow-xl shadow-sky-500/10 active:scale-95"
                                        >
                                            {updatingEmail ? <Loader2 className="animate-spin" size={16} /> : <><Mail className="mr-2" size={16} /> Update Primary Email</>}
                                        </Button>
                                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed max-w-[150px]">
                                            Changing email will require a new session login.
                                        </p>
                                    </div>
                                </form>

                                <div className="h-px bg-gray-100 dark:bg-white/5" />

                                <form onSubmit={handleUpdatePassword} className="space-y-6">
                                    <div className="space-y-3">
                                        <Label className="font-mono text-[10px] font-semibold uppercase tracking-wider text-gray-400 ml-1">Update Security Key</Label>
                                        <div className="relative group">
                                            <Key size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-sky-400 transition-colors" />
                                            <Input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="bg-gray-50 dark:bg-gray-900 border-none h-14 pl-12 text-sm font-bold focus-visible:ring-sky-400 rounded-xl"
                                                placeholder="••••••••••••"
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={updatingPassword || !newPassword}
                                        className="h-14 px-8 rounded-xl bg-ink dark:bg-paper text-paper dark:text-ink font-mono text-xs font-semibold uppercase tracking-widest hover:bg-sky-400 hover:text-white transition-all shadow-xl shadow-sky-500/10 active:scale-95"
                                    >
                                        {updatingPassword ? <Loader2 className="animate-spin" size={16} /> : <><Key className="mr-2" size={16} /> Change Password</>}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
