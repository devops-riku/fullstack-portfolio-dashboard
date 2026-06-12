import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Toaster } from 'sonner';
import { CommandLauncher } from '../features/terminal/CommandLauncher';
import { ScrollProgress } from '../shared/components/ScrollProgress';
import { CommandPalette } from '../shared/components/CommandPalette';

export const Layout = () => {
  // Follow the app's active theme (Navbar toggles the `dark` class on <html>).
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setTheme(root.classList.contains('dark') ? 'dark' : 'light');
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-paper dark:bg-ink">
      {/* Subtle top radial glow behind content — non-interactive, below navbar */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[40vh] bg-[radial-gradient(60%_100%_at_50%_0%,hsl(var(--glow)/0.10),transparent_70%)]"
      />
      <ScrollProgress />
      <CommandPalette />
      <Toaster position="top-right" expand={true} theme={theme} />
      <Navbar />
      <main className="relative z-10 flex-grow container mx-auto px-4 md:px-0 pt-24">
        <Outlet />
      </main>
      <CommandLauncher />
    </div>
  );
};
