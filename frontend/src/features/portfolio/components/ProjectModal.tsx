import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { Project } from '../../projects/api';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal = ({ project, onClose }: ProjectModalProps) => (
  <AnimatePresence>
    {project && project.image_url && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-start overflow-y-auto bg-black/95 p-4 md:p-10 backdrop-blur-sm cursor-zoom-out"
        onClick={onClose}
      >
        <motion.button
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="fixed top-6 right-6 z-[110] rounded-2xl bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={24} />
        </motion.button>
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative my-auto flex w-full max-w-6xl flex-col items-center gap-6"
          onClick={(e) => e.stopPropagation()}
        >
          <img src={project.image_url} alt={project.title} className="max-h-[80vh] max-w-full rounded-2xl object-contain shadow-2xl" />
          <div className="max-w-3xl space-y-2 p-4 text-center">
            <h3 className="font-display text-xl md:text-3xl font-extrabold uppercase tracking-tight text-white">{project.title}</h3>
            <p className="mx-auto max-w-2xl text-sm md:text-base font-medium leading-relaxed text-gray-400">{project.description}</p>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
