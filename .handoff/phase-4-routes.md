# Handoff: Phase 4 - Page Routes

**Generated**: 2026-04-01  
**Branch**: `feature/todo-spa-implementation`  
**For**: glm-4.6

---

## Context

Create the four page routes: home (counter + tech stack card), customers (protected table), login (form auth), and register (form registration). This is the final phase — after completing it the full app is functional.

---

## Current State

**Already completed (Phases 1-3):**

- Branch created, deps installed
- All 3 Zustand stores created
- `src/lib/queryClient.ts` created
- `src/components/layout/TopNavigation.tsx` + `Layout.tsx` created
- `src/routes/__root.tsx` updated (uses Layout, no old Header/Footer)

**Files that exist:**

- `src/components/ui/button.tsx` — shadcn Button, exports `Button`
- `src/components/ui/input.tsx` — shadcn Input, exports `Input`
- `src/components/ui/table.tsx` — shadcn Table, exports `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`
- `src/components/ui/card.tsx` — shadcn Card, exports `Card`, `CardContent`, `CardHeader`, `CardTitle`, `CardDescription`
- `src/store/useAuthStore.ts` — exports `useAuthStore`
- `src/store/useCounterStore.ts` — exports `useCounterStore`
- `src/routes/index.tsx` — EXISTS, will be REPLACED (it's a demo page right now)

**Uncommitted changes:**

- None expected

---

## Remaining Subtasks

### 4.1: Replace `src/routes/index.tsx`

- **File**: `src/routes/index.tsx` (REPLACE existing file content entirely)
- **Action**: Overwrite existing file
- **Details**:

  ```tsx
  import { createFileRoute } from '@tanstack/react-router'
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
  } from '#/components/ui/card'
  import { Button } from '#/components/ui/button'
  import { useCounterStore } from '#/store/useCounterStore'

  export const Route = createFileRoute('/')({
    component: HomePage,
  })

  function HomePage() {
    const { count, increment, decrement } = useCounterStore()

    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>React Starter</CardTitle>
            <CardDescription>
              A full-stack React starter with the following tech stack:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Vite — build tool and dev server</li>
              <li>Tailwind CSS — utility-first styling with dark mode</li>
              <li>shadcn/ui — accessible component library</li>
              <li>TanStack Router — type-safe file-based routing</li>
              <li>TanStack Query — server-state management</li>
              <li>Zustand — client-state management with persistence</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Counter Demo</CardTitle>
            <CardDescription>
              Powered by Zustand (useCounterStore)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={decrement}>
                −
              </Button>
              <span className="text-2xl font-bold w-12 text-center">
                {count}
              </span>
              <Button variant="outline" onClick={increment}>
                +
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  ```

- **Verify**: Visit `/` — shows two cards, counter increments/decrements

**Status**: [ ] Not started

---

### 4.2: Create `src/routes/customers.tsx`

- **File**: `src/routes/customers.tsx` (CREATE new file)
- **Action**: Create new file
- **Details**:

  ```tsx
  import { createFileRoute, redirect } from '@tanstack/react-router'
  import { useQuery } from '@tanstack/react-query'
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '#/components/ui/table'
  import { Button } from '#/components/ui/button'
  import { useAuthStore } from '#/store/useAuthStore'

  interface User {
    id: number
    name: string
    email: string
    phone: string
    company: { name: string }
  }

  export const Route = createFileRoute('/customers')({
    beforeLoad: () => {
      if (
        typeof window !== 'undefined' &&
        !useAuthStore.getState().isAuthenticated
      ) {
        throw redirect({ to: '/login' })
      }
    },
    component: CustomersPage,
  })

  function CustomersPage() {
    const { data, isLoading, isError, refetch } = useQuery<User[]>({
      queryKey: ['users'],
      queryFn: () =>
        fetch('https://jsonplaceholder.typicode.com/users').then((r) =>
          r.json(),
        ),
    })

    if (isLoading) {
      return <p className="text-muted-foreground">Loading customers...</p>
    }

    if (isError) {
      return (
        <div className="space-y-3">
          <p className="text-destructive">
            Failed to load customers. Please try again.
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Company</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.company.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }
  ```

- **Logic**:
  - `beforeLoad` runs on navigation. The `typeof window !== 'undefined'` guard prevents redirecting during SSR (server has no localStorage, store would appear unauthenticated there)
  - `useAuthStore.getState()` reads store state without subscribing — correct for imperative checks outside render
  - `useQuery` automatically uses the QueryClient provided by the SSR integration in context
- **Verify**: Visit `/customers` while logged out → redirected to `/login`. Visit while logged in → shows table with 10 rows

**Status**: [ ] Not started

---

### 4.3: Create `src/routes/login.tsx`

- **File**: `src/routes/login.tsx` (CREATE new file)
- **Action**: Create new file
- **Details**:

  ```tsx
  import { useState } from 'react'
  import {
    createFileRoute,
    redirect,
    useNavigate,
  } from '@tanstack/react-router'
  import { Input } from '#/components/ui/input'
  import { Button } from '#/components/ui/button'
  import { useAuthStore } from '#/store/useAuthStore'

  export const Route = createFileRoute('/login')({
    beforeLoad: () => {
      if (
        typeof window !== 'undefined' &&
        useAuthStore.getState().isAuthenticated
      ) {
        throw redirect({ to: '/' })
      }
    },
    component: LoginPage,
  })

  function LoginPage() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      setError('')

      const users: Array<{
        id: number
        name: string
        email: string
        password: string
      }> = JSON.parse(localStorage.getItem('mockUsers') ?? '[]')

      const user = users.find((u) => u.email === email)

      if (!user || user.password !== password) {
        setError('Invalid email or password')
        return
      }

      useAuthStore.getState().login(user)
      navigate({ to: '/' })
    }

    return (
      <div className="max-w-sm mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </div>
    )
  }
  ```

- **Logic**:
  - Passwords stored and compared in plain text (this is a mock — intentional for the demo)
  - `useAuthStore.getState().login(user)` updates the store imperatively from outside a component render
- **Verify**: Submit wrong credentials → see error message. Submit correct credentials → redirected to `/`

**Status**: [ ] Not started

---

### 4.4: Create `src/routes/register.tsx`

- **File**: `src/routes/register.tsx` (CREATE new file)
- **Action**: Create new file
- **Details**:

  ```tsx
  import { useState } from 'react'
  import { createFileRoute, useNavigate } from '@tanstack/react-router'
  import { Input } from '#/components/ui/input'
  import { Button } from '#/components/ui/button'
  import { useAuthStore } from '#/store/useAuthStore'

  export const Route = createFileRoute('/register')({
    component: RegisterPage,
  })

  function RegisterPage() {
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      setError('')

      const users: Array<{
        id: number
        name: string
        email: string
        password: string
      }> = JSON.parse(localStorage.getItem('mockUsers') ?? '[]')

      if (users.find((u) => u.email === email)) {
        setError('Email already registered')
        return
      }

      const newUser = { id: Date.now(), name, email, password }
      localStorage.setItem('mockUsers', JSON.stringify([...users, newUser]))

      useAuthStore.getState().login(newUser)
      navigate({ to: '/' })
    }

    return (
      <div className="max-w-sm mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>
      </div>
    )
  }
  ```

- **Verify**: Register with a new email → redirected to `/`, nav shows "Hello, {name}". Try to register same email again → see "Email already registered" error.

**Status**: [ ] Not started

---

### 4.5: Commit routes

- **Action**: Commit all new/modified route files
- **Command**: `git add src/routes/ && git commit -m "feat: add home, customers, login, and register pages"`
- **Verify**: `git log --oneline -3` shows all phase commits

**Status**: [ ] Not started

---

## Reference Information

### JSONPlaceholder user shape

The API at `https://jsonplaceholder.typicode.com/users` returns objects like:

```json
{
  "id": 1,
  "name": "Leanne Graham",
  "email": "Sincere@april.biz",
  "phone": "1-770-736-0800 x56442",
  "company": {
    "name": "Romaguera-Crona"
  }
}
```

### localStorage mock user shape

Users are stored as JSON array under key `mockUsers`:

```json
[
  {
    "id": 1714000000000,
    "name": "Jane Doe",
    "email": "jane@test.com",
    "password": "secret"
  }
]
```

### Path aliases

- `#/` maps to `src/` — always use `#/components/ui/...` not relative paths

### Tailwind dark mode CSS class

- `text-destructive` — shadcn semantic color for error text (red in light mode)
- `text-muted-foreground` — muted gray text

---

## End-to-End Testing Checklist

After all subtasks:

1. `pnpm dev` — starts without errors
2. **Home**: `/` shows two Cards, counter increments/decrements without page reload
3. **Auth flow**:
   - Go to `/register`, fill form → redirected to `/`, nav shows "Hello, {name}"
   - Click Logout → nav shows Login/Register
   - Go to `/login`, enter credentials → redirected to `/`
4. **Protected route**: Log out, visit `/customers` → redirected to `/login`
5. **Customers**: Log in, visit `/customers` → table with 10 rows (Name, Email, Phone, Company)
6. **Persistence**: Refresh page while logged in → still shows "Hello, {name}"
7. **Theme**: Click theme toggle → dark/light mode switches; refresh → persists

---

## When You're Done

1. Mark each subtask as complete: `[x]`
2. Update `docs/PROGRESS.md`: mark all Phase 4 tasks as completed, set current task to "Done"
3. The full implementation is complete — notify the user for review

---

## Questions?

If any subtask is unclear or you encounter unexpected issues:

1. **Do not guess** — ask for clarification
2. Note the specific subtask number and what's unclear

---

_This file was generated for handoff to a less capable model. The subtasks are intentionally atomic and detailed._
