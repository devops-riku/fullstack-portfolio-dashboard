# Editorial Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the public portfolio (and align the auth/dashboard surfaces) into an art-directed Editorial/Swiss experience with scroll/motion polish, an animated hero, a ⌘K command palette, and project filtering.

**Architecture:** Establish a design-token + font foundation in `index.css`/`index.html`, build a small set of reusable interactive primitives (`ScrollProgress`, `MagneticButton`, `CommandPalette`, `useReducedMotion`), then decompose the 352-line `Portfolio.tsx` into focused section components that consume data via props while the page owns fetching. Mount app-wide primitives in `Layout.tsx`. Finally re-skin login + dashboard editors with the same tokens.

**Tech Stack:** React 19, Vite 7, TypeScript, Tailwind v4, Framer Motion, Radix UI, lucide-react, @iconify/react, sonner, **cmdk (new)**.

> **Verification note:** This repo has no JS test runner configured, and the work is visual. Each task is verified by `npm run build` (runs `tsc` typecheck + `vite build`) and `npm run lint`, plus an explicit manual-check list. Do NOT add a test framework — that is out of scope (YAGNI). All commands run from the `frontend/` directory.

---

## File Structure

```
frontend/
  index.html                                  # MODIFY: font preconnect + <link>
  src/
    index.css                                 # MODIFY: font + token layer, reduced-motion
    components/
      Layout.tsx                              # MODIFY: mount ScrollProgress + CommandPalette
      Navbar.tsx                              # MODIFY: ⌘K hint, editorial type
    shared/
      hooks/
        useReducedMotion.ts                   # CREATE
      components/
        ScrollProgress.tsx                    # CREATE
        MagneticButton.tsx                    # CREATE
        CommandPalette.tsx                    # CREATE
    features/
      portfolio/
        pages/Portfolio.tsx                   # MODIFY: compose sections, fix loading
        components/
          Hero.tsx                            # CREATE
          AnimatedHeadline.tsx                # CREATE
          TechStack.tsx                       # CREATE
          Projects.tsx                        # CREATE (owns filter/search state)
          Experience.tsx                      # CREATE
          Contact.tsx                         # CREATE
          ProjectModal.tsx                    # CREATE
          SectionHeader.tsx                   # CREATE (numbered editorial header)
          Skeletons.tsx                       # CREATE (loading skeletons)
      auth/pages/Login.tsx                    # MODIFY: editorial re-skin
      projects/pages/ProjectList.tsx          # MODIFY: editorial re-skin (dashboard)
      users/pages/UserProfile.tsx             # MODIFY: editorial re-skin (dashboard)
```

---

## Task 1: Add the `cmdk` dependency

**Files:**
- Modify: `frontend/package.json` (via npm)

- [ ] **Step 1: Install cmdk**

Run (from `frontend/`):
```bash
npm install cmdk@^1.0.0
```

- [ ] **Step 2: Verify it resolves and the app still builds**

Run: `npm run build`
Expected: build succeeds; `cmdk` appears under `dependencies` in `frontend/package.json`.

- [ ] **Step 3: Commit**

```bash
git add frontend/package.json frontend/package-lock.json
git commit -m "build: add cmdk for command palette"
```

---

## Task 2: Load editorial fonts

**Files:**
- Modify: `frontend/index.html:4-16`

- [ ] **Step 1: Add preconnect + font link in `<head>`**

Insert these lines inside `<head>`, immediately after the `<meta name="viewport" ...>` line:

```html
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;800;900&family=Inter:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
```

- [ ] **Step 2: Build to verify HTML is valid**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add frontend/index.html
git commit -m "feat: load Archivo, Inter, Geist Mono fonts"
```

---

## Task 3: Design tokens + reduced-motion base styles

**Files:**
- Modify: `frontend/src/index.css` (the `@theme` block at lines 52-106, and `@layer base` at 108-117)

- [ ] **Step 1: Register font families and an editorial ink/accent token in `@theme`**

Inside the existing `@theme { ... }` block (after the existing `--color-*` definitions, before `--radius-lg`), add:

```css
  /* Editorial type system */
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Archivo", "Inter", sans-serif;
  --font-mono: "Geist Mono", ui-monospace, monospace;

  /* Editorial palette */
  --color-ink: #0a0a0a;
  --color-paper: #fafafa;
  --color-accent: #38bdf8;
```

- [ ] **Step 2: Set the page surfaces to the editorial paper/ink and default font**

Replace the `body` rule inside `@layer base` (currently lines 113-116) with:

```css
  body {
    @apply text-foreground transition-colors duration-300;
    background-color: var(--color-paper);
    font-family: var(--font-sans);
    font-feature-settings: "rlig" 1, "calt" 1;
  }

  .dark body {
    background-color: var(--color-ink);
  }
```

- [ ] **Step 3: Add a reduced-motion guard at the end of the file**

Append to the end of `frontend/src/index.css`:

```css
/* Respect users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Editorial utility helpers */
.font-display { font-family: var(--font-display); }
.font-mono { font-family: var(--font-mono); }
.text-balance { text-wrap: balance; }
```

- [ ] **Step 4: Build to verify Tailwind compiles the tokens**

Run: `npm run build`
Expected: build succeeds, no CSS errors.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/index.css
git commit -m "feat: editorial design tokens and reduced-motion base"
```

---

## Task 4: `useReducedMotion` hook

**Files:**
- Create: `frontend/src/shared/hooks/useReducedMotion.ts`

- [ ] **Step 1: Create the hook**

```ts
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
```

- [ ] **Step 2: Build to typecheck**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/shared/hooks/useReducedMotion.ts
git commit -m "feat: useReducedMotion hook"
```

---

## Task 5: `ScrollProgress` bar

**Files:**
- Create: `frontend/src/shared/components/ScrollProgress.tsx`

- [ ] **Step 1: Create the component**

```tsx
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
```

- [ ] **Step 2: Build to typecheck**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/shared/components/ScrollProgress.tsx
git commit -m "feat: scroll progress bar"
```

---

## Task 6: `MagneticButton`

**Files:**
- Create: `frontend/src/shared/components/MagneticButton.tsx`

- [ ] **Step 1: Create the component**

A wrapper that translates its child toward the cursor on hover. Disabled under reduced motion. Renders a `motion.div` wrapper (callers put their own `<a>`/`<button>` inside).

```tsx
import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  /** How far the element drifts toward the cursor, in px. */
  strength?: number;
}

export const MagneticButton = ({ children, className, strength = 0.3 }: MagneticButtonProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15 });
  const springY = useSpring(y, { stiffness: 200, damping: 15 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * strength);
    y.set(relY * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
```

- [ ] **Step 2: Build to typecheck**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/shared/components/MagneticButton.tsx
git commit -m "feat: magnetic button wrapper"
```

---

## Task 7: `CommandPalette`

**Files:**
- Create: `frontend/src/shared/components/CommandPalette.tsx`

**Behavior:** Opens on ⌘K / Ctrl+K. Actions: jump to each portfolio section, toggle theme, copy email, open GitHub, open LinkedIn, go to Dashboard or Login. Navigation works from any route (routes to `/` then scrolls). Theme toggle mirrors the existing Navbar logic (toggles `.dark` class + `localStorage.theme`). Email/social pulled from the profile via `getProfile()`.

- [ ] **Step 1: Create the component**

```tsx
import { useEffect, useState } from 'react';
import { Command } from 'cmdk';
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
      className="fixed inset-0 z-[120] flex items-start justify-center p-4 pt-[18vh] bg-black/40 backdrop-blur-sm data-[state=closed]:hidden"
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
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
```

- [ ] **Step 2: Verify `Profile` type exposes the fields used**

Read `frontend/src/features/portfolio/profileApi.ts` and confirm the `Profile` type includes `email`, `github_url`, `linkedin_url`. If any field name differs, adjust the references in `CommandPalette.tsx` to match the real type. Do NOT change the API file.

- [ ] **Step 3: Build to typecheck**

Run: `npm run build`
Expected: build succeeds. If TS errors reference missing `Profile` fields, fix per Step 2.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/shared/components/CommandPalette.tsx
git commit -m "feat: cmdk command palette"
```

---

## Task 8: Mount ScrollProgress + CommandPalette app-wide

**Files:**
- Modify: `frontend/src/components/Layout.tsx`

- [ ] **Step 1: Replace the Layout body to include the new primitives**

```tsx
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
```

Note: `bg-paper` / `bg-ink` are available because Tailwind v4 generates utilities from the `--color-paper` / `--color-ink` theme tokens added in Task 3.

- [ ] **Step 2: Build + lint**

Run: `npm run build && npm run lint`
Expected: both succeed.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/Layout.tsx
git commit -m "feat: mount scroll progress and command palette in layout"
```

---

## Task 9: `SectionHeader` (numbered editorial header)

**Files:**
- Create: `frontend/src/features/portfolio/components/SectionHeader.tsx`

- [ ] **Step 1: Create the component**

```tsx
interface SectionHeaderProps {
  /** Two-digit index, e.g. "01". */
  index: string;
  title: string;
}

/**
 * Editorial section header: mono index + display title with a hairline rule.
 */
export const SectionHeader = ({ index, title }: SectionHeaderProps) => (
  <div className="mb-10 flex items-baseline gap-4 border-b border-gray-200 dark:border-white/10 pb-4">
    <span className="font-mono text-[11px] font-semibold tracking-[0.3em] text-sky-400">
      {index} /
    </span>
    <h2 className="font-display text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-ink dark:text-paper">
      {title}
    </h2>
  </div>
);
```

Note: `text-ink` / `text-paper` come from the theme tokens (Task 3).

- [ ] **Step 2: Build to typecheck**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/features/portfolio/components/SectionHeader.tsx
git commit -m "feat: numbered editorial section header"
```

---

## Task 10: `Skeletons` (loading placeholders)

**Files:**
- Create: `frontend/src/features/portfolio/components/Skeletons.tsx`

- [ ] **Step 1: Create the component**

```tsx
const shimmer = 'animate-pulse rounded-2xl bg-gray-100 dark:bg-white/5';

export const ProjectSkeleton = () => (
  <div className="space-y-4">
    <div className={`h-48 ${shimmer}`} />
    <div className={`h-4 w-2/3 ${shimmer}`} />
    <div className={`h-3 w-full ${shimmer}`} />
  </div>
);

export const ExperienceSkeleton = () => (
  <div className="space-y-3 pl-12">
    <div className={`h-5 w-1/2 ${shimmer}`} />
    <div className={`h-3 w-1/3 ${shimmer}`} />
    <div className={`h-3 w-full ${shimmer}`} />
  </div>
);
```

- [ ] **Step 2: Build to typecheck**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/features/portfolio/components/Skeletons.tsx
git commit -m "feat: loading skeletons for portfolio sections"
```

---

## Task 11: `AnimatedHeadline` (rotating sub-word)

**Files:**
- Create: `frontend/src/features/portfolio/components/AnimatedHeadline.tsx`

- [ ] **Step 1: Create the component**

Cycles through words every 2s with a vertical swap. Static (first word) under reduced motion.

```tsx
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
```

- [ ] **Step 2: Build to typecheck**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/features/portfolio/components/AnimatedHeadline.tsx
git commit -m "feat: animated rotating headline word"
```

---

## Task 12: `Hero` section

**Files:**
- Create: `frontend/src/features/portfolio/components/Hero.tsx`

**Inputs:** `profile: Profile | null` (prop). Uses `AnimatedHeadline`, `MagneticButton`. Includes the numbered index nav (anchors), availability badge, name, bio, social buttons, integrated avatar, and a faint kinetic grid background.

- [ ] **Step 1: Create the component**

```tsx
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MagneticButton } from '../../../shared/components/MagneticButton';
import { AnimatedHeadline } from './AnimatedHeadline';
import type { Profile } from '../profileApi';

const INDEX = [
  { id: 'stack', label: '01 / stack' },
  { id: 'projects', label: '02 / work' },
  { id: 'experience', label: '03 / path' },
  { id: 'contact', label: '04 / contact' },
];

interface HeroProps {
  profile: Profile | null;
}

export const Hero = ({ profile }: HeroProps) => {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="relative pt-28 pb-12">
      {/* faint kinetic grid background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
        <div className="md:col-span-8 space-y-6">
          <Badge variant="outline" className="border-sky-400/30 text-sky-400 bg-sky-400/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em]">
            ● Available for Projects
          </Badge>
          <h1 className="font-display text-5xl md:text-7xl font-black uppercase leading-[0.9] tracking-tight text-ink dark:text-paper text-balance">
            Full-Stack<br />Engineer
            <span className="text-sky-400"> →</span>
          </h1>
          <p className="max-w-xl text-base md:text-lg font-medium leading-relaxed text-gray-500 dark:text-gray-400">
            Hi! I'm <span className="font-bold text-ink dark:text-paper">{profile?.full_name || 'Riku'}</span>,{' '}
            {profile?.bio || 'building minimal, high-performance digital products.'}
          </p>
          <p className="font-mono text-sm text-gray-400">
            <AnimatedHeadline />
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <MagneticButton>
              <Button asChild className="h-12 px-8 rounded-xl bg-ink dark:bg-paper text-paper dark:text-ink font-mono text-[11px] font-semibold uppercase tracking-widest hover:bg-sky-400 hover:text-white transition-colors">
                <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}>Get in touch</a>
              </Button>
            </MagneticButton>
            <div className="flex items-center gap-2">
              {profile?.github_url && profile.github_url !== '#' && (
                <Button variant="outline" size="icon" asChild className="w-12 h-12 rounded-xl border-gray-200 dark:border-white/10 hover:border-sky-400/50">
                  <a href={profile.github_url} target="_blank" rel="noopener noreferrer" title="GitHub"><Github size={18} /></a>
                </Button>
              )}
              {profile?.linkedin_url && profile.linkedin_url !== '#' && (
                <Button variant="outline" size="icon" asChild className="w-12 h-12 rounded-xl border-gray-200 dark:border-white/10 hover:border-sky-400/50">
                  <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" title="LinkedIn"><Linkedin size={18} /></a>
                </Button>
              )}
              {profile?.email && (
                <Button variant="outline" size="icon" asChild className="w-12 h-12 rounded-xl border-gray-200 dark:border-white/10 hover:border-sky-400/50">
                  <a href={`mailto:${profile.email}`} title="Email"><Mail size={18} /></a>
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-4 flex md:justify-end">
          <motion.div
            whileHover={{ rotate: 3 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="w-40 h-40 md:w-48 md:h-48 overflow-hidden rounded-3xl border-2 border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-900 flex items-center justify-center"
          >
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={64} className="text-gray-300 dark:text-gray-700" />
            )}
          </motion.div>
        </div>
      </div>

      {/* numbered index nav */}
      <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-px border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden">
        {INDEX.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className="bg-paper dark:bg-ink px-5 py-4 text-left font-mono text-[11px] uppercase tracking-[0.2em] text-gray-400 hover:text-sky-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            {item.label}
          </button>
        ))}
      </div>
    </section>
  );
};
```

- [ ] **Step 2: Build to typecheck**

Run: `npm run build`
Expected: build succeeds. If `Profile` lacks `avatar_url`/`full_name`/`bio`/`title`, adjust references to the real type (do not edit the API).

- [ ] **Step 3: Commit**

```bash
git add frontend/src/features/portfolio/components/Hero.tsx
git commit -m "feat: editorial hero section"
```

---

## Task 13: `TechStack` section

**Files:**
- Create: `frontend/src/features/portfolio/components/TechStack.tsx`

**Inputs:** `skills: Skill[]` (prop). Keeps the existing category grouping + Iconify icons, re-skinned as editorial columns.

- [ ] **Step 1: Create the component**

```tsx
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from './SectionHeader';
import type { Skill } from '../../skills/api';

interface TechStackProps {
  skills: Skill[];
}

const CATEGORY_COLOR: Record<string, string> = {
  frontend: 'text-sky-400',
  backend: 'text-emerald-400',
  devops: 'text-purple-400',
  cloud: 'text-sky-500',
  mobile: 'text-pink-400',
};

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const TechStack = ({ skills }: TechStackProps) => {
  const categories = Array.from(new Set((skills || []).map((s) => s.category || 'other')));

  return (
    <motion.section
      id="stack"
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="scroll-mt-32"
    >
      <SectionHeader index="01" title="Tech Stack" />
      {(!skills || skills.length === 0) ? (
        <p className="font-mono text-[11px] uppercase tracking-widest text-gray-400">Waiting for tools…</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {categories.map((catId) => {
            const catSkills = skills.filter((s) => (s.category || 'other') === catId);
            if (catSkills.length === 0) return null;
            return (
              <div key={catId} className="space-y-4">
                <h3 className={`font-mono text-[10px] font-semibold uppercase tracking-[0.25em] ${CATEGORY_COLOR[catId.toLowerCase()] || 'text-sky-400'}`}>
                  {cap(catId)}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {catSkills.map((skill) => (
                    <Badge
                      key={skill.id}
                      variant="secondary"
                      className="flex items-center gap-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 px-4 py-2.5 text-[11px] font-semibold text-gray-600 dark:text-gray-300 hover:border-sky-400/40 hover:text-sky-400 transition-colors"
                    >
                      <Icon icon={skill.icon_name || 'ph:code-bold'} className="text-sm" />
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.section>
  );
};
```

- [ ] **Step 2: Build to typecheck**

Run: `npm run build`
Expected: build succeeds. Confirm `Skill` has `id`, `name`, `category`, `icon_name` (read `frontend/src/features/skills/api.ts`); adjust if names differ.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/features/portfolio/components/TechStack.tsx
git commit -m "feat: editorial tech stack section"
```

---

## Task 14: `ProjectModal` (full-view overlay)

**Files:**
- Create: `frontend/src/features/portfolio/components/ProjectModal.tsx`

**Inputs:** `project: Project | null`, `onClose: () => void`. Extracted from the existing overlay in `Portfolio.tsx:306-349`.

- [ ] **Step 1: Create the component**

```tsx
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
```

- [ ] **Step 2: Build to typecheck**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/features/portfolio/components/ProjectModal.tsx
git commit -m "feat: extract project modal component"
```

---

## Task 15: `Projects` section with filter + search

**Files:**
- Create: `frontend/src/features/portfolio/components/Projects.tsx`

**Inputs:** `projects: Project[]`, `loading: boolean`, `onOpen: (p: Project) => void`. Owns filter/search state. Derives the tag set from project tags. Uses Framer `layout` for animated reorder.

- [ ] **Step 1: Create the component**

```tsx
import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Github, ExternalLink, Image as ImageIcon, Maximize2, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SectionHeader } from './SectionHeader';
import { ProjectSkeleton } from './Skeletons';
import type { Project } from '../../projects/api';

interface ProjectsProps {
  projects: Project[];
  loading: boolean;
  onOpen: (p: Project) => void;
}

export const Projects = ({ projects, loading, onOpen }: ProjectsProps) => {
  const [activeTag, setActiveTag] = useState<string>('all');
  const [query, setQuery] = useState('');

  const tags = useMemo(() => {
    const set = new Set<string>();
    (projects || []).forEach((p) => (p.tags || []).forEach((t) => set.add(t)));
    return ['all', ...Array.from(set)];
  }, [projects]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (projects || []).filter((p) => {
      const tagOk = activeTag === 'all' || (p.tags || []).includes(activeTag);
      const textOk = !q ||
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(q));
      return tagOk && textOk;
    });
  }, [projects, activeTag, query]);

  return (
    <motion.section
      id="projects"
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="scroll-mt-32"
    >
      <SectionHeader index="02" title="Selected Work" />

      {!loading && projects.length > 0 && (
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`rounded-lg px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                  activeTag === tag
                    ? 'bg-sky-400 text-white'
                    : 'bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-sky-400'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="h-9 w-full md:w-56 rounded-lg border border-gray-200 dark:border-white/10 bg-transparent pl-9 pr-3 font-mono text-xs outline-none placeholder:text-gray-400 focus:border-sky-400/50"
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProjectSkeleton /><ProjectSkeleton />
        </div>
      ) : filtered.length > 0 ? (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="group overflow-hidden rounded-3xl border-gray-200 dark:border-white/10 bg-gray-50/30 dark:bg-white/5 shadow-none transition-all duration-500 hover:border-sky-400/30 hover:shadow-2xl hover:shadow-sky-400/5">
                  <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-900">
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="h-full w-full cursor-zoom-in object-cover transition-transform duration-700 group-hover:scale-110"
                        onClick={() => onOpen(project)}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ImageIcon className="text-gray-300 dark:text-gray-700" size={40} />
                      </div>
                    )}
                    <div className="absolute right-4 top-4 flex translate-y-2 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      {project.image_url && (
                        <Button size="icon" onClick={() => onOpen(project)} className="h-10 w-10 rounded-xl bg-white/90 text-black shadow-xl hover:bg-sky-400 dark:bg-black/90 dark:text-white" title="Full view">
                          <Maximize2 size={16} />
                        </Button>
                      )}
                      {project.github_link && (
                        <Button size="icon" asChild className="h-10 w-10 rounded-xl bg-white/90 text-black shadow-xl hover:bg-sky-400 dark:bg-black/90 dark:text-white">
                          <a href={project.github_link} target="_blank" rel="noopener noreferrer"><Github size={16} /></a>
                        </Button>
                      )}
                      {project.github_link && (
                        <Button size="icon" asChild className="h-10 w-10 rounded-xl bg-sky-400 text-white shadow-xl hover:bg-sky-500">
                          <a href={project.github_link} target="_blank" rel="noopener noreferrer"><ExternalLink size={16} /></a>
                        </Button>
                      )}
                    </div>
                  </div>
                  <CardContent className="space-y-4 p-6">
                    <div className="space-y-1">
                      <h3 className="font-display text-base font-extrabold uppercase tracking-tight text-ink dark:text-paper transition-colors group-hover:text-sky-400">{project.title}</h3>
                      <p className="line-clamp-2 text-xs font-medium leading-relaxed text-gray-500 dark:text-gray-400">{project.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {project.tags?.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="rounded-lg border-none bg-gray-100 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-gray-400 dark:bg-white/5">{tag}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="rounded-3xl border-2 border-dashed border-gray-200 py-20 text-center dark:border-white/10">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-gray-400">
            {projects.length === 0 ? 'Workshop is currently empty' : 'No projects match'}
          </p>
        </div>
      )}
    </motion.section>
  );
};
```

- [ ] **Step 2: Build to typecheck**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/features/portfolio/components/Projects.tsx
git commit -m "feat: projects section with tag filter and search"
```

---

## Task 16: `Experience` section

**Files:**
- Create: `frontend/src/features/portfolio/components/Experience.tsx`

**Inputs:** `experiences: Experience[]`, `loading: boolean`.

- [ ] **Step 1: Create the component**

```tsx
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from './SectionHeader';
import { ExperienceSkeleton } from './Skeletons';
import type { Experience as Exp } from '../../experience/api';

interface ExperienceProps {
  experiences: Exp[];
  loading: boolean;
}

export const Experience = ({ experiences, loading }: ExperienceProps) => (
  <motion.section
    id="experience"
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="scroll-mt-32"
  >
    <SectionHeader index="03" title="Professional Path" />
    {loading ? (
      <div className="space-y-10"><ExperienceSkeleton /><ExperienceSkeleton /></div>
    ) : experiences.length > 0 ? (
      <div className="ml-4 space-y-12">
        {experiences.map((exp) => (
          <div key={exp.id} className="group relative border-l-2 border-gray-200 dark:border-white/10 py-2 pl-12">
            <div className="absolute left-0 top-4 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-gray-200 bg-paper transition-all duration-300 group-hover:scale-125 group-hover:border-sky-400 dark:border-white/10 dark:bg-ink" />
            <div className="space-y-2">
              <div className="flex flex-col justify-between gap-2 md:flex-row md:items-baseline">
                <h3 className="font-display text-lg font-extrabold uppercase tracking-tight text-ink dark:text-paper transition-colors group-hover:text-sky-400">{exp.role}</h3>
                <Badge variant="outline" className="h-6 rounded-lg border-gray-200 font-mono text-[9px] uppercase tracking-widest text-gray-400 dark:border-white/10">{exp.period}</Badge>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-sky-400">
                <Terminal size={14} /> {exp.company}
              </div>
              <p className="max-w-2xl pt-2 text-sm font-medium leading-relaxed text-gray-500 dark:text-gray-400">{exp.description}</p>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="rounded-3xl border-2 border-dashed border-gray-200 py-20 text-center dark:border-white/10">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-gray-400">Timeline is waiting for history</p>
      </div>
    )}
  </motion.section>
);
```

- [ ] **Step 2: Build to typecheck**

Run: `npm run build`
Expected: build succeeds. Confirm `Experience` type has `id`, `role`, `company`, `period`, `description` (read `frontend/src/features/experience/api.ts`); adjust if names differ.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/features/portfolio/components/Experience.tsx
git commit -m "feat: editorial experience timeline section"
```

---

## Task 17: `Contact` section

**Files:**
- Create: `frontend/src/features/portfolio/components/Contact.tsx`

**Inputs:** `profile: Profile | null`. Uses `MagneticButton`.

- [ ] **Step 1: Create the component**

```tsx
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
```

- [ ] **Step 2: Build to typecheck**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/features/portfolio/components/Contact.tsx
git commit -m "feat: editorial contact section"
```

---

## Task 18: Recompose `Portfolio.tsx` + fix loading

**Files:**
- Modify (full replace): `frontend/src/features/portfolio/pages/Portfolio.tsx`

**Goal:** Page owns data fetching with a real loading state (replaces the `setTimeout(500)` hack) and composes the section components.

- [ ] **Step 1: Replace the file contents**

```tsx
import { useEffect, useState } from 'react';
import { getProjects, type Project } from '../../projects/api';
import { getExperiences, type Experience as Exp } from '../../experience/api';
import { getSkills, type Skill } from '../../skills/api';
import { getProfile, type Profile } from '../profileApi';
import { Hero } from '../components/Hero';
import { TechStack } from '../components/TechStack';
import { Projects } from '../components/Projects';
import { Experience } from '../components/Experience';
import { Contact } from '../components/Contact';
import { ProjectModal } from '../components/ProjectModal';

export const Portfolio = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Exp[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Project | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.allSettled([
      getProjects().then((d) => active && setProjects(d)),
      getExperiences().then((d) => active && setExperiences(d)),
      getSkills().then((d) => active && setSkills(d)),
      getProfile().then((d) => active && setProfile(d)),
    ]).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  return (
    <div className="min-h-screen bg-paper text-ink dark:bg-ink dark:text-paper font-sans selection:bg-sky-100 dark:selection:bg-sky-900/30">
      <div className="mx-auto max-w-5xl space-y-24 px-6 pb-12">
        <Hero profile={profile} />
        <TechStack skills={skills} />
        <Projects projects={projects} loading={loading} onOpen={setSelected} />
        <Experience experiences={experiences} loading={loading} />
        <Contact profile={profile} />
        <footer className="pb-12 text-center font-mono text-[10px] uppercase tracking-[0.4em] text-gray-400 opacity-50">
          &copy; {new Date().getFullYear()} {profile?.full_name || 'RIKU'} &bull; DESIGNED FOR PERFORMANCE
        </footer>
      </div>
      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </div>
  );
};
```

- [ ] **Step 2: Build + lint**

Run: `npm run build && npm run lint`
Expected: both succeed, no unused-import warnings from the old code.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/features/portfolio/pages/Portfolio.tsx
git commit -m "refactor: compose portfolio from sections, fix loading state"
```

---

## Task 19: Navbar — editorial type + ⌘K hint

**Files:**
- Modify: `frontend/src/components/Navbar.tsx`

- [ ] **Step 1: Add a ⌘K hint button in the desktop nav cluster**

In `Navbar.tsx`, inside the desktop nav container (the `<div className="hidden md:flex items-center bg-gray-50/50 ...">` block, currently lines 107-121), after the `navLinks.map(...)` block and before the closing `</div>`, add:

```tsx
          <button
            onClick={() => {
              document.dispatchEvent(
                new KeyboardEvent('keydown', { key: 'k', metaKey: true })
              );
            }}
            className="flex items-center gap-1.5 rounded-md border border-gray-200 dark:border-white/10 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-gray-400 hover:text-sky-400 transition-colors"
            aria-label="Open command palette"
          >
            ⌘K
          </button>
```

Note: the synthetic `keydown` is caught by the `CommandPalette` global listener (Task 7), which toggles the palette.

- [ ] **Step 2: Apply mono font to nav link labels**

In the same file, change the `navLinks.map` button `className` (currently line 115) by adding `font-mono` and removing nothing else:

Replace:
```tsx
              className="text-[10px] font-black tracking-[0.2em] text-gray-400 hover:text-sky-400 transition-colors relative group uppercase"
```
With:
```tsx
              className="font-mono text-[10px] font-semibold tracking-[0.2em] text-gray-400 hover:text-sky-400 transition-colors relative group uppercase"
```

- [ ] **Step 3: Build + lint**

Run: `npm run build && npm run lint`
Expected: both succeed.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/Navbar.tsx
git commit -m "feat: command palette hint and mono nav labels"
```

---

## Task 20: Re-skin Login page

**Files:**
- Modify: `frontend/src/features/auth/pages/Login.tsx`

**Goal:** Apply editorial tokens (display headline, mono labels, paper/ink surfaces) without changing the auth logic (`handleSubmit`, state).

- [ ] **Step 1: Update the surface + header copy classes**

Change the outer wrapper (line 36) from `bg-gray-50 dark:bg-black` to `bg-paper dark:bg-ink`.

Change `CardTitle` (line 45) class to:
```tsx
            <CardTitle className="font-display text-2xl font-black uppercase tracking-tight text-ink dark:text-paper">Admin Portal</CardTitle>
```

Change the two `Label` classes (lines 53 and 69) to use mono:
```tsx
            <Label className="ml-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">Email / Username</Label>
```
```tsx
                <Label className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">Password</Label>
```

Change the submit `Button` class (line 87) to use mono tracking:
```tsx
              className="h-14 w-full rounded-xl bg-ink dark:bg-paper text-paper dark:text-ink font-mono text-xs font-semibold uppercase tracking-widest shadow-xl shadow-black/5 transition-all hover:bg-sky-400 hover:text-white active:scale-[0.98]"
```

- [ ] **Step 2: Build + lint**

Run: `npm run build && npm run lint`
Expected: both succeed.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/features/auth/pages/Login.tsx
git commit -m "style: editorial re-skin of login page"
```

---

## Task 21: Re-skin dashboard editors (ProjectList + UserProfile)

**Files:**
- Modify: `frontend/src/features/projects/pages/ProjectList.tsx`
- Modify: `frontend/src/features/users/pages/UserProfile.tsx`

**Goal:** Visual consistency only — apply the editorial type system to headings/labels and paper/ink surfaces. Do not change CRUD logic, props, or data flow.

- [ ] **Step 1: Read both files**

Read `frontend/src/features/projects/pages/ProjectList.tsx` and `frontend/src/features/users/pages/UserProfile.tsx` in full to inventory the page headings, section labels, and primary buttons.

- [ ] **Step 2: Apply editorial classes**

For each page-level heading (the largest title text), add `font-display` and keep `font-black uppercase tracking-tight`. For each small uppercase label/eyebrow, switch the font to `font-mono` and weight to `font-semibold`. For any full-page background using `bg-white`/`bg-gray-50`/`bg-black`, change to `bg-paper dark:bg-ink`. Leave all `onClick`, form, and state code untouched.

Apply the same hover-accent convention already used elsewhere: primary action buttons use `bg-ink dark:bg-paper text-paper dark:text-ink ... hover:bg-sky-400 hover:text-white`.

- [ ] **Step 3: Build + lint**

Run: `npm run build && npm run lint`
Expected: both succeed.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/features/projects/pages/ProjectList.tsx frontend/src/features/users/pages/UserProfile.tsx
git commit -m "style: editorial re-skin of dashboard editors"
```

---

## Task 22: Final verification pass

**Files:** none (verification only)

- [ ] **Step 1: Clean build + lint**

Run (from `frontend/`): `npm run build && npm run lint`
Expected: both succeed with zero errors.

- [ ] **Step 2: Run the dev server and manually verify**

Run: `npm run dev` and open the served URL. Confirm each item:

- [ ] Fonts load (display headline is Archivo, labels are Geist Mono).
- [ ] Hero: rotating word cycles; numbered index nav scrolls to sections; magnetic CTA drifts on hover; avatar renders (or fallback icon).
- [ ] Scroll progress bar fills as you scroll.
- [ ] Tech stack groups by category with icons.
- [ ] Projects: tag filter switches the grid with animation; search narrows results; "Full view" opens the modal; modal closes on backdrop/X/Escape.
- [ ] Experience timeline renders with mono dates.
- [ ] Contact CTA opens mail client.
- [ ] ⌘K (and the navbar ⌘K button) opens the palette; Navigate items scroll; Toggle theme flips light/dark and persists on reload; Copy email shows a toast; GitHub/LinkedIn open; Dashboard/Login item routes correctly.
- [ ] Empty states still show when data is absent (filter to an unused tag, or with no projects).
- [ ] Login page reflects the editorial style; login still works.
- [ ] Dashboard (ProjectList) + Profile pages reflect the editorial style; CRUD still works.
- [ ] In OS settings enable "reduce motion" and reload: rotating word freezes, magnetic effect is off, reveals are instant.
- [ ] Mobile width (<768px): hero stacks, nav sheet works, index nav wraps to 2 columns.

- [ ] **Step 3: Commit any fixes found during manual QA**

```bash
git add -A
git commit -m "fix: manual QA adjustments for editorial redesign"
```

---

## Self-Review (completed by plan author)

**Spec coverage:**
- Design system (type/color/grid/tokens) → Tasks 2, 3.
- Hero rethink + animated headline + kinetic bg + index nav → Tasks 11, 12.
- Tech stack editorial → Task 13.
- Projects + filter/search/animated grid + modal → Tasks 14, 15.
- Experience timeline → Task 16.
- Contact + magnetic CTA → Task 17, 6.
- Scroll/motion polish (progress bar, reveals, magnetic) → Tasks 5, 6, sections.
- Command palette (all actions) → Tasks 1, 7, 8, 19.
- Code split of Portfolio.tsx + loading fix + skeletons → Tasks 9, 10, 18.
- Auth + dashboard re-skin → Tasks 20, 21.
- Accessibility (reduced motion) → Tasks 3, 4, used throughout; verified Task 22.
- Fonts via Google + preconnect → Task 2.

**Placeholder scan:** No "TBD"/"TODO"/"handle edge cases" — every code step contains full code. Tasks 21's editor re-skin gives explicit rules rather than verbatim code because those files are read at execution time (Step 1); this is intentional and bounded.

**Type consistency:** Section components import existing exported types (`Project`, `Experience`, `Skill`, `Profile`). Tasks 7/12/13/16 include an explicit "confirm field names" step so the engineer reconciles any drift against the real API types without editing the API. The `Experience` type is aliased to `Exp` consistently in Tasks 16 and 18 to avoid clashing with the `Experience` component name.

**Verification model:** Build + lint + manual checklist (no test runner in repo by design).
