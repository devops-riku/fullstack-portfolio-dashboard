import { SkillList } from '../../skills/components/SkillList';

export const DashboardSkills = () => (
  <div className="space-y-6 max-w-4xl">
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-sky-400 mb-1">03 / Skills</p>
      <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-white">Tech Stack</h1>
      <p className="mt-2 text-sm text-gray-400">
        Add and organize the technologies shown on your portfolio.
      </p>
    </div>
    <SkillList />
  </div>
);
