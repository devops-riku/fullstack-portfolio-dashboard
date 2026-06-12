import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from './SectionHeader';
import type { Skill } from '../../skills/api';

interface TechStackProps {
  skills: Skill[];
}

const CATEGORY_COLOR: Record<string, string> = {
  frontend: 'text-sky-400',
  backend: 'text-emerald-400',
  devops: 'text-purple-400',
  cloud: 'text-sky-500',
  mobile: 'text-pink-400',
};

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const TechStack = ({ skills }: TechStackProps) => {
  // Guard against a non-array body on a 200 (error envelope), matching the
  // original page's defensive Array.isArray checks.
  const safeSkills = Array.isArray(skills) ? skills : [];
  const categories = Array.from(new Set(safeSkills.map((s) => s.category || 'other')));

  return (
    <motion.section
      id="stack"
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="scroll-mt-32"
    >
      <SectionHeader index="01" title="Tech Stack" />
      {safeSkills.length === 0 ? (
        <p className="font-mono text-[11px] uppercase tracking-widest text-gray-400">Waiting for tools…</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {categories.map((catId) => {
            const catSkills = safeSkills.filter((s) => (s.category || 'other') === catId);
            if (catSkills.length === 0) return null;
            return (
              <div key={catId} className="space-y-4">
                <h3 className={`font-mono text-[10px] font-semibold uppercase tracking-[0.25em] ${CATEGORY_COLOR[catId.toLowerCase()] || 'text-sky-400'}`}>
                  {cap(catId)}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {catSkills.map((skill) => (
                    <Badge
                      key={skill.id}
                      variant="secondary"
                      className="flex items-center gap-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 px-4 py-2.5 text-[11px] font-semibold text-gray-600 dark:text-gray-300 hover:border-sky-400/40 hover:text-sky-400 transition-colors"
                    >
                      <Icon icon={skill.icon_name || 'ph:code-bold'} className="text-sm" />
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.section>
  );
};
