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
- `src/routes/__root.tsx`: `shellComponent` (HTML shell) + `component` (renders `Layout`)
- `src/components/layout/Layout.tsx`: renders `TopNavigation` + `<Outlet />`
- QueryClient in SSR context for dehydrated/rehydrated state
- Path aliases: `#/` maps to `src/`, `#/components`, `#/lib`, `#/hooks`, `#/store`, `#/services`

**State management (Zustand stores in `src/store/`):**

- `useAuthStore` — user + isAuthenticated, persisted to localStorage (`"auth"`)
- `useCounterStore` — count, ephemeral
- `useThemeStore` — light/dark theme, persisted to localStorage (`"theme"`), toggles `dark` class on `<html>`
- All persisted stores use `skipHydration: true`; rehydrate in `Layout.tsx` `useEffect`

**API layer:**

- `src/lib/api.ts` — `buildUrl(endpoint, params?)` and `buildRequest(method, body?)`. Base URL from `VITE_API_BASE_URL`. Auto-injects Bearer token from `useAuthStore`.
- `src/services/ApiService.ts` — all endpoint functions (e.g. `getUsers()`). Always go through `buildUrl`/`buildRequest`.
- `src/hooks/` — TanStack Query calls belong here, not inline in route components (e.g. `useCustomers` wraps `useQuery` + `ApiService.getUsers`).

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

## Git Workflow

1. Work on feature branches, never main
2. Commit at logical checkpoints with conventional commits
3. Commit message format: `feat:`, `fix:`, `refactor:`, `chore:`
4. Never push without explicit permission
