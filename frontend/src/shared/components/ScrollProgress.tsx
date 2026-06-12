import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * Fixed accent bar at the very top of the viewport that fills as the
 * user scrolls the page. Mounted once in Layout.
 */
export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.2 });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-0.5 bg-sky-400 origin-left z-[60]"
      aria-hidden="true"
    />
  );
};
