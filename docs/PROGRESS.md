# Progress

## Current

- **Task**: 1.1 (Create feature branch)
- **Branch**: `main` (not yet started — create `feature/todo-spa-implementation` first)
- **Started**: 2026-04-01
- **Last Updated**: 2026-04-01

### Status

Not started. Ready to begin Phase 1 (branch + dependency install).

### Notes

- This is a TanStack Start (SSR) project — Zustand persist stores MUST use `skipHydration: true` and be manually rehydrated in a client `useEffect` in `Layout.tsx`
- `beforeLoad` auth guards MUST be wrapped in `typeof window !== 'undefined'` to avoid SSR redirects
- Dark mode class manipulation MUST be wrapped in `typeof document !== 'undefined'`

---

## Completed

_(none yet)_

---

## Up Next

- [ ] 1.1: Create feature branch (`feature/todo-spa-implementation`)
- [ ] 1.2: Install Zustand (`pnpm add zustand`)
- [ ] 1.3: Install shadcn components (button, input, table, card)
- [ ] 2.1: `src/lib/queryClient.ts`
- [ ] 2.2: `src/store/useCounterStore.ts`
- [ ] 2.3: `src/store/useAuthStore.ts`
- [ ] 2.4: `src/store/useThemeStore.ts`
- [ ] 3.1: `src/components/layout/TopNavigation.tsx`
- [ ] 3.2: `src/components/layout/Layout.tsx`
- [ ] 3.3: Modify `src/routes/__root.tsx`
- [ ] 4.1: Replace `src/routes/index.tsx`
- [ ] 4.2: Create `src/routes/customers.tsx`
- [ ] 4.3: Create `src/routes/login.tsx`
- [ ] 4.4: Create `src/routes/register.tsx`

---

_This file is maintained by the task-progress skill. Update it when starting, completing, or handing off tasks._
