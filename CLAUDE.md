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

React 19 + TypeScript SPA (Vite) with domain-driven folder structure.

### src/ areas

| Directory | Purpose |
|-----------|---------|
| `src/app/` | App bootstrap — providers, router config, global CSS |
| `src/domains/` | Feature domains (`catalog/`, `cart/`) — API, hooks, types |
| `src/shared/` | Cross-cutting utilities, components, MSW, React Query config |
| `src/store/` | Customer-facing pages, layouts, components |
| `src/admin/` | Admin panel pages, layouts, components |
| `src/utils/` | Supabase client (`supabase.ts`) |

### State management

- **Server state** (products, categories): React Query (`src/shared/lib/queryClient.ts` — 5-min staleTime, 1 retry). Hooks in `src/domains/<domain>/hooks/`.
- **Client state** (cart): Zustand + `persist`, localStorage key `organico-cart` (`src/domains/cart/store/cart.store.ts`).

### API

Fetch wrappers in `src/domains/<domain>/api/`. No MSW — API calls hit Supabase directly.

### Backend

Supabase client at `src/utils/supabase.ts`. Env vars via `src/shared/config/env.ts`.

### Routing

React Router v7 (`src/app/router/index.tsx`). All pages lazy-loaded inside `<Suspense>` + `<Spinner>`.

| Layout | Routes |
|--------|--------|
| `StoreLayout` | `/`, `/catalog`, `/cart`, `/product/:id`, `/contactanos`, `/sobre-nosotros`, `/login`, `/register` |
| `AdminLayout` | `/admin/dashboard`, `/admin/products`, `/admin/products/new`, `/admin/products/:id/edit` |

### Path aliases

```
@/*         → src/
@domains/*  → src/domains/
@shared/*   → src/shared/
@store/*    → src/store/
@admin/*    → src/admin/
```

### Styling

Tailwind CSS v3 utilities only — no CSS modules or styled-components. Use `cn()` from `@shared/utils/cn.ts` (clsx + tailwind-merge).

**Brand tokens** (`tailwind.config.ts`):
- `cream` #F6FEF9 · `green` #003023 · `lime` #83C441 · `dark` #202020 · `black` #0F0F0F
- Font: `Outfit` (default sans)

### Animations

GSAP 3 + `@gsap/react`. Use `useGSAP()` hook for scroll-driven and interactive animations.

### Key shared components

| Component | Path |
|-----------|------|
| `Button`, `Badge`, `Spinner`, `ErrorBoundary` | `src/shared/components/` |
| `ProductCard`, `DynamicIslandNav`, `WhatsAppButton`, `WhatsAppWidget` | `src/store/components/` |
| `Sidebar` | `src/admin/components/` |

### Utilities

- `cn(...classes)` — `src/shared/utils/cn.ts`
- `formatPrice(n)` — `src/shared/utils/formatPrice.ts`
- `formatDate(d)` — `src/shared/utils/formatDate.ts`
- Excel export via `xlsx` library

## PWA

`vite-plugin-pwa` — autoUpdate, icon: `/logo/Manzana.webp`, theme `#003023`, bg `#F6FEF9`.

## Deployment

Deployed on Vercel (`vercel.json`). Run `pnpm build` to verify before pushing.
