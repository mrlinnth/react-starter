# Handoff: Phase 2 - Stores and Query Client

**Generated**: 2026-04-01  
**Branch**: `feature/todo-spa-implementation`  
**For**: glm-4.6

---

## Context

Create the Zustand stores and QueryClient singleton. These are the data layer for the entire app: auth state, counter state, theme state, and a query client reference. All files in this phase are pure TypeScript/Zustand — no JSX, no React components.

**CRITICAL SSR WARNING**: This project uses TanStack Start which renders on the server. `localStorage` does not exist on the server. All Zustand `persist` stores MUST use `skipHydration: true` to prevent crashes. They will be manually rehydrated on the client in Phase 3 (Layout.tsx).

---

## Current State

**Already completed (Phase 1):**

- Branch `feature/todo-spa-implementation` created
- `zustand` installed
- shadcn components installed (button, input, table, card in `src/components/ui/`)

**Files that exist:**

- `src/lib/utils.ts` — has `cn()` helper, do NOT modify
- `src/integrations/tanstack-query/root-provider.tsx` — has existing QueryClient setup for SSR, do NOT modify

**Uncommitted changes:**

- None expected

---

## Remaining Subtasks

### 2.1: Create `src/lib/queryClient.ts`

- **File**: `src/lib/queryClient.ts` (CREATE new file)
- **Action**: Create new file
- **Details**:

  ```ts
  import { QueryClient } from '@tanstack/react-query'

  export const queryClient = new QueryClient()
  ```

- **Logic**: This is a module-level singleton. It is NOT the QueryClient used by React's QueryClientProvider (that's in `root-provider.tsx`). This export is for imperative cache operations outside React components (e.g., `queryClient.invalidateQueries` after logout).
- **Verify**: File exists at `src/lib/queryClient.ts` and exports `queryClient`

**Status**: [ ] Not started

---

### 2.2: Create `src/store/useCounterStore.ts`

- **File**: `src/store/useCounterStore.ts` (CREATE new file, also create `src/store/` directory)
- **Action**: Create new file
- **Details**:

  ```ts
  import { create } from 'zustand'

  interface CounterState {
    count: number
    increment: () => void
    decrement: () => void
  }

  export const useCounterStore = create<CounterState>()((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
    decrement: () => set((state) => ({ count: state.count - 1 })),
  }))
  ```

- **Logic**: Simple counter, no persistence. `set` receives the previous state and returns partial new state.
- **Verify**: File exists, TypeScript compiles without errors

**Status**: [ ] Not started

---

### 2.3: Create `src/store/useAuthStore.ts`

- **File**: `src/store/useAuthStore.ts` (CREATE new file)
- **Action**: Create new file
- **Details**:

  ```ts
  import { create } from 'zustand'
  import { persist, createJSONStorage } from 'zustand/middleware'

  interface User {
    id: number
    name: string
    email: string
    password: string
    [key: string]: unknown
  }

  interface AuthState {
    user: User | null
    isAuthenticated: boolean
    login: (userData: User) => void
    logout: () => void
  }

  export const useAuthStore = create<AuthState>()(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        login: (userData) => set({ user: userData, isAuthenticated: true }),
        logout: () => set({ user: null, isAuthenticated: false }),
      }),
      {
        name: 'auth',
        storage: createJSONStorage(() => localStorage),
        skipHydration: true,
      },
    ),
  )
  ```

- **Logic**:
  - `skipHydration: true` prevents the store from reading localStorage during server-side render (where localStorage doesn't exist)
  - `createJSONStorage(() => localStorage)` uses a getter function to defer localStorage access until runtime
  - Rehydration will be triggered manually in `Layout.tsx` with `useAuthStore.persist.rehydrate()`
- **Verify**: File exists, TypeScript compiles. The store has `persist` property (needed for `rehydrate()` call later)

**Status**: [ ] Not started

---

### 2.4: Create `src/store/useThemeStore.ts`

- **File**: `src/store/useThemeStore.ts` (CREATE new file)
- **Action**: Create new file
- **Details**:

  ```ts
  import { create } from 'zustand'
  import { persist, createJSONStorage } from 'zustand/middleware'

  type Theme = 'light' | 'dark'

  interface ThemeState {
    theme: Theme
    toggleTheme: () => void
  }

  const applyTheme = (theme: Theme) => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark')
    }
  }

  export const useThemeStore = create<ThemeState>()(
    persist(
      (set, get) => ({
        theme: 'light',
        toggleTheme: () => {
          const next: Theme = get().theme === 'light' ? 'dark' : 'light'
          set({ theme: next })
          applyTheme(next)
        },
      }),
      {
        name: 'theme',
        storage: createJSONStorage(() => localStorage),
        skipHydration: true,
        onRehydrateStorage: () => (state) => {
          if (state) {
            applyTheme(state.theme)
          }
        },
      },
    ),
  )
  ```

- **Logic**:
  - `applyTheme` is extracted as a helper so it can be called in both `toggleTheme` and `onRehydrateStorage`
  - `typeof document !== 'undefined'` guard prevents server-side crashes
  - `onRehydrateStorage` callback fires after the client reads from localStorage — applies the saved theme class to `<html>`
  - The existing `THEME_INIT_SCRIPT` in `__root.tsx` handles the very first paint (before React hydrates). This store handles all subsequent theme changes and ensures React state stays in sync
- **Verify**: File exists, TypeScript compiles without errors

**Status**: [ ] Not started

---

### 2.5: Commit stores

- **Action**: Commit all new files
- **Command**: `git add src/lib/queryClient.ts src/store/ && git commit -m "feat: add zustand stores and queryClient singleton"`
- **Verify**: `git log --oneline -1` shows the commit

**Status**: [ ] Not started

---

## Reference Information

### Zustand persist with skipHydration pattern

```ts
// Standard pattern for SSR-safe Zustand persist:
export const useStore = create(
  persist(
    (set) => ({
      /* state */
    }),
    {
      name: 'storage-key',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true, // <- DO NOT REMOVE, prevents SSR crash
    },
  ),
)

// In a client component (Layout.tsx will do this):
useEffect(() => {
  useStore.persist.rehydrate()
}, [])
```

### Path aliases

- `#/` maps to `src/` — use `#/store/useAuthStore` not `../store/useAuthStore`

---

## Testing

After completing all subtasks:

1. `pnpm dev` — app starts without errors (no TypeScript or runtime errors in console)
2. `src/store/` directory contains 3 files
3. `src/lib/` contains `queryClient.ts` alongside existing `utils.ts`

---

## When You're Done

1. Mark each subtask as complete: `[x]`
2. Update `docs/PROGRESS.md`: mark tasks 2.1-2.4 as completed
3. Proceed to Phase 3 handoff file: `.handoff/phase-3-layout.md`

---

## Questions?

If any subtask is unclear or you encounter unexpected issues:

1. **Do not guess** — ask for clarification
2. Note the specific subtask number and what's unclear

---

_This file was generated for handoff to a less capable model. The subtasks are intentionally atomic and detailed._
