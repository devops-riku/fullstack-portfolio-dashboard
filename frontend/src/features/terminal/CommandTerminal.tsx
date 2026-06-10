import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { commandMap, commandNames, tokenize } from './commands';
import type { CommandContext, LineKind, TerminalLine, Wizard } from './types';

interface WizardState {
  wizard: Wizard;
  stepIndex: number;
  values: Record<string, string>;
}

interface CommandTerminalProps {
  /** Greeting shown on first mount. */
  intro?: boolean;
  /** Called after any command mutates CMS data. */
  onMutate?: () => void;
  /** Fired when a command wants the host overlay to close (e.g. /goto). */
  onRequestClose?: () => void;
  className?: string;
  autoFocus?: boolean;
}

const LINE_COLOR: Record<LineKind, string> = {
  input: 'text-white/90',
  output: 'text-gray-400',
  success: 'text-sky-300',
  error: 'text-red-400',
  info: 'text-gray-500',
  system: 'text-emerald-300',
};

let lineSeq = 0;

export const CommandTerminal = ({
  intro = true,
  onMutate,
  onRequestClose,
  className = '',
  autoFocus = true,
}: CommandTerminalProps) => {
  const navigate = useNavigate();
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIndex, setHistIndex] = useState<number>(-1);
  const [wizard, setWizard] = useState<WizardState | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const print = (text: string, kind: LineKind = 'output') =>
    setLines((prev) => [...prev, { id: ++lineSeq, kind, text }]);

  // Greeting on mount.
  useEffect(() => {
    if (!intro) return;
    setLines([
      { id: ++lineSeq, kind: 'system', text: 'RikuOS v1.0 — portfolio command interface' },
      { id: ++lineSeq, kind: 'info', text: "Type /help to list commands. Write actions need /login." },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll to newest line.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [lines, wizard]);

  const setTheme = (t: 'dark' | 'light') => {
    const root = document.documentElement;
    if (t === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.theme = t;
  };

  const scrollToSection = (id: string) => {
    onRequestClose?.();
    const doScroll = () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    if (window.location.pathname !== '/') {
      navigate('/');
      window.setTimeout(doScroll, 120);
    } else {
      doScroll();
    }
  };

  const notifyMutated = () => {
    window.dispatchEvent(new Event('cms:refresh'));
    onMutate?.();
  };

  const makeCtx = (args: string[], raw: string): CommandContext => ({
    args,
    raw,
    print,
    clear: () => setLines([]),
    navigate: (p) => {
      onRequestClose?.();
      navigate(p);
    },
    scrollToSection,
    setTheme,
    startWizard: (w) => {
      setWizard({ wizard: w, stepIndex: 0, values: {} });
      print(`${w.title} — fill each field, or /cancel to abort.`, 'info');
    },
    isAuthed: !!localStorage.getItem('token'),
    notifyMutated,
  });

  const runCommand = (rawLine: string) => {
    const raw = rawLine.replace(/^\//, '').trim();
    const tokens = tokenize(raw);
    const name = (tokens[0] || '').toLowerCase();
    const args = tokens.slice(1);
    if (!name) return;
    const cmd = commandMap[name];
    if (!cmd) {
      print(`command not found: ${name}. type /help`, 'error');
      return;
    }
    if (cmd.auth && !localStorage.getItem('token')) {
      print('auth required — run /login <email> <password> first.', 'error');
      return;
    }
    void Promise.resolve(cmd.run(makeCtx(args, raw)));
  };

  const advanceWizard = (value: string) => {
    if (!wizard) return;
    const step = wizard.wizard.steps[wizard.stepIndex];
    const trimmed = value.trim();
    if (!trimmed && !step.optional) {
      print(`${step.label} is required.`, 'error');
      return;
    }
    const values = { ...wizard.values, [step.key]: trimmed };
    const nextIndex = wizard.stepIndex + 1;
    if (nextIndex < wizard.wizard.steps.length) {
      setWizard({ ...wizard, stepIndex: nextIndex, values });
    } else {
      const done = wizard.wizard;
      setWizard(null);
      void Promise.resolve(done.onComplete(values, makeCtx([], '')));
    }
  };

  const submit = () => {
    const value = input;
    setInput('');
    setHistIndex(-1);

    if (wizard) {
      if (value.trim() === '/cancel') {
        print('cancelled.', 'info');
        setWizard(null);
        return;
      }
      const step = wizard.wizard.steps[wizard.stepIndex];
      print(`${step.label}: ${value.trim() || '—'}`, 'input');
      advanceWizard(value);
      return;
    }

    if (!value.trim()) return;
    print(`$ ${value.trim()}`, 'input');
    setHistory((h) => [...h, value.trim()]);
    runCommand(value);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
      return;
    }
    if (wizard) return; // history/autocomplete only outside wizard mode

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const idx = histIndex === -1 ? history.length - 1 : Math.max(0, histIndex - 1);
      setHistIndex(idx);
      setInput(history[idx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIndex === -1) return;
      const idx = histIndex + 1;
      if (idx >= history.length) {
        setHistIndex(-1);
        setInput('');
      } else {
        setHistIndex(idx);
        setInput(history[idx]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const frag = input.replace(/^\//, '').toLowerCase();
      if (!frag || frag.includes(' ')) return;
      const match = commandNames().find((n) => n.startsWith(frag));
      if (match) setInput(`/${match} `);
    }
  };

  // Live suggestions for the current command fragment.
  const suggestions = useMemo(() => {
    if (wizard) return [];
    const frag = input.replace(/^\//, '').toLowerCase();
    if (!input.startsWith('/') || frag.includes(' ') || frag === '') return [];
    return commandNames().filter((n) => n.startsWith(frag) && n !== frag).slice(0, 6);
  }, [input, wizard]);

  const promptLabel = wizard
    ? `${wizard.wizard.steps[wizard.stepIndex].label}${
        wizard.wizard.steps[wizard.stepIndex].optional ? ' (optional)' : ''
      }${wizard.wizard.steps[wizard.stepIndex].hint ? ' ' + wizard.wizard.steps[wizard.stepIndex].hint : ''} ›`
    : 'riku@portfolio:~$';

  return (
    <div
      className={`glass-strong rounded-2xl overflow-hidden font-mono text-[13px] shadow-2xl shadow-black/40 ${className}`}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-black/20">
        <span className="w-3 h-3 rounded-full bg-red-400/80" />
        <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
        <span className="w-3 h-3 rounded-full bg-emerald-400/80" />
        <div className="flex-1 text-center text-[10px] uppercase tracking-[0.3em] text-gray-500 flex items-center justify-center gap-2">
          <Icon icon="ph:terminal-window-bold" className="text-sky-400" />
          riku.dev — cms
        </div>
        <span className="w-3 h-3" />
      </div>

      {/* Output log */}
      <div className="px-4 py-4 h-[340px] overflow-y-auto leading-relaxed">
        {lines.map((l) => (
          <div key={l.id} className={`whitespace-pre-wrap break-words ${LINE_COLOR[l.kind]}`}>
            {l.text || ' '}
          </div>
        ))}

        {/* Prompt row */}
        <div className="flex items-center gap-2 pt-1">
          <span className={wizard ? 'text-sky-400 shrink-0' : 'text-emerald-400 shrink-0'}>{promptLabel}</span>
          <input
            ref={inputRef}
            value={input}
            autoFocus={autoFocus}
            spellCheck={false}
            autoComplete="off"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            className="flex-1 bg-transparent outline-none text-white caret-sky-400 placeholder:text-gray-600"
            placeholder={wizard ? '' : 'type a command…'}
          />
        </div>

        {/* Autocomplete suggestions */}
        {suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 pl-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setInput(`/${s} `);
                  inputRef.current?.focus();
                }}
                className="px-2 py-0.5 rounded-md text-[11px] bg-white/5 text-gray-400 hover:text-sky-300 hover:bg-sky-400/10 border border-white/5 transition-colors"
              >
                /{s}
              </button>
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
