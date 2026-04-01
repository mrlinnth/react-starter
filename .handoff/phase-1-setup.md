# Handoff: Phase 1 - Setup

**Generated**: 2026-04-01  
**Branch**: `main` → create `feature/todo-spa-implementation`  
**For**: glm-4.6

---

## Context

Initial setup for a React SPA feature implementation on a TanStack Start project. This phase creates the working branch and installs all required dependencies before any code is written.

---

## Current State

**Already completed:**

- None

**Files that exist:**

- `package.json` — existing deps (TanStack Start, Router, Query, Tailwind v4, shadcn configured)
- `components.json` — shadcn configured (new-york style, zinc base, CSS variables, `#/` path aliases)
- `src/components/ui/` — directory does NOT exist yet (shadcn CLI will create it)

**Uncommitted changes:**

- `docs/implementation-checklist.md` (new)
- `docs/PROGRESS.md` (new)

---

## Remaining Subtasks

Work through these in order. Each subtask is atomic — complete it fully before moving to the next.

### 1.1: Create feature branch

- **Action**: Run shell command
- **Command**: `git checkout -b feature/todo-spa-implementation`
- **Verify**: `git branch --show-current` returns `feature/todo-spa-implementation`

**Status**: [ ] Not started

---

### 1.2: Install Zustand

- **Action**: Run shell command
- **Command**: `pnpm add zustand`
- **Verify**: `zustand` appears in `package.json` dependencies; `node_modules/zustand/` exists

**Status**: [ ] Not started

---

### 1.3: Install shadcn Button component

- **Action**: Run shell command
- **Command**: `pnpm dlx shadcn@latest add button`
- **Note**: Will create `src/components/ui/button.tsx` and possibly update `src/styles.css`
- **Verify**: `src/components/ui/button.tsx` exists

**Status**: [ ] Not started

---

### 1.4: Install shadcn Input component

- **Action**: Run shell command
- **Command**: `pnpm dlx shadcn@latest add input`
- **Verify**: `src/components/ui/input.tsx` exists

**Status**: [ ] Not started

---

### 1.5: Install shadcn Table component

- **Action**: Run shell command
- **Command**: `pnpm dlx shadcn@latest add table`
- **Verify**: `src/components/ui/table.tsx` exists

**Status**: [ ] Not started

---

### 1.6: Install shadcn Card component

- **Action**: Run shell command
- **Command**: `pnpm dlx shadcn@latest add card`
- **Verify**: `src/components/ui/card.tsx` exists

**Status**: [ ] Not started

---

### 1.7: Commit setup

- **Action**: Commit all changes
- **Command**: `git add -A && git commit -m "feat: install zustand and shadcn components"`
- **Verify**: `git log --oneline -1` shows the commit

**Status**: [ ] Not started

---

## Testing

After completing all subtasks:

1. `pnpm dev` — app starts without errors at localhost:3000
2. Existing pages (`/`, `/about`) still render
3. `src/components/ui/` contains: `button.tsx`, `input.tsx`, `table.tsx`, `card.tsx`

---

## When You're Done

1. Mark each subtask as complete: `[x]`
2. Update `docs/PROGRESS.md`: move tasks 1.1-1.3 to Completed
3. Proceed to Phase 2 handoff file: `.handoff/phase-2-stores.md`

---

## Questions?

If any subtask is unclear or you encounter unexpected issues:

1. **Do not guess** — ask for clarification
2. Note the specific subtask number and what's unclear

---

_This file was generated for handoff to a less capable model. The subtasks are intentionally atomic and detailed._
