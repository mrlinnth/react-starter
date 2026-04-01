# Handoff: Phase 3 - Layout and Root Route

**Generated**: 2026-04-01  
**Branch**: `feature/todo-spa-implementation`  
**For**: glm-4.6

---

## Context

Create the new layout components (TopNavigation + Layout) and update the root route. This wires together the stores from Phase 2 and sets up the navigation shell for all pages. After this phase, the app will have a working nav bar with auth-aware links and theme toggle.

---

## Current State

**Already completed (Phase 1 + 2):**

- Branch created, Zustand + shadcn components installed
- `src/store/useAuthStore.ts` — auth store (skipHydration: true)
- `src/store/useThemeStore.ts` — theme store (skipHydration: true)
- `src/store/useCounterStore.ts` — counter store
- `src/lib/queryClient.ts` — QueryClient singleton
- `src/components/ui/button.tsx`, `input.tsx`, `table.tsx`, `card.tsx` — shadcn components

**Files that exist (do NOT modify):**

- `src/routes/__root.tsx` — will be modified in subtask 3.3
- `src/components/Header.tsx` — OLD header, will be unused after this phase (do NOT delete)
- `src/components/Footer.tsx` — OLD footer, will be unused after this phase (do NOT delete)
- `src/components/ThemeToggle.tsx` — OLD toggle, will be unused (do NOT delete)

**Uncommitted changes:**

- None expected

---

## Remaining Subtasks

### 3.1: Create `src/components/layout/TopNavigation.tsx`

- **File**: `src/components/layout/TopNavigation.tsx` (CREATE — also creates `src/components/layout/` directory)
- **Action**: Create new file
- **Details**:

  ```tsx
  import { Link, useNavigate } from '@tanstack/react-router'
  import { Button } from '#/components/ui/button'
  import { useAuthStore } from '#/store/useAuthStore'
  import { useThemeStore } from '#/store/useThemeStore'

  export function TopNavigation() {
    const navigate = useNavigate()
    const { isAuthenticated, user, logout } = useAuthStore()
    const { theme, toggleTheme } = useThemeStore()

    const handleLogout = () => {
      logout()
      navigate({ to: '/' })
    }

    return (
      <nav className="flex items-center justify-between px-6 py-3 border-b">
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link to="/">Home</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/customers">Customers</Link>
          </Button>
          {isAuthenticated ? (
            <>
              <span className="text-sm px-3">Hello, {(user as any)?.name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={toggleTheme}>
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </Button>
      </nav>
    )
  }
  ```

- **Logic**:
  - `asChild` on `Button` passes the button styles to the `<Link>` child (shadcn pattern)
  - `useNavigate` is from `@tanstack/react-router`
  - `user` typed as `any` for now since it comes from localStorage (mixed types)
- **Verify**: File exists, no TypeScript errors

**Status**: [x] Complete

---

### 3.2: Create `src/components/layout/Layout.tsx`

- **File**: `src/components/layout/Layout.tsx` (CREATE new file)
- **Action**: Create new file
- **Details**:

  ```tsx
  import { useEffect } from 'react'
  import { Outlet } from '@tanstack/react-router'
  import { TopNavigation } from './TopNavigation'
  import { useAuthStore } from '#/store/useAuthStore'
  import { useThemeStore } from '#/store/useThemeStore'

  export function Layout() {
    useEffect(() => {
      useAuthStore.persist.rehydrate()
      useThemeStore.persist.rehydrate()
    }, [])

    return (
      <div className="min-h-screen flex flex-col">
        <TopNavigation />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    )
  }
  ```

- **Logic**:
  - The `useEffect` with `[]` runs once on the client after hydration. It triggers the Zustand persist rehydration for both stores (they have `skipHydration: true`, so they won't auto-rehydrate from localStorage — this call does it manually)
  - `Outlet` from TanStack Router renders the matched child route
- **Verify**: File exists, no TypeScript errors

**Status**: [x] Complete

---

### 3.3: Modify `src/routes/__root.tsx`

- **File**: `src/routes/__root.tsx` (MODIFY existing file)
- **Action**: Two changes to the existing file:
  1. Remove `<Header />` and `<Footer />` from `RootDocument`
  2. Add `component: RootLayout` to the route + add `RootLayout` function

**Current content** of `src/routes/__root.tsx`:

```tsx
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import Footer from '../components/Footer'
import Header from '../components/Header'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

const THEME_INIT_SCRIPT = `(function(){...})();`

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [...],
    links: [...],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]">
        <Header />
        {children}
        <Footer />
        <TanStackDevtools .../>
        <Scripts />
      </body>
    </html>
  )
}
```

**Changes to make**:

**Change 1** — Add import for `Layout` at the top (after existing imports):

```tsx
import { Layout } from '#/components/layout/Layout'
```

**Change 2** — Remove `Footer` and `Header` imports:

```tsx
// DELETE these two lines:
import Footer from '../components/Footer'
import Header from '../components/Header'
```

**Change 3** — Add `component: RootLayout` to the route definition:

```tsx
export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    // ... keep unchanged
  }),
  shellComponent: RootDocument,
  component: RootLayout, // <- ADD THIS LINE
})
```

**Change 4** — Remove `<Header />` and `<Footer />` from `RootDocument`, update body:

```tsx
function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]">
        {children}
        <TanStackDevtools
          config={{ position: 'bottom-right' }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
```

**Change 5** — Add `RootLayout` function after `RootDocument`:

```tsx
function RootLayout() {
  return <Layout />
}
```

- **Verify**: App starts with `pnpm dev`, nav appears at top of page, no Header/Footer from old components

**Status**: [x] Complete

---

### 3.4: Commit layout

- **Action**: Commit all new/modified files
- **Command**: `git add src/components/layout/ src/routes/__root.tsx && git commit -m "feat: add layout components and update root route"`
- **Verify**: `git log --oneline -1` shows the commit; app at localhost:3000 shows TopNavigation

**Status**: [x] Complete

---

## Reference Information

### TanStack Router `<Link>` with shadcn `Button`

The `asChild` prop on shadcn `Button` passes button styles to its single child element:

```tsx
// This renders an <a> tag styled as a button:
<Button variant="ghost" asChild>
  <Link to="/customers">Customers</Link>
</Button>
```

### TanStack Start shellComponent vs component

In TanStack Start:

- `shellComponent` — renders the outer HTML document (`<html>`, `<head>`, `<body>`). Its `{children}` prop is the entire client app tree rendered inside the body.
- `component` — a standard React route component. Rendered as part of the route tree. Uses `<Outlet />` to render child routes.

Both can be set on the same route. The `shellComponent` wraps the `component` output.

### Path aliases

- `#/` maps to `src/` — always use `#/` imports, not relative `../` paths for cross-directory imports

---

## Testing

After completing all subtasks:

1. `pnpm dev` — app starts at localhost:3000
2. Navigation bar appears with: Home, Customers, Login, Register links + theme toggle button
3. Theme toggle button switches between dark/light mode
4. No old Header or Footer visible
5. Existing routes (`/about`) still accessible

---

## When You're Done

1. Mark each subtask as complete: `[x]`
2. Update `docs/PROGRESS.md`: mark tasks 3.1-3.3 as completed
3. Proceed to Phase 4 handoff file: `.handoff/phase-4-routes.md`

---

## Questions?

If any subtask is unclear or you encounter unexpected issues:

1. **Do not guess** — ask for clarification
2. Note the specific subtask number and what's unclear

---

_This file was generated for handoff to a less capable model. The subtasks are intentionally atomic and detailed._
