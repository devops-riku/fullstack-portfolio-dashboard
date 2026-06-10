import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Briefcase, Loader2, X, Edit2, Calendar, Building2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { getExperiences, createExperience, deleteExperience, updateExperience, type Experience, type ExperienceCreate } from '../api';
import { toast } from 'sonner';

export const ExperienceList = () => {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formExp, setFormExp] = useState<ExperienceCreate>({
        role: '',
        company: '',
        period: '',
        description: '',
    });

    const fetchExperiences = async () => {
        try {
            const data = await getExperiences();
            setExperiences(data);
        } catch (err) {
            console.error('Failed to fetch experiences', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExperiences();
        const onRefresh = () => fetchExperiences();
        window.addEventListener('cms:refresh', onRefresh);
        return () => window.removeEventListener('cms:refresh', onRefresh);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingId) {
                await updateExperience(editingId, formExp);
            } else {
                await createExperience(formExp);
            }
            resetForm();
            fetchExperiences();
            toast.success(editingId ? 'Experience updated' : 'Experience added');
        } catch {
            toast.error('Failed to save experience');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (exp: Experience) => {
        setFormExp({
            role: exp.role,
            company: exp.company,
            period: exp.period,
            description: exp.description
        });
        setEditingId(exp.id);
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Delete this experience?')) {
            try {
                await deleteExperience(id);
                fetchExperiences();
                toast.success('Experience deleted');
            } catch {
                toast.error('Failed to delete experience');
            }
        }
    };

    const resetForm = () => {
        setFormExp({ role: '', company: '', period: '', description: '' });
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <div className="space-y-6">
            <Card className="glass border-none shadow-sm bg-white dark:bg-surface-elevated rounded-2xl p-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-400/10 ring-1 ring-sky-400/20">
                            <Briefcase className="text-sky-400" size={24} />
                        </div>
                        <div>
                            <span className="block font-mono text-[10px] tracking-[0.25em] text-sky-400/80 uppercase mb-1">04 — Career</span>
                            <CardTitle className="text-xl font-black tracking-tight uppercase">Experience</CardTitle>
                            <CardDescription className="text-sm text-gray-400 font-medium tracking-tight">Your professional timeline</CardDescription>
                        </div>
                    </div>
                    <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => showForm ? resetForm() : setShowForm(true)}
                        className="rounded-xl bg-sky-400 hover:bg-sky-500 text-white border-none shadow-lg shadow-sky-400/30 hover:shadow-sky-400/40 h-10 w-10 transition-all active:scale-95 hover:-translate-y-0.5"
                    >
                        {showForm ? <X size={20} /> : <Plus size={20} />}
                    </Button>
                </CardHeader>
            </Card>

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden"
                    >
                        <Card className="glass border-none shadow-sm bg-gray-50/50 dark:bg-surface rounded-2xl overflow-hidden">
                            <CardContent className="p-6">
                                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1">Role</Label>
                                        <div className="relative group">
                                            <Briefcase size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-sky-400 transition-colors" />
                                            <Input
                                                required
                                                value={formExp.role}
                                                onChange={(e) => setFormExp({ ...formExp, role: e.target.value })}
                                                className="bg-white dark:bg-surface-elevated border-gray-100 dark:border-white/10 h-12 pl-11 text-sm font-bold focus-visible:ring-sky-400 transition-shadow"
                                                placeholder="e.g. Lead Dev"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1">Company</Label>
                                        <div className="relative group">
                                            <Building2 size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-sky-400 transition-colors" />
                                            <Input
                                                required
                                                value={formExp.company}
                                                onChange={(e) => setFormExp({ ...formExp, company: e.target.value })}
                                                className="bg-white dark:bg-surface-elevated border-gray-100 dark:border-white/10 h-12 pl-11 text-sm font-bold focus-visible:ring-sky-400 transition-shadow"
                                                placeholder="Company Name"
                                            />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1">Period</Label>
                                        <div className="relative group">
                                            <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-sky-400 transition-colors" />
                                            <Input
                                                required
                                                value={formExp.period}
                                                onChange={(e) => setFormExp({ ...formExp, period: e.target.value })}
                                                className="bg-white dark:bg-surface-elevated border-gray-100 dark:border-white/10 h-12 pl-11 text-sm font-bold focus-visible:ring-sky-400 transition-shadow"
                                                placeholder="e.g. 2022 - Present"
                                            />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1">Description</Label>
                                        <Textarea
                                            required
                                            value={formExp.description}
                                            onChange={(e) => setFormExp({ ...formExp, description: e.target.value })}
                                            className="bg-white dark:bg-surface-elevated border-gray-100 dark:border-white/10 min-h-[100px] text-sm focus-visible:ring-sky-400 resize-none transition-shadow"
                                            placeholder="What did you do there?"
                                        />
                                    </div>
                                    <Button
                                        disabled={isSubmitting}
                                        className="md:col-span-2 h-14 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-sky-400 dark:hover:bg-sky-400 dark:hover:text-white mt-2 transition-all active:scale-[0.99] hover:shadow-lg hover:shadow-sky-400/20"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : (editingId ? 'Update Experience' : 'Add Experience')}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 gap-3 mt-6">
                {loading ? (
                    <div className="py-10 flex justify-center"><Loader2 className="animate-spin text-sky-400" size={32} /></div>
                ) : experiences.map((exp) => (
                    <Card key={exp.id} className="group border border-transparent dark:border-white/5 shadow-sm bg-white dark:bg-surface hover:bg-gray-50/50 dark:hover:bg-surface-elevated hover:border-sky-400/20 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden rounded-2xl">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-surface-elevated border border-gray-100 dark:border-white/5 flex items-center justify-center shrink-0 shadow-inner">
                                    <Building2 className="text-sky-400" size={18} />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-sm font-black uppercase tracking-tight text-black dark:text-white truncate">{exp.role}</h3>
                                    <p className="text-[9px] text-sky-400 font-black uppercase tracking-widest truncate">{exp.company} • {exp.period}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(exp)} className="h-9 w-9 text-gray-400 hover:text-sky-400 transition-colors">
                                    <Edit2 size={16} />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(exp.id)} className="h-9 w-9 text-gray-400 hover:text-red-500 transition-colors">
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {!loading && experiences.length === 0 && (
                    <Card className="border-dashed bg-transparent border-gray-200 dark:border-white/10 rounded-2xl">
                        <CardContent className="py-16 text-center">
                            <p className="font-mono text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Professional path is empty</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};
