// Shared types for the RikuOS terminal command interface.

export type LineKind =
  | 'input'
  | 'output'
  | 'success'
  | 'error'
  | 'info'
  | 'system';

export interface TerminalLine {
  id: number;
  kind: LineKind;
  text: string;
}

// A guided multi-step prompt (e.g. `/project add`).
export interface WizardStep {
  key: string;
  label: string;
  optional?: boolean;
  /** Hint shown after the label, e.g. "(comma separated)". */
  hint?: string;
}

export interface Wizard {
  title: string;
  steps: WizardStep[];
  onComplete: (values: Record<string, string>, ctx: CommandContext) => Promise<void> | void;
}

// Everything a command can do, injected by the terminal host.
export interface CommandContext {
  /** Positional args, quote-aware. args[0] is the first arg after the command name. */
  args: string[];
  /** The full raw line the user typed (without the leading slash). */
  raw: string;
  print: (text: string, kind?: LineKind) => void;
  clear: () => void;
  navigate: (path: string) => void;
  scrollToSection: (id: string) => void;
  setTheme: (t: 'dark' | 'light') => void;
  startWizard: (w: Wizard) => void;
  isAuthed: boolean;
  /** Notify the app that CMS data changed so views can refetch. */
  notifyMutated: () => void;
}

export interface Command {
  name: string;
  usage: string;
  description: string;
  /** Requires a logged-in session. */
  auth?: boolean;
  run: (ctx: CommandContext) => Promise<void> | void;
}
