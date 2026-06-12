import { useEffect, useState } from 'react';

/**
 * Returns true when the user has requested reduced motion.
 * Used to disable decorative animations (magnetic buttons, kinetic bg, rotating word).
 */
export const useReducedMotion = (): boolean => {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return reduced;
};
