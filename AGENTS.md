# Agent Guide for React SPA Feature Set

## Project Overview

**Tech Stack:**

- TanStack Start (SSR-capable React framework on Vite)
- TanStack Router (file-based routing)
- TanStack Query (SSR-aware data fetching)
- Zustand (state management with persist)
- Tailwind CSS v4 (config-less)
- shadcn/ui (component library)

**Architecture:**

- File-based routing via `src/routes/`
- Router auto-generates `src/routeTree.gen.ts`
- Root layout in `src/routes/__root.tsx`
- QueryClient in SSR context for dehydrated/rehydrated state
- Path aliases: `#/` maps to `src/`, `#/components`, `#/lib`, `#/hooks`

## Commands

```bash
pnpm dev          # Start dev server on port 3000
pnpm build        # Production build
pnpm test         # Run tests with Vitest
pnpm lint         # ESLint check
pnpm format       # Prettier check
pnpm check        # Prettier write + ESLint fix (auto-format)
```

Add shadcn components: `pnpm dlx shadcn@latest add <component>`

## SSR Considerations

**Critical for Zustand persist stores:**

- Use `skipHydration: true` in persist middleware options
- Manually rehydrate in client `useEffect` (empty deps array)
- Check `typeof window !== 'undefined'` before accessing browser APIs
- Check `typeof document !== 'undefined'` before DOM manipulation

**Auth guards in routes:**

- Wrap `beforeLoad` redirects in `typeof window !== 'undefined'`
- Access Zustand stores via `.getState()` in `beforeLoad` (not hooks)

## Shadcn Configuration

- Style: "new-york"
- Base color: zinc
- CSS variables: enabled
- Components install to: `src/components/ui/`
- Icons: lucide-react

## Current Task

Phase 1: Setup - Installing dependencies and creating feature branch

- Branch: `feature/todo-spa-implementation`
- Tasks: Install Zustand, add shadcn Button/Input/Table/Card

## Git Workflow

1. Work on feature branches, never main
2. Commit at logical checkpoints with conventional commits
3. Commit message format: `feat:`, `fix:`, `refactor:`, `chore:`
4. Never push without explicit permission

## Handoff Files

- `.handoff/phase-1-setup.md` - Phase 1 instructions
- `docs/PROGRESS.md` - Progress tracking
- `docs/implementation-checklist.md` - Full task list

After each phase, mark tasks complete in PROGRESS.md and proceed to next handoff file.
