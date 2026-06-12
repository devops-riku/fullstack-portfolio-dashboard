import { useEffect, useState } from 'react';
import { getProjects, deleteProject, createProject, updateProject, type Project, type ProjectCreate } from '../api';
import { Trash2, Plus, Loader2, Image as ImageIcon, LayoutTemplate, Edit2, X, Save, ExternalLink, Github } from 'lucide-react';
import { ExperienceList } from '../../experience/components/ExperienceList';
import { SkillList } from '../../skills/components/SkillList';
import { ProfileEditor } from '../../portfolio/components/ProfileEditor';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { CommandTerminal } from '../../terminal/CommandTerminal';

export const ProjectList = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formProject, setFormProject] = useState<ProjectCreate>({
    title: '',
    description: '',
    image_url: '',
    github_link: '',
    highlights: [],
    tags: []
  });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data);
    } catch {
      console.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    const onRefresh = () => fetchProjects();
    window.addEventListener('cms:refresh', onRefresh);
    return () => window.removeEventListener('cms:refresh', onRefresh);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateProject(editingId, formProject);
      } else {
        await createProject(formProject);
      }
      resetForm();
      fetchProjects();
      toast.success(editingId ? 'Project updated' : 'Project published');
    } catch {
      toast.error('Failed to save project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (project: Project) => {
    setFormProject({
      title: project.title,
      description: project.description,
      image_url: project.image_url,
      github_link: project.github_link,
      highlights: project.highlights || [],
      tags: project.tags || []
    });
    setEditingId(project.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this project?')) {
      try {
        await deleteProject(id);
        setProjects(projects.filter(p => p.id !== id));
        toast.success('Project deleted');
      } catch {
        toast.error('Failed to delete project');
      }
    }
  };

  const resetForm = () => {
    setFormProject({
      title: '',
      description: '',
      image_url: '',
      github_link: '',
      highlights: [],
      tags: []
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-24 py-24">

      {/* 💻 TERMINAL CMS CONSOLE */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 px-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-sky-400">00 — console</span>
          <span className="h-px flex-1 bg-gradient-to-r from-sky-400/30 to-transparent" />
        </div>
        <h2 className="text-2xl font-black tracking-tight uppercase">Command Center</h2>
        <p className="text-sm text-gray-400 font-medium -mt-2">
          Manage everything by command. Type <span className="font-mono text-sky-400">/help</span> to start,
          or press <span className="font-mono text-sky-400">⌘K</span> anywhere.
        </p>
        <CommandTerminal onMutate={fetchProjects} />
      </section>

      {/* 👤 PROFILE SETTINGS */}
      <ProfileEditor />

      {/* 🚀 PROJECTS - COMPACT LIST */}
      <section className="space-y-8">
        <Card className="glass border-none shadow-sm bg-white dark:bg-surface-elevated rounded-2xl p-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-400/10 ring-1 ring-sky-400/20">
                <LayoutTemplate className="text-sky-400" size={24} />
              </div>
              <div>
                <span className="block font-mono text-[10px] tracking-[0.25em] text-sky-400/80 uppercase mb-1">02 — Work</span>
                <CardTitle className="font-display text-xl font-black tracking-tight uppercase">Projects</CardTitle>
                <CardDescription className="text-sm text-gray-400 font-medium tracking-tight">Manage your work portfolio</CardDescription>
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
              animate={{ opacity: 1, height: 'auto', marginTop: 32 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="overflow-hidden"
            >
              <Card className="glass border-none shadow-sm bg-gray-50/50 dark:bg-surface rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="space-y-2">
                      <Label className="font-mono text-[10px] font-semibold uppercase tracking-wider text-gray-400 ml-1">Title</Label>
                      <Input
                        required
                        value={formProject.title}
                        onChange={e => setFormProject({ ...formProject, title: e.target.value })}
                        className="bg-white dark:bg-surface-elevated border-gray-100 dark:border-white/10 h-12 text-sm font-bold focus-visible:ring-sky-400 transition-shadow"
                        placeholder="Project Title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-mono text-[10px] font-semibold uppercase tracking-wider text-gray-400 ml-1">Image URL</Label>
                      <div className="relative group">
                        <ImageIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-sky-400 transition-colors" />
                        <Input
                          value={formProject.image_url}
                          onChange={e => setFormProject({ ...formProject, image_url: e.target.value })}
                          className="bg-white dark:bg-surface-elevated border-gray-100 dark:border-white/10 pl-11 h-12 text-sm font-bold focus-visible:ring-sky-400 transition-shadow"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label className="font-mono text-[10px] font-semibold uppercase tracking-wider text-gray-400 ml-1">Description</Label>
                      <Textarea
                        required
                        value={formProject.description}
                        onChange={e => setFormProject({ ...formProject, description: e.target.value })}
                        className="bg-white dark:bg-surface-elevated border-gray-100 dark:border-white/10 min-h-[100px] text-sm focus-visible:ring-sky-400 resize-none transition-shadow"
                        placeholder="Brief description..."
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label className="font-mono text-[10px] font-semibold uppercase tracking-wider text-gray-400 ml-1">GitHub / Demo Link</Label>
                      <div className="relative group">
                        <Github size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-sky-400 transition-colors" />
                        <Input
                          value={formProject.github_link}
                          onChange={e => setFormProject({ ...formProject, github_link: e.target.value })}
                          className="bg-white dark:bg-surface-elevated border-gray-100 dark:border-white/10 pl-11 h-12 text-sm font-bold focus-visible:ring-sky-400 transition-shadow"
                          placeholder="https://github.com/..."
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="md:col-span-2 h-14 rounded-xl bg-ink dark:bg-paper text-paper dark:text-ink font-mono text-xs font-semibold uppercase tracking-widest hover:bg-sky-400 hover:text-white mt-4 transition-all active:scale-[0.99]"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : (editingId ? <Save size={16} /> : <Plus size={16} />)}
                      {editingId ? 'Update Project' : 'Publish Project'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 gap-3 mt-8">
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-sky-400" size={32} /></div>
          ) : projects.length > 0 ? projects.map(project => (
            <Card key={project.id} className="group border border-transparent dark:border-white/5 shadow-sm bg-white dark:bg-surface hover:bg-gray-50/50 dark:hover:bg-surface-elevated hover:border-sky-400/20 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden rounded-2xl">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-14 h-14 rounded-xl bg-gray-50 dark:bg-surface-elevated border border-gray-100 dark:border-white/5 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                    {project.image_url ? (
                      <img src={project.image_url} className="w-full h-full object-cover transition-all duration-500 scale-110 group-hover:scale-100" />
                    ) : (
                      <ImageIcon size={20} className="text-gray-300 group-hover:text-sky-400 transition-colors" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-sm font-black uppercase tracking-tight truncate text-black dark:text-white">{project.title}</h3>
                      {project.github_link && <Badge variant="outline" className="text-[8px] h-4 py-0 font-black uppercase border-sky-400/20 text-sky-400 bg-sky-400/5">Live</Badge>}
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium truncate max-w-sm">{project.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  {project.github_link && (
                    <Button variant="ghost" size="icon" asChild className="h-9 w-9 text-gray-400 hover:text-sky-400">
                      <a href={project.github_link} target="_blank" rel="noopener noreferrer"><ExternalLink size={16} /></a>
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(project)} className="h-9 w-9 text-gray-400 hover:text-sky-400">
                    <Edit2 size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(project.id)} className="h-9 w-9 text-gray-400 hover:text-red-500">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )) : (
            <Card className="border-dashed bg-transparent border-gray-200 dark:border-white/10 rounded-2xl">
              <CardContent className="py-20 text-center">
                <p className="font-mono text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Zero projects found</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* 🛠️ TECH STACK */}
      <SkillList />

      {/* ⏳ EXPERIENCE */}
      <ExperienceList />

    </div>
  );
};
