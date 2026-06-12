import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '../../../shared/hooks/useReducedMotion';

const WORDS = ['minimal', 'fast', 'precise'];

export const AnimatedHeadline = () => {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setI((n) => (n + 1) % WORDS.length), 2000);
    return () => clearInterval(t);
  }, [reduced]);

  return (
    <span className="relative inline-flex h-[1.1em] overflow-hidden align-bottom text-sky-400">
      <AnimatePresence mode="wait">
        <motion.span
          key={WORDS[i]}
          initial={reduced ? false : { y: '100%' }}
          animate={{ y: '0%' }}
          exit={reduced ? undefined : { y: '-100%' }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="inline-block"
        >
          {WORDS[i]}.
        </motion.span>
      </AnimatePresence>
    </span>
  );
};
