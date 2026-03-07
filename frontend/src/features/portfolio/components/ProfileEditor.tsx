import React, { useState, useEffect } from 'react';
import { User, Save, Loader2, Link as LinkIcon, Github, Linkedin, BadgeHelp, LayoutTemplate, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getProfile, updateProfile, generateAiBio, type Profile } from '../profileApi';
import { toast } from 'sonner';

export const ProfileEditor = () => {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfile();
                setProfile(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleGenerateAI = async () => {
        if (!profile?.bio) {
            toast.error('Write something first so AI can improve it!');
            return;
        }
        setGenerating(true);
        try {
            const { bio } = await generateAiBio(profile.bio);
            if (bio.startsWith('AI Error:')) {
                toast.error(bio);
            } else {
                setProfile({ ...profile, bio });
                toast.success('Bio improved by AI! ✨');
            }
        } catch (err) {
            toast.error('AI is currently unavailable');
        } finally {
            setGenerating(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;
        setSaving(true);
        try {
            await updateProfile(profile);
            toast.success('Profile identity synced!');
        } catch (err) {
            toast.error('Failed to sync profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-6 flex justify-center"><Loader2 className="animate-spin text-sky-400" /></div>;

    return (
        <section className="space-y-6">
            <Card className="border-none shadow-sm bg-white dark:bg-black p-2">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-900/20">
                        <User className="text-sky-400" size={24} />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-black tracking-tight uppercase">Public Profile</CardTitle>
                        <CardDescription className="text-sm text-gray-400 font-medium tracking-tight">Global portfolio settings and identity</CardDescription>
                    </div>
                </CardHeader>
            </Card>

            <form onSubmit={handleSubmit}>
                <Card className="border-none shadow-sm bg-white dark:bg-black p-4">
                    <CardContent className="space-y-8 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            {/* Identity */}
                            <div className="md:col-span-2 flex items-center gap-2 mb-2">
                                <BadgeHelp size={16} className="text-sky-400" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Identity & Contact</h3>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1">Full Name</Label>
                                <Input
                                    value={profile?.full_name}
                                    onChange={(e) => setProfile({ ...profile!, full_name: e.target.value })}
                                    className="bg-gray-50/50 dark:bg-black/50 border-gray-100 dark:border-white/10 h-12 text-sm font-bold focus-visible:ring-sky-400"
                                    placeholder="Your Name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1">Email / Contact</Label>
                                <Input
                                    value={profile?.email}
                                    onChange={(e) => setProfile({ ...profile!, email: e.target.value })}
                                    className="bg-gray-50/50 dark:bg-black/50 border-gray-100 dark:border-white/10 h-12 text-sm font-bold focus-visible:ring-sky-400"
                                    placeholder="hello@example.com"
                                />
                            </div>

                            {/* Content */}
                            <div className="md:col-span-2 flex items-center gap-2 mb-2 mt-4">
                                <LayoutTemplate size={16} className="text-sky-400" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Branding Content</h3>
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1">Hero Title</Label>
                                <Input
                                    value={profile?.title}
                                    onChange={(e) => setProfile({ ...profile!, title: e.target.value })}
                                    className="bg-gray-50/50 dark:bg-black/50 border-gray-100 dark:border-white/10 h-12 text-sm font-black focus-visible:ring-sky-400"
                                    placeholder="e.g. Design. Code. Scale."
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1">About Me / Bio</Label>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleGenerateAI}
                                        disabled={generating}
                                        className="h-7 px-2 text-[8px] font-black uppercase tracking-widest text-sky-400 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20"
                                    >
                                        {generating ? <Loader2 size={10} className="animate-spin mr-1" /> : <Sparkles size={10} className="mr-1" />}
                                        Magic AI Improve
                                    </Button>
                                </div>
                                <Textarea
                                    value={profile?.bio}
                                    onChange={(e) => setProfile({ ...profile!, bio: e.target.value })}
                                    className="bg-gray-50/50 dark:bg-black/50 border-gray-100 dark:border-white/10 min-h-[120px] text-sm focus-visible:ring-sky-400 resize-none"
                                    placeholder="Tell your story..."
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1">Avatar Image URL</Label>
                                <Input
                                    value={profile?.avatar_url}
                                    onChange={(e) => setProfile({ ...profile!, avatar_url: e.target.value })}
                                    className="bg-gray-50/50 dark:bg-black/50 border-gray-100 dark:border-white/10 h-12 text-sm font-bold focus-visible:ring-sky-400"
                                    placeholder="https://..."
                                />
                            </div>

                            {/* Links */}
                            <div className="md:col-span-2 flex items-center gap-2 mb-2 mt-4">
                                <LinkIcon size={16} className="text-sky-400" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Social Links</h3>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1">GitHub URL</Label>
                                <div className="relative group">
                                    <Github size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-sky-400 transition-colors" />
                                    <Input
                                        value={profile?.github_url}
                                        onChange={(e) => setProfile({ ...profile!, github_url: e.target.value })}
                                        className="bg-gray-50/50 dark:bg-black/50 border-gray-100 dark:border-white/10 pl-11 h-12 text-sm font-bold focus-visible:ring-sky-400"
                                        placeholder="#"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1">LinkedIn URL</Label>
                                <div className="relative group">
                                    <Linkedin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-sky-400 transition-colors" />
                                    <Input
                                        value={profile?.linkedin_url}
                                        onChange={(e) => setProfile({ ...profile!, linkedin_url: e.target.value })}
                                        className="bg-gray-50/50 dark:bg-black/50 border-gray-100 dark:border-white/10 pl-11 h-12 text-sm font-bold focus-visible:ring-sky-400"
                                        placeholder="#"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                disabled={saving}
                                className="w-full h-14 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-xs rounded-xl transition-all hover:bg-sky-400 dark:hover:bg-sky-400 dark:hover:text-white flex items-center justify-center gap-2"
                            >
                                {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                Sync Profile to Cloud
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </section>
    );
};
