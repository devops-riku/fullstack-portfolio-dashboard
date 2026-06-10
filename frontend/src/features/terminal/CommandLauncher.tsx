import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { CommandTerminal } from './CommandTerminal';

// Site-wide ⌘K / Ctrl+K command terminal overlay. Mounted once in Layout so the
// terminal CMS is reachable from every page, including the public portfolio.
export const CommandLauncher = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      {/* Discoverable trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open command terminal"
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 px-4 h-11 rounded-xl glass text-gray-300 hover:text-sky-300 hover:glow-accent transition-all duration-300 font-mono text-xs"
      >
        <Icon icon="ph:terminal-window-bold" className="text-sky-400 text-base" />
        <span className="hidden sm:inline tracking-wider">⌘K</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center pt-[8vh] px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="relative w-full max-w-2xl"
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            >
              <CommandTerminal onRequestClose={() => setOpen(false)} />
              <p className="text-center text-[10px] font-mono text-gray-500 mt-3 tracking-wider">
                esc to close · /help for commands
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
