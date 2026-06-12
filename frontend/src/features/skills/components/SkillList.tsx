import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Trash2, X, Loader2, Edit2, Wrench, Box
} from 'lucide-react';
import { Icon } from '@iconify/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { getSkills, createSkill, deleteSkill, updateSkill, type Skill, type SkillCreate } from '../api';
import { IconPicker } from '@/shared/components/IconPicker';
import { toast } from 'sonner';


export const SkillList = () => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPickerOpen, setIsPickerOpen] = useState(false);

    const [formSkill, setFormSkill] = useState<SkillCreate>({
        name: '',
        icon_name: 'code',
        category: '',
    });

    const fetchSkills = async () => {
        try {
            const data = await getSkills();
            setSkills(data);
        } catch (err) {
            console.error('Failed to fetch skills', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (editingId) {
                await updateSkill(editingId, formSkill);
            } else {
                await createSkill(formSkill);
            }
            setFormSkill({ name: '', icon_name: 'code', category: '' });
            setShowForm(false);
            setEditingId(null);
            fetchSkills();
        } catch {
            toast.error('Failed to save skill');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (skill: Skill) => {
        setFormSkill({
            name: skill.name,
            icon_name: skill.icon_name,
            category: skill.category || ''
        });
        setEditingId(skill.id);
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Delete this skill?')) {
            try {
                await deleteSkill(id);
                fetchSkills();
            } catch {
                toast.error('Failed to delete skill');
            }
        }
    };

    const resetForm = () => {
        setFormSkill({ name: '', icon_name: 'code', category: '' });
        setEditingId(null);
        setShowForm(false);
    };

    const categories = [
        { id: 'frontend', name: 'Frontend', color: 'text-sky-400 bg-sky-400/10' },
        { id: 'backend', name: 'Backend', color: 'text-emerald-400 bg-emerald-400/10' },
        { id: 'devops', name: 'DevOps / Cloud', color: 'text-purple-400 bg-purple-400/10' },
    ];

    return (
        <div className="space-y-6">
            <Card className="border-none shadow-sm bg-white dark:bg-black p-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-900/20">
                            <Wrench className="text-sky-400" size={24} />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-black tracking-tight uppercase">Tech Stack</CardTitle>
                            <CardDescription className="text-sm text-gray-400 font-medium tracking-tight">Tools and technologies you use</CardDescription>
                        </div>
                    </div>
                    <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => showForm ? resetForm() : setShowForm(true)}
                        className="rounded-xl bg-sky-400 hover:bg-sky-500 text-white border-none shadow-lg shadow-sky-400/20 h-10 w-10 transition-all active:scale-95"
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
                        <Card className="border-none shadow-sm bg-gray-50/50 dark:bg-black/50 overflow-hidden">
                            <CardContent className="p-6">
                                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1">Tech Name</Label>
                                        <div className="relative group">
                                            <Box size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-sky-400 transition-colors" />
                                            <Input
                                                required
                                                value={formSkill.name}
                                                onChange={(e) => setFormSkill({ ...formSkill, name: e.target.value })}
                                                className="bg-white dark:bg-black border-gray-100 dark:border-white/10 h-12 pl-11 text-sm font-bold focus-visible:ring-sky-400"
                                                placeholder="e.g. React"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1">Logo / Icon</Label>
                                        <Button
                                            type="button"
                                            onClick={() => setIsPickerOpen(true)}
                                            className="w-full h-12 bg-white dark:bg-black border border-gray-100 dark:border-white/10 hover:bg-sky-50 dark:hover:bg-sky-400/10 text-black dark:text-white font-bold group flex justify-between px-4 transition-all hover:scale-[1.01]"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-white/5 group-hover:bg-sky-100 dark:group-hover:bg-sky-400/20 transition-colors">
                                                    <Icon icon={formSkill.icon_name || 'logos:react'} className="text-xl" />
                                                </div>
                                                <span className="text-xs uppercase font-black tracking-widest text-gray-400 group-hover:text-sky-400 transition-colors">
                                                    {formSkill.icon_name.split(':').pop() || 'Select Icon'}
                                                </span>
                                            </div>
                                            <Edit2 size={14} className="text-gray-300 group-hover:text-sky-400" />
                                        </Button>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1">Category</Label>
                                        <Input
                                            required
                                            value={formSkill.category}
                                            onChange={(e) => setFormSkill({ ...formSkill, category: e.target.value })}
                                            className="bg-white dark:bg-black border-gray-100 dark:border-white/10 h-12 text-sm font-bold focus-visible:ring-sky-400"
                                            placeholder="e.g. Frontend, Backend, UI/UX..."
                                        />
                                    </div>

                                    <div className="md:col-span-2 grid grid-cols-2 gap-4 mt-2">
                                        <Button
                                            type="button"
                                            onClick={resetForm}
                                            variant="ghost"
                                            className="h-14 font-black uppercase tracking-widest text-[10px] text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            disabled={isSubmitting}
                                            className="h-14 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-sky-400 dark:hover:bg-sky-400 dark:hover:text-white transition-all shadow-xl shadow-sky-500/10"
                                        >
                                            {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : (editingId ? 'Update Tech' : 'Add to Stack')}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <IconPicker
                isOpen={isPickerOpen}
                onClose={() => setIsPickerOpen(false)}
                onSelect={(icon) => setFormSkill({ ...formSkill, icon_name: icon })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
                {loading ? (
                    <div className="col-span-full py-10 flex justify-center"><Loader2 className="animate-spin text-sky-400" size={32} /></div>
                ) : skills.map((skill) => {
                    const category = categories.find(c => c.id === skill.category.toLowerCase()) || { name: skill.category, color: 'text-sky-400 bg-sky-400/10' };
                    return (
                        <Card key={skill.id} className="group border-none shadow-sm bg-white dark:bg-black hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all overflow-hidden border border-gray-50 dark:border-white/5">
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="p-2.5 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-white/5 flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110">
                                            <Icon icon={skill.icon_name || 'logos:react'} className="text-2xl" />
                                        </div>
                                        <div className="min-w-0">
                                            <span className="block text-xs font-black uppercase tracking-tight text-black dark:text-white truncate">{skill.name}</span>
                                            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md inline-block mt-1 ${category.color}`}>
                                                {category.name}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(skill)} className="h-8 w-8 text-gray-400 hover:text-sky-400 transition-colors">
                                            <Edit2 size={16} />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(skill.id)} className="h-8 w-8 text-gray-400 hover:text-red-500 transition-colors">
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
                {!loading && skills.length === 0 && (
                    <Card className="col-span-full border-dashed bg-transparent border-gray-100 dark:border-white/10">
                        <CardContent className="py-16 text-center">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Tech stack is empty</p>
                        </CardContent>
                    </Card>
                )}
            </div >
        </div >
    );
};
