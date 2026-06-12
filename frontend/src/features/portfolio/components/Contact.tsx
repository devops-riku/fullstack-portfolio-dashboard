import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MagneticButton } from '../../../shared/components/MagneticButton';
import type { Profile } from '../profileApi';

interface ContactProps {
  profile: Profile | null;
}

export const Contact = ({ profile }: ContactProps) => (
  <motion.section
    id="contact"
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="scroll-mt-32 border-t border-gray-200 dark:border-white/10 py-24 text-center"
  >
    <div className="mx-auto max-w-md space-y-4">
      <h2 className="font-display text-4xl md:text-6xl font-black uppercase leading-none tracking-tight text-ink dark:text-paper">Let's build<br />something.</h2>
      <p className="pb-4 text-sm md:text-base font-medium text-gray-500 dark:text-gray-400">Inquiries, collaborations, or just a virtual coffee.</p>
      <MagneticButton className="inline-block">
        <Button asChild size="lg" className="h-16 rounded-2xl bg-sky-400 px-10 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-xl shadow-sky-400/20 hover:bg-sky-500 transition-colors">
          <a href={`mailto:${profile?.email || 'hello@riku.dev'}`}><Mail className="mr-3" size={18} /> Send Message</a>
        </Button>
      </MagneticButton>
    </div>
  </motion.section>
);
