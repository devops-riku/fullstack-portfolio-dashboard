import { Terminal, Github, Linkedin, Mail, User, Loader2, Image as ImageIcon, ExternalLink, Maximize2, X } from 'lucide-react';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { getProjects, type Project } from '../../projects/api';
import { getExperiences, type Experience } from '../../experience/api';
import { getSkills, type Skill } from '../../skills/api';
import { getProfile, type Profile as UserProfile } from '../../portfolio/profileApi';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";


export const Portfolio = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);

            // Fetch everything independently so one failure doesn't stop others
            getProjects().then(setProjects).catch(e => console.error("Projects load fail:", e));
            getExperiences().then(setExperiences).catch(e => console.error("Experience load fail:", e));
            getSkills().then(setSkills).catch(e => console.error("Skills load fail:", e));
            getProfile().then(setProfile).catch(e => console.error("Profile load fail:", e));

            // Wait a bit to ensure UI shows something or at least finishes loading state
            setTimeout(() => setLoading(false), 500);
        };
        fetchAll();
    }, []);

    const fadeIn = {
        initial: { opacity: 0, y: 15 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.5 }
    };

    return (
        <div className="bg-white dark:bg-black min-h-screen text-black dark:text-white font-sans selection:bg-sky-100 dark:selection:bg-sky-900/30">

            <div className="max-w-4xl mx-auto px-6 pb-12 pt-0 space-y-24">

                {/* HERO SECTION - COMPACT */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col md:flex-row items-center gap-12 pt-0"
                >
                    <div className="flex-1 space-y-6 text-center md:text-left order-2 md:order-1">
                        <div className="space-y-2">
                            <Badge variant="outline" className="border-sky-400/30 text-sky-400 bg-sky-400/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
                                Available for Projects
                            </Badge>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[0.9] pt-2">
                                {profile?.title || 'Design. Code. Scale.'}
                            </h1>
                        </div>

                        <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-lg leading-relaxed font-medium">
                            Hi! I'm <span className="text-gray-900 dark:text-white font-black">{profile?.full_name || 'Riku'}</span>,{' '}
                            {profile?.bio || 'a Full-Stack Engineer focused on building minimal, high-performance digital products.'}
                        </p>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
                            <Button asChild className="h-12 px-8 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-sky-400 dark:hover:bg-sky-400 dark:hover:text-white transition-all active:scale-95 shadow-lg shadow-black/10">
                                <a href="#contact">Get in touch</a>
                            </Button>
                            <div className="flex items-center gap-2">
                                {profile?.github_url && profile.github_url !== '#' && (
                                    <Button variant="outline" size="icon" asChild className="w-12 h-12 rounded-xl border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 hover:border-sky-400/50 transition-all">
                                        <a href={profile.github_url} target="_blank" rel="noopener noreferrer" title="GitHub"><Github size={18} /></a>
                                    </Button>
                                )}
                                {profile?.linkedin_url && profile.linkedin_url !== '#' && (
                                    <Button variant="outline" size="icon" asChild className="w-12 h-12 rounded-xl border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 hover:border-sky-400/50 transition-all">
                                        <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" title="LinkedIn"><Linkedin size={18} /></a>
                                    </Button>
                                )}
                                {profile?.email && (
                                    <Button variant="outline" size="icon" asChild className="w-12 h-12 rounded-xl border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 hover:border-sky-400/50 transition-all">
                                        <a href={`mailto:${profile.email}`} title="Email"><Mail size={18} /></a>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="w-48 h-48 md:w-56 md:h-56 relative group shrink-0 order-1 md:order-2">
                        <div className="absolute inset-0 bg-sky-400/20 rounded-[2.5rem] blur-2xl group-hover:bg-sky-400/30 transition-all duration-500"></div>
                        <motion.div
                            whileHover={{ rotate: 5, scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="absolute inset-0 bg-white dark:bg-black rounded-[2.5rem] overflow-hidden border-2 border-gray-100 dark:border-white/10 flex items-center justify-center shadow-2xl z-10 p-1"
                        >
                            <div className="w-full h-full rounded-[2.2rem] overflow-hidden bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={80} className="text-gray-200 dark:text-gray-800" />
                                )}
                            </div>
                        </motion.div>
                    </div>
                </motion.section>

                {/* TECH STACK - DYNAMIC CATEGORIES */}
                <motion.section id="stack" {...fadeIn} className="scroll-mt-32 space-y-8">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 px-1">Tech Stack</h2>

                    <div className="space-y-10">
                        {Array.isArray(skills) && Array.from(new Set(skills.map(s => s.category || 'other'))).map(catId => {
                            const catSkills = skills.filter(s => (s.category || 'other') === catId);
                            if (catSkills.length === 0) return null;

                            // Map of standard colors for common categories, fallback to sky-400
                            const colors: Record<string, string> = {
                                frontend: 'text-sky-400',
                                backend: 'text-emerald-400',
                                devops: 'text-purple-400',
                                cloud: 'text-sky-500',
                                mobile: 'text-pink-400'
                            };

                            const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

                            return (
                                <div key={catId} className="space-y-4">
                                    <h3 className={`text-[9px] font-black uppercase tracking-widest px-1 opacity-70 ${colors[catId.toLowerCase()] || 'text-sky-400'}`}>
                                        {capitalize(catId)}
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {catSkills.map((skill) => (
                                            <div
                                                key={skill.id}
                                                className="group"
                                            >
                                                <Badge
                                                    variant="secondary"
                                                    className="px-4 py-2.5 rounded-xl font-bold text-[11px] border border-gray-100 dark:border-white/5 transition-all text-gray-600 dark:text-gray-400 bg-gray-50/50 dark:bg-white/5 hover:border-sky-400/30 hover:text-sky-400 cursor-default flex items-center gap-2.5"
                                                >
                                                    <Icon icon={skill.icon_name || 'ph:code-bold'} className="text-sm" />
                                                    {skill.name}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {(!Array.isArray(skills) || skills.length === 0) && (
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Waiting for tools...</p>
                    )}
                </motion.section>

                {/* PROJECTS - MINIMAL GRID */}
                <motion.section id="projects" {...fadeIn} className="scroll-mt-32">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-10 px-1">Projects</h2>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="animate-spin text-sky-400" size={32} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {Array.isArray(projects) && projects.length > 0 ? projects.map((project) => (
                                <Card
                                    key={project.id}
                                    className="group bg-gray-50/30 dark:bg-white/5 rounded-3xl border-gray-200 dark:border-white/5 hover:border-sky-400/30 transition-all duration-500 overflow-hidden shadow-none hover:shadow-2xl hover:shadow-sky-400/5"
                                >
                                    <div className="h-48 bg-gray-100 dark:bg-gray-900 relative overflow-hidden">
                                        {project.image_url ? (
                                            <img
                                                src={project.image_url}
                                                alt={project.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700 cursor-zoom-in"
                                                onClick={() => setSelectedProject(project)}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ImageIcon className="text-gray-300 dark:text-gray-700" size={40} />
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                            {project.image_url && (
                                                <Button
                                                    size="icon"
                                                    onClick={() => setSelectedProject(project)}
                                                    className="w-10 h-10 bg-white/90 dark:bg-black/90 text-black dark:text-white rounded-xl hover:bg-sky-400 dark:hover:bg-sky-400 shadow-xl"
                                                    title="Full View"
                                                >
                                                    <Maximize2 size={16} />
                                                </Button>
                                            )}
                                            {project.github_link && (
                                                <Button size="icon" asChild className="w-10 h-10 bg-white/90 dark:bg-black/90 text-black dark:text-white rounded-xl hover:bg-sky-400 dark:hover:bg-sky-400 shadow-xl">
                                                    <a href={project.github_link} target="_blank" rel="noopener noreferrer"><Github size={16} /></a>
                                                </Button>
                                            )}
                                            {project.github_link && ( // Assuming live link if github exists for now, or just use same link
                                                <Button size="icon" asChild className="w-10 h-10 bg-sky-400 text-white rounded-xl hover:bg-sky-500 shadow-xl">
                                                    <a href={project.github_link} target="_blank" rel="noopener noreferrer"><ExternalLink size={16} /></a>
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    <CardContent className="p-6 space-y-4">
                                        <div className="space-y-1">
                                            <h3 className="text-base font-black text-black dark:text-white uppercase tracking-tight group-hover:text-sky-400 transition-colors">
                                                {project.title}
                                            </h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 font-medium">
                                                {project.description}
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {project.tags?.slice(0, 3).map(tag => (
                                                <Badge key={tag} variant="secondary" className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 bg-gray-100 dark:bg-white/5 text-gray-400 border-none rounded-lg">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )) : (
                                <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-100 dark:border-white/5 rounded-[2.5rem]">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Workshop is currently empty</p>
                                </div>
                            )}
                        </div>
                    )}
                </motion.section>

                {/* EXPERIENCE - MINIMAL TIMELINE */}
                <motion.section id="experience" {...fadeIn} className="scroll-mt-32">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-10 px-1">Professional Path</h2>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="animate-spin text-sky-400" size={32} />
                        </div>
                    ) : (
                        <div className="space-y-12 ml-4">
                            {Array.isArray(experiences) && experiences.length > 0 ? experiences.map((exp) => (
                                <div key={exp.id} className="group relative pl-12 border-l-2 border-gray-100 dark:border-white/5 py-2">
                                    <div className="absolute left-0 top-4 w-4 h-4 -translate-x-1/2 rounded-full bg-white dark:bg-black border-2 border-gray-200 dark:border-white/10 group-hover:border-sky-400 group-hover:scale-125 transition-all duration-300" />

                                    <div className="space-y-2">
                                        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2">
                                            <h3 className="text-lg font-black text-black dark:text-white uppercase tracking-tight group-hover:text-sky-400 transition-colors">{exp.role}</h3>
                                            <Badge variant="outline" className="text-[9px] font-black text-gray-400 uppercase tracking-widest border-gray-100 dark:border-white/10 rounded-lg h-6">
                                                {exp.period}
                                            </Badge>
                                        </div>
                                        <div className="text-xs font-black text-sky-400 uppercase tracking-widest flex items-center gap-2">
                                            <Terminal size={14} />
                                            {exp.company}
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl font-medium pt-2">
                                            {exp.description}
                                        </p>
                                    </div>
                                </div>
                            )) : (
                                <div className="py-20 text-center border-2 border-dashed border-gray-100 dark:border-white/5 rounded-[2.5rem]">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Timeline is waiting for history</p>
                                </div>
                            )}
                        </div>
                    )}
                </motion.section>

                {/* CONTACT - ULTRA MINIMAL */}
                <motion.section id="contact" {...fadeIn} className="scroll-mt-32 py-24 text-center border-t border-gray-50 dark:border-white/5">
                    <div className="space-y-4 max-w-md mx-auto">
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none">Let's build something.</h2>
                        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium pb-4">
                            Inquiries, collaborations, or just a virtual coffee.
                        </p>
                        <Button asChild size="lg" className="h-16 px-10 bg-sky-400 hover:bg-sky-500 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-xl shadow-sky-400/20 active:scale-95 transition-all">
                            <a href={`mailto:${profile?.email || 'hello@riku.dev'}`}>
                                <Mail className="mr-3" size={18} />
                                Send Message
                            </a>
                        </Button>
                    </div>
                </motion.section>

                <footer className="text-center text-[10px] text-gray-400 font-black tracking-[0.4em] uppercase pb-12 opacity-50">
                    &copy; {new Date().getFullYear()} {profile?.full_name || 'RIKU'} &bull; DESIGNED FOR PERFORMANCE
                </footer>

            </div>

            {/* FULL VIEW IMAGE OVERLAY */}
            <AnimatePresence>
                {selectedProject && selectedProject.image_url && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex flex-col items-center justify-start bg-black/95 backdrop-blur-sm p-4 md:p-10 cursor-zoom-out overflow-y-auto"
                        onClick={() => setSelectedProject(null)}
                    >
                        <motion.button
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all z-[110]"
                            onClick={() => setSelectedProject(null)}
                        >
                            <X size={24} />
                        </motion.button>

                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative max-w-7xl w-full flex-shrink-0 flex flex-col items-center justify-center gap-6 my-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={selectedProject.image_url}
                                alt={selectedProject.title}
                                className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
                            />

                            <div className="max-w-3xl text-center space-y-2 p-4">
                                <h3 className="text-xl md:text-3xl font-black text-white uppercase tracking-tight">
                                    {selectedProject.title}
                                </h3>
                                <p className="text-sm md:text-base text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed">
                                    {selectedProject.description}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
