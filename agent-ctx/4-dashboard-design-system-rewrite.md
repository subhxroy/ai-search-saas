# Task 4: Dashboard Design System Rewrite

## Summary
Rewrote `DashboardPage.tsx` to fully comply with the Resend-style design system, removing all old glass/gradient/cyan design patterns.

## Changes Made

### File: `/home/z/my-project/src/components/app/DashboardPage.tsx`

Complete rewrite of the DashboardPage component:

| Section | Old Pattern | New Pattern |
|---------|------------|-------------|
| Welcome header | `gradient-text` class | `var(--ink)` color + serif font via `var(--font-serif)` |
| Search bar | `glass-strong search-glow glow-border` | `var(--surface-card)` bg + `var(--hairline-strong)` border, 48px height |
| Submit button | `bg-gradient-to-br from-cyan-500 to-purple-500` | `btn-primary` class (white bg, black text) |
| Deep Research switch | `data-[state=checked]:bg-cyan-600` | `var(--accent-blue)` inline style |
| Quick action buttons | `glass rounded-full` | `btn-ghost` with pill border-radius |
| Icon colors | `text-cyan-400`, `text-purple-400`, `text-amber-400`, `text-emerald-400` | `var(--accent-blue)`, `var(--accent-orange)`, `var(--accent-yellow)`, `var(--accent-green)` |
| Conversation cards | `glass rounded-xl` | `feature-card-bordered` class |
| Conversation hover | `hover:text-cyan-400` | `var(--ink)` color |
| Loading skeletons | `bg-white/5` | `var(--surface-elevated)` |
| Trending topics | `glass rounded-full` | `badge-pill` class |
| Usage stats bar | `glass rounded-xl` | `feature-card-bordered` |
| Upgrade link | `text-cyan-400 hover:text-cyan-300` | `var(--accent-blue)` → `var(--ink)` on hover |

## Verification
- ESLint: passes cleanly (zero errors/warnings)
- Dev server: compiles without errors
- All functionality preserved (search, deep research, navigation, conversation fetching)
