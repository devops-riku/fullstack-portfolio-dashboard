import { CommandTerminal } from '../../terminal/CommandTerminal';

export const DashboardConsole = () => (
  <div className="space-y-6 max-w-4xl">
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-sky-400 mb-1">00 / Console</p>
      <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-white">Command Center</h1>
      <p className="mt-2 text-sm text-gray-400">
        Manage everything by command. Type <span className="font-mono text-sky-400">/help</span> to see available commands.
      </p>
    </div>
    <CommandTerminal onMutate={() => {}} />
  </div>
);
