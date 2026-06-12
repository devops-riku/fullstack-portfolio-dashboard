import { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal, User, Folder, Wrench, Briefcase, LogOut,
  ExternalLink, Menu, UserCircle,
} from 'lucide-react';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Toaster } from 'sonner';

const NAV = [
  { index: '00', label: 'Console',    path: '/dashboard/console',    icon: Terminal   },
  { index: '01', label: 'Portfolio',  path: '/dashboard/portfolio',  icon: User       },
  { index: '02', label: 'Projects',   path: '/dashboard/projects',   icon: Folder     },
  { index: '03', label: 'Skills',     path: '/dashboard/skills',     icon: Wrench     },
  { index: '04', label: 'Experience', path: '/dashboard/experience', icon: Briefcase  },
];

const NavItems = ({ onNavigate }: { onNavigate?: () => void }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-white/5">
        <Link to="/" className="group flex items-center gap-2">
          <span className="font-display text-lg font-extrabold uppercase tracking-tight text-white">
            Riku<span className="text-sky-400">.</span>Dev
          </span>
        </Link>
        <div className="mt-1.5 flex items-center gap-1.5">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-sky-400" />
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-gray-500">Admin System</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV.map(({ index, label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            onClick={onNavigate}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 ${
                isActive
                  ? 'bg-white/5 text-white border-l-2 border-sky-400 pl-[10px]'
                  : 'text-gray-500 hover:bg-white/5 hover:text-gray-200 border-l-2 border-transparent pl-[10px]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`font-mono text-[9px] tracking-[0.2em] tabular-nums ${isActive ? 'text-sky-400' : 'text-gray-600 group-hover:text-gray-400'}`}>
                  {index}
                </span>
                <Icon size={14} className={isActive ? 'text-sky-400' : ''} />
                <span className="font-mono text-[11px] uppercase tracking-[0.15em] font-semibold">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/5 px-3 py-4 space-y-0.5">
        <Link
          to="/"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 border-l-2 border-transparent pl-[10px] text-gray-500 hover:bg-white/5 hover:text-gray-200 transition-all"
        >
          <ExternalLink size={14} />
          <span className="font-mono text-[11px] uppercase tracking-[0.15em] font-semibold">View Site</span>
        </Link>
        <NavLink
          to="/dashboard/account"
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all border-l-2 pl-[10px] ${
              isActive
                ? 'bg-white/5 text-white border-sky-400'
                : 'border-transparent text-gray-500 hover:bg-white/5 hover:text-gray-200'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <UserCircle size={14} className={isActive ? 'text-sky-400' : ''} />
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] font-semibold">Account</span>
            </>
          )}
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 border-l-2 border-transparent pl-[10px] text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <LogOut size={14} />
          <span className="font-mono text-[11px] uppercase tracking-[0.15em] font-semibold">Logout</span>
        </button>
      </div>
    </div>
  );
};

export const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#0f0f0f] text-white overflow-hidden">
      <Toaster position="top-right" theme="dark" />

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col bg-[#0a0a0a] border-r border-white/5">
        <NavItems />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50 md:hidden bg-[#0a0a0a] border border-white/10 text-white hover:bg-white/5 rounded-xl"
          >
            <Menu size={18} />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-[#0a0a0a] border-r border-white/5">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <NavItems onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={window.location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="min-h-full p-6 md:p-10"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};
