# Portfolio UI/UX Modernization — Design Spec

**Date:** 2026-06-10
**Status:** Approved
**Direction:** Refined modern-minimal evolution · dark-first · full-app scope

## Goal

Elevate the existing React portfolio dashboard to modern SaaS / DevSecOps-grade
production quality without changing its core personality. Keep the monochrome +
sky-400 bones; add depth, rhythm, motion craft, and consistency. Target audience
signal: DevSecOps Developer / Software Developer.

## Constraints & Foundations

- Stack: React 19, Vite 7, Tailwind v4 (`@theme` in `index.css`), shadcn/Radix
  primitives, framer-motion 12, lucide + iconify.
- Pages currently hardcode `bg-white dark:bg-black`, `text-black dark:text-white`,
  `bg-gray-50`, pure `#000`. The redesign edits each page directly (semantic
  tokens are not consistently used today).
- No backend/API changes. Visual + interaction layer only.
- Respect `prefers-reduced-motion`.

## Design System Changes

### Tokens (`frontend/src/index.css`)
- **Dark-first**: dark is the default mode; light is opt-in via toggle.
- Replace pure black with layered near-black: base `~#0a0b0d`, elevated surface
  `~#111317`, so cards read as layers not voids. Keep light mode clean white.
- Sky-400 accent ramp + a soft **cyan→sky glow** token for focus/hover states.
- Add a **monospace** font token (JetBrains Mono / `ui-monospace`) for metadata
  micro-labels (section indices, status chips) — a subtle DevSecOps nod.
- Standardize radius, shadow, and a reusable **glass surface** pattern
  (`backdrop-blur` + 1px hairline border + faint inner highlight).
- Shared framer-motion easing/transition preset; gate motion on reduced-motion.

### Shared UI primitives (`frontend/src/components/ui/`)
- `button`, `card`, `badge`, `input`: refined surfaces + focus-glow ring applied
  centrally so consistency propagates everywhere.

## Per-Surface Work

1. **Portfolio** (`features/portfolio/pages/Portfolio.tsx`)
   - Hero: aurora/grid glow behind avatar, refined type scale, animated live
     status chip (`● Available`, pulse). Tagline → "Design. Code. Secure."
   - Stack: glass tiles, hover lift + accent ring, subtle icon glow.
   - Projects: real hover elevation, gradient image fallback, staggered reveals.
   - Experience: timeline node glow pulse, gradient connector line.
   - Section headers gain mono index labels (`01 / STACK`).

2. **Navbar + Layout** (`components/Navbar.tsx`, `components/Layout.tsx`)
   - Stronger glass on scroll, animated active-section indicator, refined toggle.
   - Default theme = dark when no stored preference.

3. **Login** (`features/auth/pages/Login.tsx`)
   - Dark glass card, glow accent bar, mono labels — reads like a secure console.

4. **Dashboard** (`features/projects/pages/ProjectList.tsx` + embedded
   `ProfileEditor`, `SkillList`, `ExperienceList`)
   - Glass surfaces + token updates; consistent header/section treatment.

5. **User Profile** (`features/users/pages/UserProfile.tsx`)
   - Glass cards, refined tabs, consistent surfaces.

## Execution Plan

Shared files (`index.css`, `ui/` primitives) are a conflict surface, so they are
established **first** as a single coherent foundation. Page implementations touch
**independent files**, so they are then dispatched as **parallel agents** (one
per surface) with strict file ownership — no two agents edit the same file.
A final **QA agent** clicks through every route in light + dark, checks responsive
layout and console errors, and fixes regressions.

- Phase 1 (foundation, serial): tokens + shared primitives + dark-first default.
- Phase 2 (parallel agents): Portfolio · Navbar/Layout · Login · Dashboard · Profile.
- Phase 3 (QA agent): cross-route, cross-theme, responsive audit + fixes.

## Success Criteria

- App builds (`npm run build`) and lints clean.
- Every route renders correctly in both dark (default) and light modes.
- No console errors; responsive at mobile + desktop widths.
- Consistent glass/glow/accent language across all surfaces.
- Reduced-motion respected.
