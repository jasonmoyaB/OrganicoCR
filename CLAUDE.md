# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev              # Start Vite dev server with HMR
pnpm build            # Type-check (tsc) then build production bundle
pnpm preview          # Preview the production build locally
pnpm test             # Run Vitest in watch mode
pnpm test:run         # Run tests once (CI mode)
pnpm test:coverage    # Generate coverage report
```

Run a single test file: `pnpm test src/domains/catalog/hooks/useProducts.test.tsx`

## Architecture

This is a React 19 + TypeScript SPA (Vite) with a domain-driven folder structure.

### Top-level src/ areas

| Directory | Purpose |
|-----------|---------|
| `src/app/` | App bootstrap — providers, router config, global CSS |
| `src/domains/` | Feature domains (`catalog/`, `cart/`) each owning its API, hooks, types |
| `src/shared/` | Cross-cutting utilities, components, MSW setup, React Query config |
| `src/store/` | Customer-facing pages, layouts, and components |
| `src/admin/` | Admin panel pages, layouts, and components |

### State management split

- **Server state** (products, categories): React Query (`src/shared/lib/queryClient.ts` — 5-minute staleTime, 1 retry). Query hooks live in `src/domains/<domain>/hooks/`.
- **Client state** (cart): Zustand with `persist` middleware, stored in localStorage under key `organico-cart` (`src/domains/cart/store/cart.store.ts`).

### API & mocking

API fetch wrappers are in `src/domains/<domain>/api/`. MSW intercepts `/api/*` routes in both development and tests — handlers are defined in `src/shared/lib/msw/handlers.ts`. MSW is bootstrapped in `src/main.tsx` and the test server is configured in `src/test-setup.ts`.

### Routing

React Router v7 in `src/app/router/index.tsx`. All page components are lazy-loaded and wrapped in `<Suspense>` with a `<Spinner>` fallback. Two layout trees: `StoreLayout` (public routes `/`, `/catalog`, `/cart`) and `AdminLayout` (`/admin/*`).

### Path aliases

```
@/*         → src/
@domains/*  → src/domains/
@shared/*   → src/shared/
@store/*    → src/store/
@admin/*    → src/admin/
```

### Styling

Tailwind CSS v3 utility classes only — no CSS modules or styled-components. Use `cn()` from `@shared/utils/cn.ts` (clsx + tailwind-merge) for conditional or merged class names.
