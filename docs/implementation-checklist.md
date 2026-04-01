# Implementation Checklist: React SPA Feature Set

## Overview

Build a full SPA feature set on top of the existing TanStack Start project. The existing project has: TanStack Start (SSR), TanStack Router (file-based), TanStack Query, Tailwind CSS v4 (config-less), and shadcn/ui configured (but no components installed). No Zustand.

**Final result**: Auth flow (register/login/logout), protected customers page, counter demo, new layout with top nav.

---

### Phase 1: Setup

#### Task 1.1: Create feature branch

- Run `git checkout -b feature/todo-spa-implementation`

#### Task 1.2: Install Zustand

- Run `pnpm add zustand`

#### Task 1.3: Install shadcn components

- Run `pnpm dlx shadcn@latest add button`
- Run `pnpm dlx shadcn@latest add input`
- Run `pnpm dlx shadcn@latest add table`
- Run `pnpm dlx shadcn@latest add card`
- These install files into `src/components/ui/` and may update `src/styles.css`

---

### Phase 2: Stores and Query Client

#### Task 2.1: Create `src/lib/queryClient.ts`

- Export a singleton `new QueryClient()` instance
- Used for imperative cache access outside React; `useQuery` uses the SSR-provided context client automatically

#### Task 2.2: Create `src/store/useCounterStore.ts`

- Zustand store, no persist
- Shape: `{ count: number, increment: () => void, decrement: () => void }`
- Initial count: `0`

#### Task 2.3: Create `src/store/useAuthStore.ts`

- Zustand store with `persist` middleware
- Storage key: `"auth"`
- **`skipHydration: true`** (required for SSR — rehydrate manually on client)
- Shape: `{ user: Record<string, unknown> | null, isAuthenticated: boolean }`
- Actions: `login(userData)` sets user + isAuthenticated=true; `logout()` sets user=null + isAuthenticated=false
- Designed for future JWT swapout: `login()` accepts a user object

#### Task 2.4: Create `src/store/useThemeStore.ts`

- Zustand store with `persist` middleware
- Storage key: `"theme"`
- **`skipHydration: true`** (required for SSR)
- Shape: `{ theme: 'light' | 'dark', toggleTheme: () => void }`
- Default theme: `'light'`
- `toggleTheme`: flips theme, then applies `dark` class to `document.documentElement` — guard with `typeof document !== 'undefined'`
- Use `onRehydrateStorage` callback in persist options: when rehydration completes, apply the class to `document.documentElement` — same `typeof document` guard
- Compatible with existing `THEME_INIT_SCRIPT` in `__root.tsx` (that script runs before React and handles first paint)

---

### Phase 3: Layout and Root Route

#### Task 3.1: Create `src/components/layout/TopNavigation.tsx`

- Imports: `Link` from `@tanstack/react-router`, `Button` from `#/components/ui/button`, `useAuthStore` from `#/store/useAuthStore`, `useThemeStore` from `#/store/useThemeStore`, `useNavigate` from `@tanstack/react-router`
- Structure: `<nav>` with flex layout, two groups:
  - **Left**: `<Link to="/">` and `<Link to="/customers">` rendered as ghost Button. Conditional: if `!isAuthenticated`, show `<Link to="/login">` and `<Link to="/register">`; if `isAuthenticated`, show span "Hello, {user.name}" and Logout Button (calls `logout()` then `navigate({ to: '/' })`)
  - **Right**: theme toggle Button (calls `useThemeStore().toggleTheme()`), label shows current theme or sun/moon icon
- Get auth state: `const { isAuthenticated, user, logout } = useAuthStore()`
- Get theme: `const { theme, toggleTheme } = useThemeStore()`
- No `NavigationMenu` component — plain shadcn `Button`s only

#### Task 3.2: Create `src/components/layout/Layout.tsx`

- Renders `<TopNavigation />` above `<Outlet />` from `@tanstack/react-router`
- Includes a `useEffect` (empty deps `[]`) that calls:
  - `useAuthStore.persist.rehydrate()`
  - `useThemeStore.persist.rehydrate()`
  - This is the client-side trigger for the `skipHydration` stores

#### Task 3.3: Modify `src/routes/__root.tsx`

- **Strip `RootDocument` to HTML-only shell**: remove `<Header />` and `<Footer />` imports and JSX. Keep: `<html lang="en" suppressHydrationWarning>`, `THEME_INIT_SCRIPT` inline script, `<HeadContent />`, `{children}`, `<TanStackDevtools>` and plugins, `<Scripts />`
- **Add `component` to the route**: add `component: RootLayout` to the route definition
- **Add `RootLayout` function**: `function RootLayout() { return <Layout /> }` — import `Layout` from `#/components/layout/Layout`
- Keep `createRootRouteWithContext<MyRouterContext>()` unchanged
- Keep all head meta/links unchanged

---

### Phase 4: Page Routes

#### Task 4.1: Replace `src/routes/index.tsx`

- Imports: `createFileRoute` from `@tanstack/react-router`, `Card`, `CardContent`, `CardHeader`, `CardTitle` from `#/components/ui/card`, `Button` from `#/components/ui/button`, `useCounterStore` from `#/store/useCounterStore`
- Route: `createFileRoute('/')`
- Component renders:
  - A shadcn `Card` describing the project and tech stack (Vite, Tailwind CSS, shadcn/ui, TanStack Router, TanStack Query, Zustand)
  - Below the card: counter demo — display `count`, an "Increment" `Button` calling `increment()`, a "Decrement" `Button` calling `decrement()`
- Get counter state: `const { count, increment, decrement } = useCounterStore()`

#### Task 4.2: Create `src/routes/customers.tsx`

- Imports: `createFileRoute`, `redirect` from `@tanstack/react-router`; `useQuery` from `@tanstack/react-query`; Table components from `#/components/ui/table`; `Button` from `#/components/ui/button`; `useAuthStore` from `#/store/useAuthStore`
- Route: `createFileRoute('/customers')`
- **`beforeLoad`**:
  ```ts
  beforeLoad: () => {
    if (
      typeof window !== 'undefined' &&
      !useAuthStore.getState().isAuthenticated
    ) {
      throw redirect({ to: '/login' })
    }
  }
  ```
- Component:
  - `useQuery({ queryKey: ['users'], queryFn: () => fetch('https://jsonplaceholder.typicode.com/users').then(r => r.json()) })`
  - If `isLoading`: show loading message
  - If `isError`: show friendly error message + "Retry" `Button` calling `refetch()`
  - If data: render shadcn `Table` with columns **Name**, **Email**, **Phone**, **Company** (use `user.company.name` for company)
- User shape from JSONPlaceholder: `{ id, name, email, phone, company: { name } }`

#### Task 4.3: Create `src/routes/login.tsx`

- Imports: `createFileRoute`, `redirect`, `useNavigate` from `@tanstack/react-router`; `Input` from `#/components/ui/input`; `Button` from `#/components/ui/button`; `useAuthStore` from `#/store/useAuthStore`
- Route: `createFileRoute('/login')`
- **`beforeLoad`**:
  ```ts
  beforeLoad: () => {
    if (
      typeof window !== 'undefined' &&
      useAuthStore.getState().isAuthenticated
    ) {
      throw redirect({ to: '/' })
    }
  }
  ```
- Component state: `email`, `password`, `error` (all `useState`)
- On submit (prevent default):
  1. `const users = JSON.parse(localStorage.getItem('mockUsers') ?? '[]')`
  2. Find user by email: `users.find(u => u.email === email)`
  3. If not found or password doesn't match: set error "Invalid email or password"
  4. If found and password matches: `useAuthStore.getState().login(user)` then `navigate({ to: '/' })`
- Render: `<form onSubmit={...}>` with email `Input`, password `Input` (type="password"), submit `Button`, and inline error message if `error` is set

#### Task 4.4: Create `src/routes/register.tsx`

- Imports: same as login plus no redirect in beforeLoad needed
- Route: `createFileRoute('/register')`
- Component state: `name`, `email`, `password`, `error` (all `useState`)
- On submit (prevent default):
  1. `const users = JSON.parse(localStorage.getItem('mockUsers') ?? '[]')`
  2. Check duplicate: `if (users.find(u => u.email === email))` → set error "Email already registered"
  3. Create new user: `const newUser = { id: Date.now(), name, email, password }`
  4. Save: `localStorage.setItem('mockUsers', JSON.stringify([...users, newUser]))`
  5. `useAuthStore.getState().login(newUser)` then `navigate({ to: '/' })`
- Render: `<form onSubmit={...}>` with name `Input`, email `Input`, password `Input` (type="password"), submit `Button`, inline error if `error`

---

## Files NOT to modify

- `src/components/Header.tsx` — keep, just unused
- `src/components/Footer.tsx` — keep, just unused
- `src/components/ThemeToggle.tsx` — keep, just unused
- `src/routes/about.tsx` — keep as-is
- `src/routes/demo/tanstack-query.tsx` — keep as-is
- `src/router.tsx` — keep as-is
- `src/integrations/tanstack-query/` — keep as-is

## Verification

1. `pnpm dev` — app starts at localhost:3000
2. Register → redirected to `/`, nav shows "Hello, {name}" + Logout
3. Logout → nav shows Login/Register
4. Visit `/customers` unauthenticated → redirected to `/login`
5. Login → lands on `/`, visit `/customers` → shows users table
6. Home page counter works (increment/decrement)
7. Theme toggle switches dark/light, persists on page refresh
8. Auth persists on page refresh (still logged in)
