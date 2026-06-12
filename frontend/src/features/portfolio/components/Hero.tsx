import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MagneticButton } from '../../../shared/components/MagneticButton';
import { AnimatedHeadline } from './AnimatedHeadline';
import type { Profile } from '../profileApi';

const INDEX = [
  { id: 'stack', label: '01 / stack' },
  { id: 'projects', label: '02 / work' },
  { id: 'experience', label: '03 / path' },
  { id: 'contact', label: '04 / contact' },
];

interface HeroProps {
  profile: Profile | null;
}

export const Hero = ({ profile }: HeroProps) => {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="relative pt-28 pb-12">
      {/* faint kinetic grid background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
        <div className="md:col-span-8 space-y-6">
          <Badge variant="outline" className="border-sky-400/30 text-sky-400 bg-sky-400/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em]">
            ● Available for Projects
          </Badge>
          <h1 className="font-display text-5xl md:text-7xl font-black uppercase leading-[0.9] tracking-tight text-ink dark:text-paper text-balance">
            Full-Stack<br />Engineer
            <span className="text-sky-400"> →</span>
          </h1>
          <p className="max-w-xl text-base md:text-lg font-medium leading-relaxed text-gray-500 dark:text-gray-400">
            Hi! I'm <span className="font-bold text-ink dark:text-paper">{profile?.full_name || 'Riku'}</span>,{' '}
            {profile?.bio || 'building minimal, high-performance digital products.'}
          </p>
          <p className="font-mono text-sm text-gray-400">
            <AnimatedHeadline />
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <MagneticButton>
              <Button asChild className="h-12 px-8 rounded-xl bg-ink dark:bg-paper text-paper dark:text-ink font-mono text-[11px] font-semibold uppercase tracking-widest hover:bg-sky-400 hover:text-white transition-colors">
                <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}>Get in touch</a>
              </Button>
            </MagneticButton>
            <div className="flex items-center gap-2">
              {profile?.github_url && profile.github_url !== '#' && (
                <Button variant="outline" size="icon" asChild className="w-12 h-12 rounded-xl border-gray-200 dark:border-white/10 hover:border-sky-400/50">
                  <a href={profile.github_url} target="_blank" rel="noopener noreferrer" title="GitHub"><Github size={18} /></a>
                </Button>
              )}
              {profile?.linkedin_url && profile.linkedin_url !== '#' && (
                <Button variant="outline" size="icon" asChild className="w-12 h-12 rounded-xl border-gray-200 dark:border-white/10 hover:border-sky-400/50">
                  <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" title="LinkedIn"><Linkedin size={18} /></a>
                </Button>
              )}
              {profile?.email && (
                <Button variant="outline" size="icon" asChild className="w-12 h-12 rounded-xl border-gray-200 dark:border-white/10 hover:border-sky-400/50">
                  <a href={`mailto:${profile.email}`} title="Email"><Mail size={18} /></a>
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-4 flex md:justify-end">
          <motion.div
            whileHover={{ rotate: 3 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="w-40 h-40 md:w-48 md:h-48 overflow-hidden rounded-3xl border-2 border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-900 flex items-center justify-center"
          >
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={64} className="text-gray-300 dark:text-gray-700" />
            )}
          </motion.div>
        </div>
      </div>

      {/* numbered index nav */}
      <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-px border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden">
        {INDEX.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className="bg-paper dark:bg-ink px-5 py-4 text-left font-mono text-[11px] uppercase tracking-[0.2em] text-gray-400 hover:text-sky-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            {item.label}
          </button>
        ))}
      </div>
    </section>
  );
};
