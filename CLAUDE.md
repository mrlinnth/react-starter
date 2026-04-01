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

**Routing** — File-based via `src/routes/`. TanStack Router auto-generates `src/routeTree.gen.ts` from the file tree. `src/routes/__root.tsx` has two parts: `shellComponent` (HTML shell only) and `component` (renders `Layout`). `Layout` renders `TopNavigation` + `<Outlet />`. Add new routes by creating files under `src/routes/`.

**Router + Query integration** — `src/router.tsx` creates the router with a `QueryClient` in context (via `src/integrations/tanstack-query/root-provider.tsx`). This enables SSR-aware data fetching: use route `loader`s for initial data, or TanStack Query for client-side fetching. The `setupRouterSsrQueryIntegration` call dehydrates/rehydrates query state automatically.

**Path aliases** — `#/` maps to `src/` (configured in both `package.json#imports` and `tsconfig.json`). Shadcn aliases: `#/components`, `#/components/ui`, `#/lib`, `#/hooks`.

**Styling** — Tailwind CSS v4 (config-less, CSS-first). Global styles and CSS variables for shadcn theming in `src/styles.css`. The `cn()` utility in `src/lib/utils.ts` merges Tailwind classes.

**Shadcn** — Configured with "new-york" style, zinc base color, CSS variables, lucide icons. Components install to `src/components/ui/`.

**Theme** — Light/dark mode via `useThemeStore` (Zustand, persisted). Toggles `dark` class on `<html>`. An inline script in `__root.tsx` applies the class before hydration to prevent flash.

**State management** — Three Zustand stores in `src/store/`: `useAuthStore` (user + isAuthenticated, persisted), `useCounterStore` (ephemeral), `useThemeStore` (persisted). SSR rule: all persisted stores use `skipHydration: true` and are manually rehydrated in `Layout.tsx` via `useEffect`.

**Custom hooks** — TanStack Query calls belong in `src/hooks/`, not inline in route components. Example: `useCustomers` wraps `useQuery` + `ApiService.getUsers`. Route components import the hook.

**API layer** — `src/lib/api.ts` provides `buildUrl(endpoint, params?)` and `buildRequest(method, body?)`. `buildUrl` prepends `VITE_API_BASE_URL`; `buildRequest` sets JSON headers and injects a Bearer token from `useAuthStore` when present. All endpoint functions live in `src/services/ApiService.ts` and call these helpers. When forking, set `VITE_API_BASE_URL` in `.env` (see `.env.example`).

**Server functions** — Use `createServerFn` from `@tanstack/react-start` for server-side logic callable from components.
