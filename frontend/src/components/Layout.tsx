import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Toaster } from 'sonner';
import { ScrollProgress } from '../shared/components/ScrollProgress';
import { CommandPalette } from '../shared/components/CommandPalette';

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-paper dark:bg-ink">
      <ScrollProgress />
      <CommandPalette />
      <Toaster position="top-right" expand={true} theme="dark" />
      <Navbar />
      <main className="flex-grow container mx-auto px-4 md:px-0 pt-24">
        <Outlet />
      </main>
    </div>
  );
};
