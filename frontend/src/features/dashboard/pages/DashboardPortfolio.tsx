import { ProfileEditor } from '../../portfolio/components/ProfileEditor';

export const DashboardPortfolio = () => (
  <div className="space-y-6 max-w-4xl">
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-sky-400 mb-1">01 / Portfolio</p>
      <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-white">Profile</h1>
      <p className="mt-2 text-sm text-gray-400">
        Manage your public portfolio profile, bio, and social links.
      </p>
    </div>
    <ProfileEditor />
  </div>
);
