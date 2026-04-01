# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server on port 3000
pnpm build        # Production build
pnpm test         # Run tests with Vitest
pnpm lint         # ESLint check
pnpm format       # Prettier check
pnpm check        # Prettier write + ESLint fix (auto-format)
```

Run a single test file: `pnpm vitest run src/path/to/file.test.tsx`

Add shadcn components: `pnpm dlx shadcn@latest add <component>`

## Architecture

This is a **TanStack Start** app (SSR-capable React framework built on Vite). Key architectural points:

**Routing** — File-based via `src/routes/`. TanStack Router auto-generates `src/routeTree.gen.ts` from the file tree. The root layout lives in `src/routes/__root.tsx` which wraps all routes with `Header`, `Footer`, and devtools. Add new routes by creating files under `src/routes/`.

**Router + Query integration** — `src/router.tsx` creates the router with a `QueryClient` in context (via `src/integrations/tanstack-query/root-provider.tsx`). This enables SSR-aware data fetching: use route `loader`s for initial data, or TanStack Query for client-side fetching. The `setupRouterSsrQueryIntegration` call dehydrates/rehydrates query state automatically.

**Path aliases** — `#/` maps to `src/` (configured in both `package.json#imports` and `tsconfig.json`). Shadcn aliases: `#/components`, `#/components/ui`, `#/lib`, `#/hooks`.

**Styling** — Tailwind CSS v4 (config-less, CSS-first). Global styles and CSS variables for shadcn theming in `src/styles.css`. The `cn()` utility in `src/lib/utils.ts` merges Tailwind classes.

**Shadcn** — Configured with "new-york" style, zinc base color, CSS variables, lucide icons. Components install to `src/components/ui/`.

**Theme** — Dark/light/auto mode persisted in `localStorage` under `'theme'`. An inline script in `__root.tsx` applies the theme class to `<html>` before hydration to prevent flash.

**Server functions** — Use `createServerFn` from `@tanstack/react-start` for server-side logic callable from components.
