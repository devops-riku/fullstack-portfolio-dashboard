import { ExperienceList } from '../../experience/components/ExperienceList';

export const DashboardExperience = () => (
  <div className="space-y-6 max-w-4xl">
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-sky-400 mb-1">04 / Experience</p>
      <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-white">Experience</h1>
      <p className="mt-2 text-sm text-gray-400">
        Manage your career history and professional experience.
      </p>
    </div>
    <ExperienceList />
  </div>
);
