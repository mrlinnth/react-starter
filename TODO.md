# React Starter Template

Create a complete React single-page application using the following stack. The project must be fully functional after `npm install` and adding the required shadcn/ui components via CLI.

## Tech Stack

- **Vite** — build tool
- **Tailwind CSS** — styling (dark mode via `class` strategy)
- **shadcn/ui** — UI components (`Button`, `Input`, `Table`, `Card`)
- **TanStack Router** — file-based client-side routing with the Vite plugin
- **TanStack Query** — server-state management using native `fetch`
- **Zustand** — client-state management with `persist` middleware
- **Mock API** — `https://jsonplaceholder.typicode.com/users`
- **Local Storage** — for mock user registration data

## Project Structure

```
src/
├── components/
│   ├── ui/                  # shadcn/ui components
│   └── layout/
│       ├── TopNavigation.tsx
│       └── Layout.tsx
├── routes/
│   ├── __root.tsx           # root route (layout wrapper)
│   ├── index.tsx            # /
│   ├── customers.tsx        # /customers (protected)
│   ├── login.tsx            # /login
│   └── register.tsx        # /register
├── store/
│   ├── useAuthStore.ts
│   ├── useCounterStore.ts
│   └── useThemeStore.ts
├── lib/
│   ├── queryClient.ts
│   └── utils.ts
├── App.tsx
└── main.tsx
```

## Stores (Zustand)

All stores use `zustand/middleware` `persist` where applicable.

- **`useAuthStore`** — holds `user` (object or `null`) and `isAuthenticated` (boolean). Actions: `login(userData)`, `logout()`. Persisted to local storage. Structured to be swappable for real JWT auth later: `login()` should accept a user object so it can receive a decoded JWT payload without store changes.
- **`useCounterStore`** — holds `count` with `increment` and `decrement` actions. No persistence needed.
- **`useThemeStore`** — holds `theme` (`'light'` or `'dark'`) with `toggleTheme` action. Persisted. On change and on app load, applies the theme by toggling the `dark` class on `document.documentElement`.

## Pages & Features

### Layout (`__root.tsx`)

- A simple top navigation bar using standard shadcn `Button` components for links. No `NavigationMenu`.
- Nav links: **Home**, **Customers**, **Login**, **Register**.
- When authenticated: replace Login/Register with a "Hello, {name}" label and a **Logout** button.
- A **theme toggle** button (light/dark) in the nav bar.
- No footer.

### Home Page (`/`)

- Display a brief description of the project and its tech stack using a shadcn `Card`.
- Include a simple counter demo (increment/decrement buttons using shadcn `Button`, displaying current count) powered by `useCounterStore`.

### Customers Page (`/customers`) — Protected

- Protected route. Unauthenticated users are redirected to `/login` using TanStack Router's `beforeLoad`.
- Fetch users from `https://jsonplaceholder.typicode.com/users` using TanStack Query.
- Display in a shadcn `Table` with columns: **Name**, **Email**, **Phone**, **Company**.
- Show a loading state while fetching.
- On error, show a friendly message and a **Retry** button that calls `refetch()`.

### Login Page (`/login`)

- Form with email and password fields using shadcn `Input` and `Button`.
- On submit, look up the email in local storage (key: `mockUsers`, array of objects). Validate the password.
- On success, call `useAuthStore.login()` with the matched user object and redirect to `/`.
- On failure, show an inline error message.
- If already authenticated, redirect to `/`.

### Register Page (`/register`)

- Form with name, email, and password fields.
- On submit, save the user to `mockUsers` in local storage.
- Handle duplicate email: show an inline error if the email already exists.
- After successful registration, call `useAuthStore.login()` automatically and redirect to `/`.

## Implementation Notes

- Use **file-based routing** with `@tanstack/router-plugin/vite`. Configure the plugin in `vite.config.ts`. The generated `routeTree.gen.ts` should not be manually edited.
- The `__root.tsx` route renders the `Layout` component (nav + `<Outlet />`).
- Use **TanStack Query** only for the customers fetch. Auth is handled manually without Query.
- Do **not** use `zustand` `hydrate` pattern. Use `persist` middleware exclusively for any store that needs local storage.
- Dark mode: Tailwind config must use `darkMode: 'class'`. The theme store must apply the class on `document.documentElement` both when `toggleTheme` is called and when the store initializes (to handle page refresh).
- Do not write custom CSS. Use Tailwind utilities only.

## Deliverables

1. All configuration files: `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`, `tsconfig.json`, `components.json` (shadcn).
2. The exact CLI commands to install dependencies and add the required shadcn/ui components.
3. Full source code for every file listed in the project structure.
4. The completed project must work end-to-end after `npm install` and `npm run dev`.

