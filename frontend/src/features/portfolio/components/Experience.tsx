import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from './SectionHeader';
import { ExperienceSkeleton } from './Skeletons';
import type { Experience as Exp } from '../../experience/api';

interface ExperienceProps {
  experiences: Exp[];
  loading: boolean;
}

export const Experience = ({ experiences, loading }: ExperienceProps) => (
  <motion.section
    id="experience"
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="scroll-mt-32"
  >
    <SectionHeader index="03" title="Professional Path" />
    {loading ? (
      <div className="space-y-10"><ExperienceSkeleton /><ExperienceSkeleton /></div>
    ) : experiences.length > 0 ? (
      <div className="ml-4 space-y-12">
        {experiences.map((exp) => (
          <div key={exp.id} className="group relative border-l-2 border-gray-200 dark:border-white/10 py-2 pl-12">
            <div className="absolute left-0 top-4 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-gray-200 bg-paper transition-all duration-300 group-hover:scale-125 group-hover:border-sky-400 dark:border-white/10 dark:bg-ink" />
            <div className="space-y-2">
              <div className="flex flex-col justify-between gap-2 md:flex-row md:items-baseline">
                <h3 className="font-display text-lg font-extrabold uppercase tracking-tight text-ink dark:text-paper transition-colors group-hover:text-sky-400">{exp.role}</h3>
                <Badge variant="outline" className="h-6 rounded-lg border-gray-200 font-mono text-[9px] uppercase tracking-widest text-gray-400 dark:border-white/10">{exp.period}</Badge>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-sky-400">
                <Terminal size={14} /> {exp.company}
              </div>
              <p className="max-w-2xl pt-2 text-sm font-medium leading-relaxed text-gray-500 dark:text-gray-400">{exp.description}</p>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="rounded-3xl border-2 border-dashed border-gray-200 py-20 text-center dark:border-white/10">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-gray-400">Timeline is waiting for history</p>
      </div>
    )}
  </motion.section>
);
