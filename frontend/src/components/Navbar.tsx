import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon, LayoutDashboard, User as UserIcon, LogOut, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const isPortfolioPage = location.pathname === '/';

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      return true;
    }
    return false;
  });

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const scrollToSection = (id: string) => {
    if (!isPortfolioPage) {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { name: 'Stack', id: 'stack' },
    { name: 'Projects', id: 'projects' },
    { name: 'Experience', id: 'experience' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
      ? 'py-2 bg-white/70 dark:bg-black/70 backdrop-blur-md border-b border-gray-100 dark:border-white/5'
      : 'py-5 bg-transparent border-none'
      }`}>
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <Link to="/" className="group flex items-center gap-2">
            <span className="text-xl font-black tracking-tighter text-black dark:text-white uppercase transition-colors">
              Riku<span className="text-sky-400">.</span>Dev
            </span>
          </Link>
        </motion.div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center bg-gray-50/50 dark:bg-white/5 backdrop-blur-sm px-6 py-2 rounded-full border border-gray-100 dark:border-white/10 gap-8">
          {navLinks.map((link, i) => (
            <motion.button
              key={link.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => scrollToSection(link.id)}
              className="text-[10px] font-black tracking-[0.2em] text-gray-400 hover:text-sky-400 transition-colors relative group uppercase"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sky-400 transition-all duration-300 group-hover:w-full" />
            </motion.button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-white/10 transition-all hover:bg-sky-50 dark:hover:bg-sky-400/10 hover:text-sky-400"
          >
            {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
          </Button>

          {token && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 text-sky-400 border border-gray-100 dark:border-white/10 transition-all hover:bg-sky-100 dark:hover:bg-sky-400/20"
                >
                  <UserIcon size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 bg-white dark:bg-black border-gray-100 dark:border-white/10 p-2 rounded-2xl shadow-2xl">
                <DropdownMenuItem onClick={() => navigate('/dashboard')} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                  <LayoutDashboard size={18} className="text-gray-400 group-hover:text-sky-400 transition-colors" />
                  <span className="text-xs font-black uppercase tracking-wider">Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/profile')} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                  <UserIcon size={18} className="text-gray-400 group-hover:text-sky-400 transition-colors" />
                  <span className="text-xs font-black uppercase tracking-wider">Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-100 dark:bg-white/10 my-1" />
                <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group text-red-500">
                  <LogOut size={18} className="text-red-400 group-hover:text-red-500 transition-colors" />
                  <span className="text-xs font-black uppercase tracking-wider">Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-white dark:bg-black border-l border-gray-100 dark:border-white/10">
                <SheetHeader className="pb-8 border-b border-gray-100 dark:border-white/10">
                  <SheetTitle className="text-left flex items-center gap-2">
                    <span className="text-lg font-black uppercase tracking-tight">Navigation</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-2 pt-6">
                  {navLinks.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => scrollToSection(link.id)}
                      className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-left transition-colors group"
                    >
                      <span className="text-sm font-black uppercase tracking-widest text-gray-400 group-hover:text-sky-400 transition-colors">{link.name}</span>
                      <div className="w-1 h-1 rounded-full bg-sky-400 opacity-0 group-hover:opacity-100 transition-all" />
                    </button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};
