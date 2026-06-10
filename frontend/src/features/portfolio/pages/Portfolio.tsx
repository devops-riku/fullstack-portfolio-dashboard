import { Terminal, Github, Linkedin, Mail, User, Loader2, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { Icon } from '@iconify/react';
import { useEffect, useState, type ReactNode } from 'react';
import { getProjects, type Project } from '../../projects/api';
import { getExperiences, type Experience } from '../../experience/api';
import { getSkills, type Skill } from '../../skills/api';
import { getProfile, type Profile as UserProfile } from '../../portfolio/profileApi';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// Small muted mono index label for section headers.
const SectionLabel = ({ index, children }: { index: string; children: ReactNode }) => (
    <span className="font-mono text-gray-300 dark:text-gray-600">
        {index} <span className="text-gray-400 dark:text-gray-500">/</span> <span className="text-gray-400 dark:text-gray-400">{children}</span>
    </span>
);

export const Portfolio = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

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

    // Unified smooth easing preset reused across all reveals.
    const ease = [0.22, 1, 0.36, 1] as const;

    const fadeIn = {
        initial: { opacity: 0, y: 15 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6, ease }
    };

    return (
        <div className="bg-white dark:bg-surface min-h-screen text-black dark:text-white font-sans selection:bg-sky-100 dark:selection:bg-sky-900/30">

            <div className="max-w-4xl mx-auto px-6 pb-12 pt-0 space-y-24">

                {/* HERO SECTION - COMPACT */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col md:flex-row items-center gap-12 pt-0"
                >
                    <div className="flex-1 space-y-6 text-center md:text-left order-2 md:order-1">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/5 dark:bg-sky-400/10 px-3 py-1.5 backdrop-blur-sm">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75 animate-ping" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-400" />
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-500 dark:text-sky-400">
                                    Available for Projects
                                </span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.92] pt-1">
                                {profile?.title || 'Design. Code. Secure.'}
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
                        {/* Aurora / grid glow behind the avatar */}
                        <div className="absolute -inset-8 -z-0 pointer-events-none" aria-hidden="true">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-sky-400/30 via-sky-400/10 to-transparent blur-3xl animate-aurora" />
                            <div className="absolute inset-6 rounded-full bg-[radial-gradient(circle_at_30%_30%,theme(colors.sky.400/0.25),transparent_60%)] blur-2xl animate-aurora [animation-delay:-7s]" />
                        </div>
                        <div className="absolute inset-0 bg-sky-400/20 rounded-[2.5rem] blur-2xl group-hover:bg-sky-400/30 transition-all duration-500"></div>
                        <motion.div
                            whileHover={{ rotate: 5, scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="absolute inset-0 glass-strong dark:bg-surface-elevated rounded-[2.5rem] overflow-hidden border-2 border-gray-100 dark:border-white/10 flex items-center justify-center shadow-2xl z-10 p-1"
                        >
                            <div className="w-full h-full rounded-[2.2rem] overflow-hidden bg-gray-50 dark:bg-surface flex items-center justify-center">
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
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 px-1">
                        <SectionLabel index="01">Tech Stack</SectionLabel>
                    </h2>

                    <div className="space-y-10">
                        {Array.from(new Set(skills.map(s => s.category || 'other'))).map(catId => {
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
                                                    className="px-4 py-2.5 rounded-xl font-bold text-[11px] border border-gray-100 dark:border-white/5 dark:bg-surface-elevated bg-gray-50/50 text-gray-600 dark:text-gray-400 cursor-default flex items-center gap-2.5 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-sky-400/40 hover:text-sky-500 dark:hover:text-sky-400 hover:ring-1 hover:ring-sky-400/30 hover:shadow-lg hover:shadow-sky-400/10"
                                                >
                                                    <Icon icon={skill.icon_name || 'ph:code-bold'} className="text-sm transition-all duration-300 group-hover:scale-110 group-hover:text-sky-400 group-hover:drop-shadow-[0_0_6px_theme(colors.sky.400/0.6)]" />
                                                    {skill.name}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {skills.length === 0 && (
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Waiting for tools...</p>
                    )}
                </motion.section>

                {/* PROJECTS - MINIMAL GRID */}
                <motion.section id="projects" {...fadeIn} className="scroll-mt-32">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-10 px-1">
                        <SectionLabel index="02">Projects</SectionLabel>
                    </h2>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="animate-spin text-sky-400" size={32} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {projects.length > 0 ? projects.map((project, index) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-60px" }}
                                    transition={{ duration: 0.6, ease, delay: index * 0.08 }}
                                >
                                <Card
                                    className="group h-full bg-gray-50/30 dark:bg-surface-elevated rounded-3xl border-gray-200 dark:border-white/5 transition-all duration-500 ease-out overflow-hidden shadow-none hover:-translate-y-1.5 hover:border-sky-400/40 hover:shadow-2xl hover:shadow-sky-400/10"
                                >
                                    <div className="h-48 bg-gray-100 dark:bg-surface relative overflow-hidden">
                                        {project.image_url ? (
                                            <img src={project.image_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-sky-100/40 dark:from-surface-elevated dark:via-surface dark:to-sky-950/30 relative">
                                                <div className="absolute inset-0 opacity-[0.07] dark:opacity-[0.12] bg-[linear-gradient(theme(colors.sky.500)_1px,transparent_1px),linear-gradient(90deg,theme(colors.sky.500)_1px,transparent_1px)] bg-[size:22px_22px]" />
                                                <ImageIcon className="relative text-gray-300 dark:text-gray-700 transition-transform duration-500 group-hover:scale-110 group-hover:text-sky-400/60" size={40} />
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
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
                                </motion.div>
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
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-10 px-1">
                        <SectionLabel index="03">Professional Path</SectionLabel>
                    </h2>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="animate-spin text-sky-400" size={32} />
                        </div>
                    ) : (
                        <div className="space-y-12 ml-4">
                            {experiences.length > 0 ? experiences.map((exp) => (
                                <div key={exp.id} className="group relative pl-12 py-2">
                                    {/* Gradient-fading connecting line */}
                                    <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent dark:via-white/10 group-hover:via-sky-400/40 transition-colors duration-500" aria-hidden="true" />
                                    <div className="absolute left-0 top-4 w-4 h-4 -translate-x-1/2 rounded-full bg-white dark:bg-surface-elevated border-2 border-gray-200 dark:border-white/10 group-hover:border-sky-400 group-hover:scale-125 group-hover:animate-pulse-glow group-hover:[--glow:199_89%_60%] transition-all duration-300" />

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
                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">
                            <SectionLabel index="04">Contact</SectionLabel>
                        </div>
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
        </div>
    );
};
