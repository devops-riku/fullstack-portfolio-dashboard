import { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Sun, Moon, Github, Linkedin, Mail, LayoutDashboard, LogIn,
  Hash, Briefcase, Folder, User,
} from 'lucide-react';
import { getProfile, type Profile } from '../../features/portfolio/profileApi';

const SECTIONS = [
  { id: 'stack', label: 'Stack', icon: Hash },
  { id: 'projects', label: 'Projects', icon: Folder },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'contact', label: 'Contact', icon: User },
];

export const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getProfile().then(setProfile).catch(() => {});
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const run = (fn: () => void) => {
    setOpen(false);
    fn();
  };

  const goToSection = (id: string) => {
    const scroll = () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(scroll, 120);
    } else {
      scroll();
    }
  };

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.theme = isDark ? 'dark' : 'light';
  };

  const copyEmail = async () => {
    const email = profile?.email;
    if (!email) {
      toast.error('No email set');
      return;
    }
    await navigator.clipboard.writeText(email);
    toast.success('Email copied');
  };

  const token = localStorage.getItem('token');

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command Menu"
      onClick={() => setOpen(false)}
      className="fixed inset-0 z-[120] flex items-start justify-center p-4 pt-[18vh] bg-black/40 backdrop-blur-sm data-[state=closed]:hidden"
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogTitle className="sr-only">Command Menu</DialogTitle>
        <Command.Input
          placeholder="Type a command or search…"
          className="w-full border-b border-gray-100 dark:border-white/10 bg-transparent px-5 py-4 text-sm font-medium outline-none placeholder:text-gray-400"
        />
        <Command.List className="max-h-80 overflow-y-auto p-2">
          <Command.Empty className="px-3 py-6 text-center text-xs font-mono uppercase tracking-widest text-gray-400">
            No results
          </Command.Empty>

          <Command.Group heading="Navigate" className="px-2 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400">
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <Command.Item
                key={id}
                onSelect={() => run(() => goToSection(id))}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 aria-selected:bg-sky-50 dark:aria-selected:bg-sky-400/10 aria-selected:text-sky-500 cursor-pointer"
              >
                <Icon size={16} /> {label}
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group heading="Actions" className="px-2 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400">
            <Command.Item onSelect={() => run(toggleTheme)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold aria-selected:bg-sky-50 dark:aria-selected:bg-sky-400/10 aria-selected:text-sky-500 cursor-pointer">
              <Sun size={16} className="dark:hidden" /><Moon size={16} className="hidden dark:block" /> Toggle theme
            </Command.Item>
            <Command.Item onSelect={() => run(copyEmail)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold aria-selected:bg-sky-50 dark:aria-selected:bg-sky-400/10 aria-selected:text-sky-500 cursor-pointer">
              <Mail size={16} /> Copy email
            </Command.Item>
            {profile?.github_url && profile.github_url !== '#' && (
              <Command.Item onSelect={() => run(() => window.open(profile.github_url, '_blank'))} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold aria-selected:bg-sky-50 dark:aria-selected:bg-sky-400/10 aria-selected:text-sky-500 cursor-pointer">
                <Github size={16} /> Open GitHub
              </Command.Item>
            )}
            {profile?.linkedin_url && profile.linkedin_url !== '#' && (
              <Command.Item onSelect={() => run(() => window.open(profile.linkedin_url, '_blank'))} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold aria-selected:bg-sky-50 dark:aria-selected:bg-sky-400/10 aria-selected:text-sky-500 cursor-pointer">
                <Linkedin size={16} /> Open LinkedIn
              </Command.Item>
            )}
          </Command.Group>

          <Command.Group heading="Admin" className="px-2 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400">
            {token ? (
              <Command.Item onSelect={() => run(() => navigate('/dashboard'))} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold aria-selected:bg-sky-50 dark:aria-selected:bg-sky-400/10 aria-selected:text-sky-500 cursor-pointer">
                <LayoutDashboard size={16} /> Dashboard
              </Command.Item>
            ) : (
              <Command.Item onSelect={() => run(() => navigate('/login'))} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold aria-selected:bg-sky-50 dark:aria-selected:bg-sky-400/10 aria-selected:text-sky-500 cursor-pointer">
                <LogIn size={16} /> Login
              </Command.Item>
            )}
          </Command.Group>
        </Command.List>
      </div>
    </Command.Dialog>
  );
};
