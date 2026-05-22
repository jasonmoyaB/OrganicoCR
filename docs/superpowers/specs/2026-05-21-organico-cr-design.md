# OrganicoCR — Architecture Design Spec

**Date:** 2026-05-21
**Status:** Approved
**Stack:** React 18 + TypeScript (strict) · Vite · React Router v6 · Zustand · TanStack Query · Tailwind CSS · Vitest + Testing Library

---

## 1. Project Overview

OrganicoCR is a frontend-only SPA (for now) consisting of two sub-applications:

- **Public Store** — product catalog and cart for end customers
- **Admin Panel** — product and order management for store operators

Both share business domain logic. Auth is deferred; admin routes are unprotected initially. Backend/API is mocked locally until a real backend is defined.

---

## 2. Folder Structure

```
src/
├── app/                        # Bootstrap: router, providers, global config
│   ├── providers/              # QueryClientProvider, RouterProvider, etc.
│   ├── router/                 # Route definitions (store + admin)
│   └── main.tsx                # Entry point
│
├── domains/                    # Business domain logic — shared between store and admin
│   ├── catalog/                # Products and categories
│   │   ├── api/                # HTTP calls (today: mock data)
│   │   ├── hooks/              # useProducts, useProductById, useCategories
│   │   ├── store/              # Zustand slice (if client state needed)
│   │   ├── types/              # Product, Category, ProductFilters
│   │   └── utils/              # formatPrice, filterByCategory
│   ├── cart/                   # Shopping cart logic
│   │   ├── hooks/              # useCart (wraps store)
│   │   ├── store/              # cart.store.ts — persisted in localStorage
│   │   └── types/              # CartItem, CartState
│   ├── orders/                 # Order management (future)
│   ├── auth/                   # Authentication (future)
│   └── users/                  # Customer profiles (future)
│
├── store/                      # Public-facing store application
│   ├── pages/
│   │   ├── home/               # HomePage
│   │   ├── catalog/            # CatalogPage (product listing + filters)
│   │   ├── product-detail/     # ProductDetailPage
│   │   ├── cart/               # CartPage
│   │   └── checkout/           # CheckoutPage (future)
│   ├── components/             # UI components exclusive to the store
│   └── layouts/                # StoreLayout (header, footer, outlet)
│
├── admin/                      # Admin panel application
│   ├── pages/
│   │   ├── dashboard/          # DashboardPage (metrics overview)
│   │   ├── products/           # AdminProductsPage, AdminProductFormPage
│   │   ├── orders/             # AdminOrdersPage (future)
│   │   └── customers/          # AdminCustomersPage (future)
│   ├── components/             # UI components exclusive to the admin
│   └── layouts/                # AdminLayout (sidebar, topbar, outlet)
│
├── shared/                     # Cross-cutting — no domain dependency
│   ├── components/             # Button, Input, Modal, Badge, Spinner, Table...
│   ├── hooks/                  # useDebounce, useLocalStorage, usePagination
│   ├── lib/                    # queryClient.ts, axios.ts (future), msw/handlers.ts
│   ├── types/                  # ApiResponse<T>, PaginatedResponse<T>, ID
│   └── utils/                  # cn(), formatDate(), truncate()
│
└── assets/                     # Images, icons, fonts
```

---

## 3. Layer Rules — Dependency Direction

Dependencies flow in one direction only. **No layer imports from a layer above it.**

```
shared  ←  domains  ←  store / admin
```

| Layer | Can import from | Must never import from |
|---|---|---|
| `shared/` | nothing internal | `domains/`, `store/`, `admin/` |
| `domains/` | `shared/` | `store/`, `admin/` |
| `store/` | `domains/`, `shared/` | `admin/` |
| `admin/` | `domains/`, `shared/` | `store/` |

**Dependency Inversion Principle:**
- Page components never import `api/` modules directly.
- Shared UI components never reference business domain types.
- Domain `hooks/` are the only interface between UI and data.

---

## 4. State Management

Two tools, two responsibilities — never mixed.

| State type | Tool | Examples |
|---|---|---|
| Server state (remote data) | TanStack Query | products, orders, categories |
| Client state (local UI) | Zustand | cart items, sidebar open, active filters |

### React Query pattern

```ts
// domains/catalog/hooks/useProducts.ts
export const useProducts = (filters?: ProductFilters) =>
  useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsApi.getAll(filters),
  });
```

### Zustand pattern

```ts
// domains/cart/store/cart.store.ts
export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) => set((state) => ({ ... })),
      removeItem: (id) => set((state) => ({ ... })),
      clearCart: () => set({ items: [] }),
    }),
    { name: 'organico-cart' }
  )
);
```

### Planned Zustand stores

| Store | Location | Responsibility |
|---|---|---|
| `cart.store.ts` | `domains/cart/store/` | Cart items, persisted in localStorage |
| `ui.store.ts` | `shared/lib/` | Global UI state (sidebar, modals) |
| `auth.store.ts` | `domains/auth/store/` | Authenticated user (future) |

---

## 5. Routing

Single router with two layout trees separated by path prefix.

```ts
// app/router/index.tsx
export const router = createBrowserRouter([
  {
    path: '/',
    element: <StoreLayout />,
    children: [
      { index: true,          element: <HomePage /> },
      { path: 'catalog',      element: <CatalogPage /> },
      { path: 'catalog/:id',  element: <ProductDetailPage /> },
      { path: 'cart',         element: <CartPage /> },
      { path: 'checkout',     element: <CheckoutPage /> },      // future
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true,              element: <DashboardPage /> },
      { path: 'products',         element: <AdminProductsPage /> },
      { path: 'products/new',     element: <AdminProductFormPage /> },
      { path: 'products/:id',     element: <AdminProductFormPage /> },
      { path: 'orders',           element: <AdminOrdersPage /> },    // future
      { path: 'customers',        element: <AdminCustomersPage /> }, // future
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
```

All pages are loaded with `React.lazy()` for automatic code splitting via Vite.

### Path aliases (`vite.config.ts` + `tsconfig.json`)

| Alias | Resolves to |
|---|---|
| `@/` | `src/` |
| `@domains/` | `src/domains/` |
| `@shared/` | `src/shared/` |
| `@store/` | `src/store/` |
| `@admin/` | `src/admin/` |

---

## 6. Testing Strategy

Three levels, each with a clear scope.

| Level | Tool | What it tests | Location |
|---|---|---|---|
| Unit | Vitest | utils, store slices, pure logic | next to the file (`*.test.ts`) |
| Integration | Vitest + Testing Library | hooks + components with data | next to the component (`*.test.tsx`) |
| E2E | Playwright (future) | full user flows | `e2e/` at root |

Tests live next to the code they test. No separate `__tests__` folder.

API calls are intercepted in tests using **MSW (Mock Service Worker)**:

```ts
// shared/lib/msw/handlers.ts
export const handlers = [
  http.get('/api/products', () => HttpResponse.json(mockProducts)),
];
```

**Testing rules:**
- Domain tests never depend on UI components.
- Component tests never cross the `store/` ↔ `admin/` boundary.
- No mocking Zustand stores — test them directly as pure state machines.

---

## 7. Key Decisions

- **Domain-driven vertical slices** — business logic lives in `domains/`, consumed by both `store/` and `admin/`. Avoids duplication without coupling the two apps.
- **Frontend-only to start** — all API calls return mock data from `domains/*/api/`. Replacing mocks with real HTTP calls requires changing only the `api/` layer.
- **Auth deferred** — admin routes are unprotected initially. When auth is added, a route guard wraps the `/admin` tree with zero changes to pages.
- **No barrel re-exports at root** — avoids circular dependency risks as the codebase grows.
- **Lazy loading everywhere** — Vite handles bundle splitting per route automatically.
