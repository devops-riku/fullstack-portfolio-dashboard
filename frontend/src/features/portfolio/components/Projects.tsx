import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Github, ExternalLink, Image as ImageIcon, Maximize2, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SectionHeader } from './SectionHeader';
import { ProjectSkeleton } from './Skeletons';
import type { Project } from '../../projects/api';

interface ProjectsProps {
  projects: Project[];
  loading: boolean;
  onOpen: (p: Project) => void;
}

export const Projects = ({ projects, loading, onOpen }: ProjectsProps) => {
  const [activeTag, setActiveTag] = useState<string>('all');
  const [query, setQuery] = useState('');

  // Guard against a non-array body on a 200, matching the original page.
  // Wrapped in useMemo so deps arrays below track a stable reference.
  const safeProjects = useMemo(
    () => (Array.isArray(projects) ? projects : []),
    [projects]
  );

  const tags = useMemo(() => {
    const set = new Set<string>();
    safeProjects.forEach((p) => (p.tags || []).forEach((t) => set.add(t)));
    return ['all', ...Array.from(set)];
  }, [safeProjects]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return safeProjects.filter((p) => {
      const tagOk = activeTag === 'all' || (p.tags || []).includes(activeTag);
      const textOk = !q ||
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(q));
      return tagOk && textOk;
    });
  }, [safeProjects, activeTag, query]);

  return (
    <motion.section
      id="projects"
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="scroll-mt-32"
    >
      <SectionHeader index="02" title="Selected Work" />

      {!loading && safeProjects.length > 0 && (
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`rounded-lg px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                  activeTag === tag
                    ? 'bg-sky-400 text-white'
                    : 'bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-sky-400'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              aria-label="Search projects"
              className="h-9 w-full md:w-56 rounded-lg border border-gray-200 dark:border-white/10 bg-transparent pl-9 pr-3 font-mono text-xs outline-none placeholder:text-gray-400 focus:border-sky-400/50"
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProjectSkeleton /><ProjectSkeleton />
        </div>
      ) : filtered.length > 0 ? (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="group overflow-hidden rounded-3xl border-gray-200 dark:border-white/10 bg-gray-50/30 dark:bg-white/5 shadow-none transition-all duration-500 hover:border-sky-400/30 hover:shadow-2xl hover:shadow-sky-400/5">
                  <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-900">
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="h-full w-full cursor-zoom-in object-cover transition-transform duration-700 group-hover:scale-110"
                        onClick={() => onOpen(project)}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ImageIcon className="text-gray-300 dark:text-gray-700" size={40} />
                      </div>
                    )}
                    <div className="absolute right-4 top-4 flex translate-y-2 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      {project.image_url && (
                        <Button size="icon" onClick={() => onOpen(project)} className="h-10 w-10 rounded-xl bg-white/90 text-black shadow-xl hover:bg-sky-400 dark:bg-black/90 dark:text-white" title="Full view">
                          <Maximize2 size={16} />
                        </Button>
                      )}
                      {project.github_link && (
                        <Button size="icon" asChild className="h-10 w-10 rounded-xl bg-white/90 text-black shadow-xl hover:bg-sky-400 dark:bg-black/90 dark:text-white">
                          <a href={project.github_link} target="_blank" rel="noopener noreferrer"><Github size={16} /></a>
                        </Button>
                      )}
                      {project.github_link && (
                        <Button size="icon" asChild className="h-10 w-10 rounded-xl bg-sky-400 text-white shadow-xl hover:bg-sky-500">
                          <a href={project.github_link} target="_blank" rel="noopener noreferrer"><ExternalLink size={16} /></a>
                        </Button>
                      )}
                    </div>
                  </div>
                  <CardContent className="space-y-4 p-6">
                    <div className="space-y-1">
                      <h3 className="font-display text-base font-extrabold uppercase tracking-tight text-ink dark:text-paper transition-colors group-hover:text-sky-400">{project.title}</h3>
                      <p className="line-clamp-2 text-xs font-medium leading-relaxed text-gray-500 dark:text-gray-400">{project.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {project.tags?.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="rounded-lg border-none bg-gray-100 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-gray-400 dark:bg-white/5">{tag}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="rounded-3xl border-2 border-dashed border-gray-200 py-20 text-center dark:border-white/10">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-gray-400">
            {safeProjects.length === 0 ? 'Workshop is currently empty' : 'No projects match'}
          </p>
        </div>
      )}
    </motion.section>
  );
};
