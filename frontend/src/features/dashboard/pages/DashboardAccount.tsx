import { UserProfile } from '../../users/pages/UserProfile';

export const DashboardAccount = () => (
  <div className="space-y-6 max-w-2xl">
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-sky-400 mb-1">Account</p>
      <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-white">Account Settings</h1>
      <p className="mt-2 text-sm text-gray-400">
        Manage your login credentials and account details.
      </p>
    </div>
    <UserProfile />
  </div>
);
