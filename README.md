# React Starter

A full-stack React starter template built with TanStack Start. Fork this to get auth, routing, data fetching, state management, and a component library wired up and ready to go.

## Tech Stack

- **[TanStack Start](https://tanstack.com/start)** — SSR-capable React framework on Vite
- **[TanStack Router](https://tanstack.com/router)** — File-based, type-safe routing
- **[TanStack Query](https://tanstack.com/query)** — Server-state management with SSR dehydration
- **[Zustand](https://zustand-demo.pmnd.rs/)** — Client-state management with persistence
- **[shadcn/ui](https://ui.shadcn.com/)** — Accessible component library (new-york style)
- **[Tailwind CSS v4](https://tailwindcss.com/)** — Utility-first styling, dark mode support

## Features

- **Auth flow** — Register, login, and logout backed by localStorage. Structured for easy JWT swap-in: `login()` accepts a user object so the store requires no changes when connecting a real backend.
- **Protected routes** — `/customers` redirects to `/login` when unauthenticated, using TanStack Router's `beforeLoad`. SSR-safe (guarded with `typeof window` check).
- **Data fetching** — TanStack Query with a custom hook pattern (`src/hooks/`). Query calls live in hooks, not inline in components.
- **API service layer** — `src/lib/api.ts` provides `buildUrl` and `buildRequest` helpers. All endpoints are in `src/services/ApiService.ts`. Configure your base URL via `VITE_API_BASE_URL` and Bearer token injection is handled automatically from the auth store.
- **Dark mode** — Light/dark toggle persisted to localStorage. Flash-free: an inline script applies the theme class before React hydrates.
- **SSR-safe Zustand** — Persisted stores use `skipHydration: true` with manual client rehydration, preventing server-side localStorage crashes.

## Local Setup

### Prerequisites

- Node.js 18+
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)

### Install

```bash
git clone https://github.com/mrlinnth/react-starter.git
cd react-starter
pnpm install
```

### Environment

```bash
cp .env.example .env
```

Edit `.env` and set `VITE_API_BASE_URL` to your API's base URL. The demo uses `https://jsonplaceholder.typicode.com`.

### Run

```bash
pnpm dev       # http://localhost:3000
pnpm build     # production build
pnpm preview   # preview production build
```

## Development

```bash
pnpm test      # run tests (Vitest)
pnpm lint      # ESLint
pnpm check     # Prettier + ESLint fix
```

Run a single test file:

```bash
pnpm vitest run src/path/to/file.test.tsx
```

Add a shadcn component:

```bash
pnpm dlx shadcn@latest add <component>
```

## Project Structure

```
src/
├── components/
│   ├── layout/          # TopNavigation, Layout
│   └── ui/              # shadcn components
├── hooks/               # custom hooks (e.g. useCustomers)
├── lib/
│   ├── api.ts           # buildUrl, buildRequest helpers
│   └── utils.ts         # cn() utility
├── routes/              # file-based pages (__root, index, customers, login, register)
├── services/
│   └── ApiService.ts    # all API endpoint functions
├── store/               # Zustand stores (auth, counter, theme)
└── styles.css           # Tailwind + CSS variables
```

## Forking for a Real Project

1. Set `VITE_API_BASE_URL` in `.env`
2. Replace the localStorage mock in `login.tsx` / `register.tsx` with real API calls
3. Update `useAuthStore` user type and `buildRequest` token field to match your JWT payload
4. Add new endpoints to `ApiService.ts` and new query hooks to `src/hooks/`
