# Editorial / Swiss Portfolio Redesign

**Date:** 2026-06-13
**Status:** Approved for spec review
**Scope:** Full visual rethink of the public portfolio + auth/dashboard surfaces, with interactive features.

## Goal

Transform the existing minimalist portfolio into an art-directed Editorial / Swiss
experience that evolves the current "minimal. fast. precise." identity. Add modern
interactive features (scroll/motion polish, animated hero, ⌘K command palette,
project filtering) without sacrificing performance or accessibility.

## Decisions (locked)

- **Aesthetic:** Editorial / Swiss — big confident typography, strong visible grid,
  generous whitespace, monochrome + one accent, numbered sections.
- **Accent:** Keep the existing sky-blue (`#38BDF8`) for brand continuity.
- **Fonts:** Google Fonts — `Archivo` (display), `Inter` (body), `Geist Mono` (labels/indices).
- **Surfaces in scope:** Public portfolio, navbar, login page, dashboard/admin editors.
- **Interactive features:** scroll & motion polish, animated hero, command palette, project filtering — all four.

## Design System

Centralized in `frontend/src/index.css` as tokens.

### Typography
- **Display** — `Archivo` (tight grotesk), used at large sizes for section headlines
  and the hero statement. Heavy weights, tight tracking, leading ~0.9.
- **Body** — `Inter`, for paragraphs and descriptions.
- **Mono** — `Geist Mono`, for editorial labels: section indices (`01 /`), badges,
  dates, metadata, the command-palette hint. This grotesk↔mono contrast IS the Swiss look.

### Color
- Monochrome base: off-white `#FAFAFA` / near-black `#0A0A0A` (light/dark).
- Single accent: sky `#38BDF8`, used sparingly (active states, the dot, one CTA).
- Hairline rules: `border` token at low opacity for the grid/divider system.

### Layout primitives
- Visible 12-column grid with a max content width (`~72rem`).
- Consistent spacing scale (Tailwind defaults, used deliberately).
- Numbered sections `01–04` with mono indices and a hairline rule under each header.

## Layout (per section)

### Hero
- Oversized typographic statement: `FULL-STACK ENGINEER →` with an animated rotating
  sub-word cycling "minimal / fast / precise".
- Availability badge (mono), name, short bio pulled from `profile`.
- Numbered index nav: `01 / stack … 04 / contact` (anchors to sections).
- Avatar integrated at smaller scale (not centered hero focus).
- Subtle Swiss-appropriate animated background: faint kinetic grid/rule lines
  (CSS/Framer, low opacity) — NOT particles.

### 01 — Tech Stack
- Categories as editorial columns with mono category labels and hairline dividers.
- Skill chips retain Iconify icons; refined hover.

### 02 — Projects
- Editorial grid with **tag/tech filter + text search** controls (mono labels).
- Animated grid reordering on filter change via Framer Motion `layout`.
- Richer project detail modal (existing full-view overlay, upgraded).
- Empty/loading states use skeletons.

### 03 — Experience
- Clean numbered timeline, mono dates/periods, hairline connector.

### 04 — Contact
- Large editorial statement + magnetic primary CTA (mailto).
- Social links as mono-labeled row.

### Footer
- Mono, low-opacity, year + name.

## Interactive Features

1. **Scroll & motion polish**
   - Top scroll-progress bar (fixed, accent fill).
   - Scroll-reveal per section (Framer `whileInView`, refined easing/stagger).
   - Magnetic buttons (cursor-follow translate on primary CTAs).
   - Refined card/link hover states.
2. **Animated hero** — rotating sub-word, animated headline entrance, kinetic grid bg.
3. **⌘K command palette** (`cmdk`)
   - Jump to sections (stack/projects/experience/contact).
   - Toggle light/dark theme.
   - Copy email to clipboard (toast confirm via existing sonner).
   - Open GitHub / LinkedIn.
   - Go to Dashboard (if authed) / Login.
   - Opens on `⌘K` / `Ctrl+K`; hint shown in navbar.
4. **Project filtering** — derive tag set from project tags; filter + search; animated grid.

## Code Structure

Split the 352-line `frontend/src/features/portfolio/pages/Portfolio.tsx` into focused units:

```
features/portfolio/
  pages/Portfolio.tsx            # composes sections, owns data fetching
  components/
    Hero.tsx
    TechStack.tsx
    Projects.tsx                 # owns filter/search state
    Experience.tsx
    Contact.tsx
    ProjectModal.tsx
    AnimatedHeadline.tsx
shared/components/
    CommandPalette.tsx
    ScrollProgress.tsx
    MagneticButton.tsx
```

Each section component receives its data + `loading` via props; `Portfolio.tsx` owns
fetching. `CommandPalette` and `ScrollProgress` mount in `Layout.tsx` so they're
available app-wide (palette navigation falls back to routing when off the portfolio page).

### Correctness fixes
- Replace `setTimeout(() => setLoading(false), 500)` with proper `await Promise.allSettled([...])`
  so loading reflects real fetch completion; render skeletons while loading.
- Keep the existing per-request `.catch` resilience (one failure doesn't block others).

### Auth surfaces
- Apply the type/color/grid tokens to `features/auth/pages/Login.tsx` and the
  dashboard/admin editors (`ProfileEditor`, list/editor components) for consistency.
  Structural layout of dashboard stays; only the visual system is updated.

## Dependencies

- **Add:** `cmdk` (command palette).
- **Add:** Google Fonts (`Archivo`, `Inter`, `Geist Mono`) via `<link>` in `index.html`
  (preconnect + display=swap).
- **Reuse:** Framer Motion, Tailwind v4, Radix, lucide-react, @iconify/react, sonner.

## Accessibility & Performance

- Respect `prefers-reduced-motion` — disable kinetic bg, rotating word, magnetic
  effects, and reveal transforms when set.
- Command palette: focus trap, Escape to close, ARIA roles (cmdk handles most).
- Fonts loaded with `display=swap` + preconnect to avoid layout shift / FOIT.
- Animated background kept lightweight (CSS-driven where possible).

## Out of Scope

- Backend/API changes (data shapes unchanged).
- New content sections beyond the existing four.
- i18n, blog, analytics.

## Testing / Verification

- `npm run build` (tsc + vite) passes with no type errors.
- `npm run lint` passes.
- Manual: portfolio renders with live/empty/loading data; ⌘K works; theme toggle
  persists; project filter reorders; reduced-motion honored; login + dashboard
  visually consistent.
