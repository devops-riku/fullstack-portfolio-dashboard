import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Loader2, Image as ImageIcon, LayoutTemplate, Edit2, X, Save, ExternalLink, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { getProjects, deleteProject, createProject, updateProject, type Project, type ProjectCreate } from '../../projects/api';

export const DashboardProjects = () => {
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
    tags: [],
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
      tags: project.tags || [],
    });
    setEditingId(project.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this project?')) {
      try {
        await deleteProject(id);
        setProjects(projects.filter((p) => p.id !== id));
        toast.success('Project deleted');
      } catch {
        toast.error('Failed to delete project');
      }
    }
  };

  const resetForm = () => {
    setFormProject({ title: '', description: '', image_url: '', github_link: '', highlights: [], tags: [] });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Page header */}
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-sky-400 mb-1">02 / Projects</p>
        <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-white">Projects</h1>
        <p className="mt-2 text-sm text-gray-400">Manage your public work portfolio.</p>
      </div>

      {/* Section card */}
      <Card className="border border-white/5 shadow-none bg-white/5 rounded-2xl p-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-sky-400/10 ring-1 ring-sky-400/20">
              <LayoutTemplate className="text-sky-400" size={22} />
            </div>
            <div>
              <CardTitle className="font-display text-lg font-extrabold tracking-tight uppercase text-white">Work Portfolio</CardTitle>
              <CardDescription className="text-sm text-gray-500 font-medium">
                {projects.length} {projects.length === 1 ? 'project' : 'projects'}
              </CardDescription>
            </div>
          </div>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => (showForm ? resetForm() : setShowForm(true))}
            className="rounded-xl bg-sky-400 hover:bg-sky-500 text-white border-none shadow-lg shadow-sky-400/30 h-10 w-10 transition-all active:scale-95"
          >
            {showForm ? <X size={18} /> : <Plus size={18} />}
          </Button>
        </CardHeader>
      </Card>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="border border-white/5 bg-white/5 rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="space-y-2">
                    <Label className="font-mono text-[10px] font-semibold uppercase tracking-wider text-gray-400 ml-1">Title</Label>
                    <Input
                      required
                      value={formProject.title}
                      onChange={(e) => setFormProject({ ...formProject, title: e.target.value })}
                      className="bg-white/5 border-white/10 h-12 text-sm font-bold text-white focus-visible:ring-sky-400"
                      placeholder="Project Title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-mono text-[10px] font-semibold uppercase tracking-wider text-gray-400 ml-1">Image URL</Label>
                    <div className="relative group">
                      <ImageIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-sky-400 transition-colors" />
                      <Input
                        value={formProject.image_url}
                        onChange={(e) => setFormProject({ ...formProject, image_url: e.target.value })}
                        className="bg-white/5 border-white/10 pl-11 h-12 text-sm font-bold text-white focus-visible:ring-sky-400"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label className="font-mono text-[10px] font-semibold uppercase tracking-wider text-gray-400 ml-1">Description</Label>
                    <Textarea
                      required
                      value={formProject.description}
                      onChange={(e) => setFormProject({ ...formProject, description: e.target.value })}
                      className="bg-white/5 border-white/10 min-h-[100px] text-sm text-white focus-visible:ring-sky-400 resize-none"
                      placeholder="Brief description..."
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label className="font-mono text-[10px] font-semibold uppercase tracking-wider text-gray-400 ml-1">GitHub / Demo Link</Label>
                    <div className="relative group">
                      <Github size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-sky-400 transition-colors" />
                      <Input
                        value={formProject.github_link}
                        onChange={(e) => setFormProject({ ...formProject, github_link: e.target.value })}
                        className="bg-white/5 border-white/10 pl-11 h-12 text-sm font-bold text-white focus-visible:ring-sky-400"
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="md:col-span-2 h-14 rounded-xl bg-sky-400 hover:bg-sky-500 text-white font-mono text-xs font-semibold uppercase tracking-widest mt-2 transition-all active:scale-[0.99]"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin mr-2" size={16} /> : (editingId ? <Save size={16} className="mr-2" /> : <Plus size={16} className="mr-2" />)}
                    {editingId ? 'Update Project' : 'Publish Project'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project list */}
      <div className="grid grid-cols-1 gap-3">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-sky-400" size={28} />
          </div>
        ) : projects.length > 0 ? (
          projects.map((project) => (
            <Card
              key={project.id}
              className="group border border-white/5 bg-white/5 hover:border-sky-400/20 hover:bg-white/8 hover:-translate-y-0.5 transition-all duration-300 rounded-2xl overflow-hidden"
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/5 overflow-hidden flex items-center justify-center shrink-0">
                    {project.image_url ? (
                      <img src={project.image_url} className="w-full h-full object-cover transition-transform duration-500 scale-110 group-hover:scale-100" alt={project.title} />
                    ) : (
                      <ImageIcon size={18} className="text-gray-600 group-hover:text-sky-400 transition-colors" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-sm font-black uppercase tracking-tight truncate text-white">{project.title}</h3>
                      {project.github_link && (
                        <Badge variant="outline" className="text-[8px] h-4 py-0 font-black uppercase border-sky-400/20 text-sky-400 bg-sky-400/5">Live</Badge>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500 font-medium truncate max-w-sm">{project.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  {project.github_link && (
                    <Button variant="ghost" size="icon" asChild className="h-9 w-9 text-gray-500 hover:text-sky-400">
                      <a href={project.github_link} target="_blank" rel="noopener noreferrer"><ExternalLink size={15} /></a>
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(project)} className="h-9 w-9 text-gray-500 hover:text-sky-400">
                    <Edit2 size={15} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(project.id)} className="h-9 w-9 text-gray-500 hover:text-red-400">
                    <Trash2 size={15} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-dashed border-white/10 bg-transparent rounded-2xl">
            <CardContent className="py-20 text-center">
              <p className="font-mono text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">No projects yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
