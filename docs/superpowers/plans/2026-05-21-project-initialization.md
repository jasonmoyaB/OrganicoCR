# OrganicoCR — Project Initialization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold a production-ready React + TypeScript SPA with a public e-commerce store (products + cart) and admin panel, domain-driven vertical slice architecture, Tailwind CSS, and full testing infrastructure.

**Architecture:** Domain-driven vertical slices. `domains/` holds shared business logic (catalog, cart). `store/` and `admin/` are independent sub-apps that consume domains. Dependencies flow one way: `shared → domains → store/admin`. Server state via React Query, client state via Zustand. All API calls return mock data via MSW until a real backend exists.

**Tech Stack:** React 18 · TypeScript (strict) · Vite · React Router v6 · Zustand v5 · TanStack Query v5 · Tailwind CSS v3 · Vitest · Testing Library · MSW v2

---

## File Map

```
src/
├── app/
│   ├── providers/AppProviders.tsx
│   ├── router/index.tsx
│   └── styles/globals.css
├── domains/
│   ├── catalog/
│   │   ├── api/products.api.ts
│   │   ├── api/products.mock.ts
│   │   ├── hooks/useCategories.ts
│   │   ├── hooks/useProductById.ts
│   │   ├── hooks/useProductById.test.ts
│   │   ├── hooks/useProducts.ts
│   │   ├── hooks/useProducts.test.ts
│   │   └── types/product.types.ts
│   └── cart/
│       ├── hooks/useCart.ts
│       ├── store/cart.store.ts
│       ├── store/cart.store.test.ts
│       └── types/cart.types.ts
├── shared/
│   ├── components/Badge.tsx
│   ├── components/Button.tsx
│   ├── components/Button.test.tsx
│   ├── components/Spinner.tsx
│   ├── hooks/useDebounce.ts
│   ├── hooks/useDebounce.test.ts
│   ├── lib/
│   │   ├── msw/browser.ts
│   │   ├── msw/handlers.ts
│   │   └── msw/server.ts
│   │   └── queryClient.ts
│   ├── pages/NotFoundPage.tsx
│   ├── types/api.types.ts
│   └── utils/
│       ├── cn.ts
│       ├── formatDate.ts
│       ├── formatPrice.ts
│       └── formatPrice.test.ts
├── store/
│   ├── components/CartIcon.tsx
│   ├── components/ProductCard.tsx
│   ├── components/ProductCard.test.tsx
│   ├── layouts/StoreLayout.tsx
│   └── pages/
│       ├── cart/CartPage.tsx
│       ├── catalog/CatalogPage.tsx
│       ├── catalog/CatalogPage.test.tsx
│       ├── home/HomePage.tsx
│       └── product-detail/ProductDetailPage.tsx
├── admin/
│   ├── components/Sidebar.tsx
│   ├── layouts/AdminLayout.tsx
│   └── pages/
│       ├── dashboard/DashboardPage.tsx
│       ├── products/AdminProductFormPage.tsx
│       └── products/AdminProductsPage.tsx
├── main.tsx
└── test-setup.ts
```

Root config files: `package.json` · `index.html` · `vite.config.ts` · `tsconfig.json` · `tsconfig.node.json` · `tailwind.config.ts` · `postcss.config.js`

---

## Task 1: Initialize project files and install dependencies

**Files:**
- Create: `package.json`
- Create: `index.html`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "organico-cr",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

- [ ] **Step 2: Create `index.html`**

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>OrganicoCR</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 3: Install runtime dependencies**

```bash
npm install react react-dom react-router-dom @tanstack/react-query zustand clsx tailwind-merge
```

- [ ] **Step 4: Install dev dependencies**

```bash
npm install -D vite @vitejs/plugin-react typescript @types/react @types/react-dom tailwindcss postcss autoprefixer vitest @vitest/coverage-v8 @testing-library/react @testing-library/user-event @testing-library/jest-dom msw jsdom
```

- [ ] **Step 5: Verify installation**

Run: `ls node_modules | head -5`
Expected: `node_modules/` directory exists with packages.

- [ ] **Step 6: Git init and first commit**

```bash
git init
echo "node_modules\ndist\n.env" > .gitignore
git add package.json index.html .gitignore
git commit -m "chore: initialize project"
```

---

## Task 2: Configure TypeScript, Vite, and Tailwind

**Files:**
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `src/app/styles/globals.css`

- [ ] **Step 1: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@domains/*": ["src/domains/*"],
      "@shared/*": ["src/shared/*"],
      "@store/*": ["src/store/*"],
      "@admin/*": ["src/admin/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 2: Create `tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 3: Create `vite.config.ts`**

```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@domains': fileURLToPath(new URL('./src/domains', import.meta.url)),
      '@shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
      '@store': fileURLToPath(new URL('./src/store', import.meta.url)),
      '@admin': fileURLToPath(new URL('./src/admin', import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    css: false,
  },
})
```

- [ ] **Step 4: Create `tailwind.config.ts`**

```ts
import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config
```

- [ ] **Step 5: Create `postcss.config.js`**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 6: Create `src/app/styles/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 7: Commit**

```bash
git add tsconfig.json tsconfig.node.json vite.config.ts tailwind.config.ts postcss.config.js src/app/styles/globals.css
git commit -m "chore: configure typescript, vite, and tailwind"
```

---

## Task 3: Set up Vitest and MSW test environment

**Files:**
- Create: `src/test-setup.ts`
- Create: `src/shared/lib/msw/server.ts`
- Create: `src/shared/lib/msw/browser.ts`
- Create: `src/shared/lib/msw/handlers.ts` (empty — filled in Task 9)

- [ ] **Step 1: Create `src/shared/lib/msw/handlers.ts` (empty placeholder)**

```ts
import type { RequestHandler } from 'msw'

export const handlers: RequestHandler[] = []
```

- [ ] **Step 2: Create `src/shared/lib/msw/server.ts`**

```ts
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
```

- [ ] **Step 3: Create `src/shared/lib/msw/browser.ts`**

```ts
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)
```

- [ ] **Step 4: Create `src/test-setup.ts`**

```ts
import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll } from 'vitest'
import { server } from './shared/lib/msw/server'

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

- [ ] **Step 5: Run tests to verify setup**

Run: `npm run test:run`
Expected: `0 tests passed` with no errors (no test files exist yet — that's correct).

- [ ] **Step 6: Commit**

```bash
git add src/test-setup.ts src/shared/lib/msw/
git commit -m "chore: set up vitest and msw test environment"
```

---

## Task 4: Shared utilities

**Files:**
- Create: `src/shared/utils/cn.ts`
- Create: `src/shared/utils/formatPrice.ts`
- Create: `src/shared/utils/formatPrice.test.ts`
- Create: `src/shared/utils/formatDate.ts`
- Create: `src/shared/types/api.types.ts`
- Create: `src/shared/lib/queryClient.ts`

- [ ] **Step 1: Write failing test for `formatPrice`**

Create `src/shared/utils/formatPrice.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { formatPrice } from './formatPrice'

describe('formatPrice', () => {
  it('includes the numeric value in the output', () => {
    const result = formatPrice(5500)
    expect(result).toMatch(/5[.,\s]?500/)
  })

  it('formats USD when currency is specified', () => {
    const result = formatPrice(15, 'USD')
    expect(result).toMatch(/15/)
    expect(result).toMatch(/USD|\$|US/)
  })

  it('handles zero', () => {
    const result = formatPrice(0)
    expect(result).toMatch(/0/)
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm run test:run -- src/shared/utils/formatPrice.test.ts`
Expected: FAIL — `Cannot find module './formatPrice'`

- [ ] **Step 3: Create `src/shared/utils/formatPrice.ts`**

```ts
export function formatPrice(amount: number, currency = 'CRC'): string {
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm run test:run -- src/shared/utils/formatPrice.test.ts`
Expected: `3 passed`

- [ ] **Step 5: Create `src/shared/utils/cn.ts`**

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 6: Create `src/shared/utils/formatDate.ts`**

```ts
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('es-CR', { dateStyle: 'medium' }).format(
    typeof date === 'string' ? new Date(date) : date
  )
}
```

- [ ] **Step 7: Create `src/shared/types/api.types.ts`**

```ts
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}
```

- [ ] **Step 8: Create `src/shared/lib/queryClient.ts`**

```ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})
```

- [ ] **Step 9: Commit**

```bash
git add src/shared/utils/ src/shared/types/ src/shared/lib/queryClient.ts
git commit -m "feat: add shared utilities, types, and query client"
```

---

## Task 5: Shared components

**Files:**
- Create: `src/shared/components/Button.tsx`
- Create: `src/shared/components/Button.test.tsx`
- Create: `src/shared/components/Spinner.tsx`
- Create: `src/shared/components/Badge.tsx`

- [ ] **Step 1: Write failing test for `Button`**

Create `src/shared/components/Button.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const handler = vi.fn()
    render(<Button onClick={handler}>Click</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handler).toHaveBeenCalledOnce()
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('does not call onClick when disabled', async () => {
    const handler = vi.fn()
    render(<Button disabled onClick={handler}>Disabled</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handler).not.toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm run test:run -- src/shared/components/Button.test.tsx`
Expected: FAIL — `Cannot find module './Button'`

- [ ] **Step 3: Create `src/shared/components/Button.tsx`**

```tsx
import { cn } from '../utils/cn'
import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const variants: Record<Variant, string> = {
  primary: 'bg-green-600 text-white hover:bg-green-700',
  secondary: 'border border-stone-300 text-stone-600 hover:bg-stone-50',
  ghost: 'text-stone-600 hover:bg-stone-100',
  danger: 'bg-red-500 text-white hover:bg-red-600',
}

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export function Button({ variant = 'primary', size = 'md', className, disabled, ...props }: Props) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={cn(
        'rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1',
        variants[variant],
        sizes[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    />
  )
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm run test:run -- src/shared/components/Button.test.tsx`
Expected: `4 passed`

- [ ] **Step 5: Create `src/shared/components/Spinner.tsx`**

```tsx
import { cn } from '../utils/cn'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }

export function Spinner({ size = 'md', className }: Props) {
  return (
    <div
      role="status"
      aria-label="Cargando"
      className={cn(
        'animate-spin rounded-full border-2 border-stone-200 border-t-green-600',
        sizes[size],
        className
      )}
    />
  )
}
```

- [ ] **Step 6: Create `src/shared/components/Badge.tsx`**

```tsx
import { cn } from '../utils/cn'
import type { ReactNode } from 'react'

type Color = 'green' | 'stone' | 'red' | 'yellow'

interface Props {
  children: ReactNode
  color?: Color
  className?: string
}

const colors: Record<Color, string> = {
  green: 'bg-green-100 text-green-700',
  stone: 'bg-stone-100 text-stone-600',
  red: 'bg-red-100 text-red-600',
  yellow: 'bg-yellow-100 text-yellow-700',
}

export function Badge({ children, color = 'stone', className }: Props) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', colors[color], className)}>
      {children}
    </span>
  )
}
```

- [ ] **Step 7: Commit**

```bash
git add src/shared/components/
git commit -m "feat: add shared Button, Spinner, and Badge components"
```

---

## Task 6: Shared hooks

**Files:**
- Create: `src/shared/hooks/useDebounce.ts`
- Create: `src/shared/hooks/useDebounce.test.ts`

- [ ] **Step 1: Write failing test**

Create `src/shared/hooks/useDebounce.test.ts`:

```ts
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { useDebounce } from './useDebounce'

describe('useDebounce', () => {
  afterEach(() => vi.useRealTimers())

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 300))
    expect(result.current).toBe('hello')
  })

  it('does not update until the delay has passed', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'hello' } }
    )
    rerender({ value: 'world' })
    expect(result.current).toBe('hello')
    act(() => vi.advanceTimersByTime(300))
    expect(result.current).toBe('world')
  })

  it('resets the timer on rapid updates', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'a' } }
    )
    rerender({ value: 'ab' })
    act(() => vi.advanceTimersByTime(200))
    rerender({ value: 'abc' })
    act(() => vi.advanceTimersByTime(200))
    expect(result.current).toBe('a')
    act(() => vi.advanceTimersByTime(100))
    expect(result.current).toBe('abc')
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm run test:run -- src/shared/hooks/useDebounce.test.ts`
Expected: FAIL — `Cannot find module './useDebounce'`

- [ ] **Step 3: Create `src/shared/hooks/useDebounce.ts`**

```ts
import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])

  return debounced
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm run test:run -- src/shared/hooks/useDebounce.test.ts`
Expected: `3 passed`

- [ ] **Step 5: Commit**

```bash
git add src/shared/hooks/
git commit -m "feat: add useDebounce hook"
```

---

## Task 7: Catalog domain — types and mock data

**Files:**
- Create: `src/domains/catalog/types/product.types.ts`
- Create: `src/domains/catalog/api/products.mock.ts`

- [ ] **Step 1: Create `src/domains/catalog/types/product.types.ts`**

```ts
export interface Product {
  id: string
  name: string
  description: string
  price: number
  categoryId: string
  imageUrl: string
  stock: number
  isOrganic: boolean
  isFeatured: boolean
  slug: string
}

export interface Category {
  id: string
  name: string
  slug: string
}

export interface ProductFilters {
  categoryId?: string
  search?: string
  onlyOrganic?: boolean
}
```

- [ ] **Step 2: Create `src/domains/catalog/api/products.mock.ts`**

```ts
import type { Product, Category } from '../types/product.types'

export const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Bebidas', slug: 'bebidas' },
  { id: 'cat-2', name: 'Alimentos', slug: 'alimentos' },
  { id: 'cat-3', name: 'Cuidado Personal', slug: 'cuidado-personal' },
]

export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Café Orgánico Tarrazú',
    description: 'Café de altura cultivado en la zona de Los Santos, Tarrazú. 100% orgánico y de comercio justo.',
    price: 5500,
    categoryId: 'cat-1',
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
    stock: 50,
    isOrganic: true,
    isFeatured: true,
    slug: 'cafe-organico-tarrazu',
  },
  {
    id: 'prod-2',
    name: 'Miel de Abejas Silvestres',
    description: 'Miel pura recolectada de colmenas nativas del bosque costarricense.',
    price: 3200,
    categoryId: 'cat-2',
    imageUrl: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400',
    stock: 30,
    isOrganic: true,
    isFeatured: true,
    slug: 'miel-abejas-silvestres',
  },
  {
    id: 'prod-3',
    name: 'Aceite de Coco Prensado en Frío',
    description: 'Aceite de coco virgen extra, prensado en frío, ideal para cocinar y cuidado de la piel.',
    price: 4800,
    categoryId: 'cat-2',
    imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400',
    stock: 25,
    isOrganic: true,
    isFeatured: false,
    slug: 'aceite-coco-prensado-frio',
  },
  {
    id: 'prod-4',
    name: 'Jabón Artesanal de Aloe Vera',
    description: 'Jabón natural elaborado con aloe vera y aceites esenciales, sin químicos artificiales.',
    price: 1800,
    categoryId: 'cat-3',
    imageUrl: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f33c?w=400',
    stock: 100,
    isOrganic: true,
    isFeatured: false,
    slug: 'jabon-artesanal-aloe-vera',
  },
  {
    id: 'prod-5',
    name: 'Granola Artesanal Tropical',
    description: 'Granola con avena integral, coco, maracuyá y guanábana deshidratada.',
    price: 2900,
    categoryId: 'cat-2',
    imageUrl: 'https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?w=400',
    stock: 40,
    isOrganic: true,
    isFeatured: true,
    slug: 'granola-artesanal-tropical',
  },
  {
    id: 'prod-6',
    name: 'Té de Hierba Limón',
    description: 'Hierba limón seca de cultivo orgánico. Perfecta para infusiones relajantes.',
    price: 1500,
    categoryId: 'cat-1',
    imageUrl: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400',
    stock: 60,
    isOrganic: true,
    isFeatured: false,
    slug: 'te-hierba-limon',
  },
]
```

- [ ] **Step 3: Commit**

```bash
git add src/domains/catalog/types/ src/domains/catalog/api/products.mock.ts
git commit -m "feat: add catalog domain types and mock data"
```

---

## Task 8: Catalog domain — API layer and MSW handlers

**Files:**
- Create: `src/domains/catalog/api/products.api.ts`
- Modify: `src/shared/lib/msw/handlers.ts`

- [ ] **Step 1: Create `src/domains/catalog/api/products.api.ts`**

```ts
import type { Product, Category, ProductFilters } from '../types/product.types'

export const productsApi = {
  async getAll(filters?: ProductFilters): Promise<Product[]> {
    const params = new URLSearchParams()
    if (filters?.categoryId) params.set('categoryId', filters.categoryId)
    if (filters?.search) params.set('search', filters.search)
    if (filters?.onlyOrganic) params.set('onlyOrganic', 'true')
    const res = await fetch(`/api/products?${params}`)
    if (!res.ok) throw new Error('Failed to fetch products')
    return res.json() as Promise<Product[]>
  },

  async getById(id: string): Promise<Product> {
    const res = await fetch(`/api/products/${id}`)
    if (!res.ok) throw new Error(`Product ${id} not found`)
    return res.json() as Promise<Product>
  },
}

export const categoriesApi = {
  async getAll(): Promise<Category[]> {
    const res = await fetch('/api/categories')
    if (!res.ok) throw new Error('Failed to fetch categories')
    return res.json() as Promise<Category[]>
  },
}
```

- [ ] **Step 2: Update `src/shared/lib/msw/handlers.ts` with real handlers**

```ts
import { http, HttpResponse } from 'msw'
import { mockProducts, mockCategories } from '@domains/catalog/api/products.mock'

export const handlers = [
  http.get('/api/products', ({ request }) => {
    const url = new URL(request.url)
    const categoryId = url.searchParams.get('categoryId')
    const search = url.searchParams.get('search')
    const onlyOrganic = url.searchParams.get('onlyOrganic') === 'true'

    let results = mockProducts
    if (categoryId) results = results.filter(p => p.categoryId === categoryId)
    if (search) results = results.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    if (onlyOrganic) results = results.filter(p => p.isOrganic)

    return HttpResponse.json(results)
  }),

  http.get('/api/products/:id', ({ params }) => {
    const product = mockProducts.find(p => p.id === params.id)
    if (!product) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(product)
  }),

  http.get('/api/categories', () => HttpResponse.json(mockCategories)),
]
```

- [ ] **Step 3: Commit**

```bash
git add src/domains/catalog/api/products.api.ts src/shared/lib/msw/handlers.ts
git commit -m "feat: add catalog API layer and MSW handlers with filtering"
```

---

## Task 9: Catalog domain — hooks (TDD)

**Files:**
- Create: `src/domains/catalog/hooks/useProducts.ts`
- Create: `src/domains/catalog/hooks/useProducts.test.ts`
- Create: `src/domains/catalog/hooks/useProductById.ts`
- Create: `src/domains/catalog/hooks/useProductById.test.ts`
- Create: `src/domains/catalog/hooks/useCategories.ts`

- [ ] **Step 1: Write failing tests for `useProducts` and `useProductById`**

Create `src/domains/catalog/hooks/useProducts.test.ts`:

```tsx
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect } from 'vitest'
import { useProducts } from './useProducts'
import { mockProducts, mockCategories } from '../api/products.mock'
import type { ReactNode } from 'react'

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

describe('useProducts', () => {
  it('returns all products', async () => {
    const { result } = renderHook(() => useProducts(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(mockProducts.length)
  })

  it('filters by categoryId', async () => {
    const { result } = renderHook(() => useProducts({ categoryId: 'cat-1' }), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    const expected = mockProducts.filter(p => p.categoryId === 'cat-1')
    expect(result.current.data).toHaveLength(expected.length)
  })

  it('filters by search term', async () => {
    const { result } = renderHook(() => useProducts({ search: 'café' }), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.every(p => p.name.toLowerCase().includes('café'))).toBe(true)
  })
})
```

Create `src/domains/catalog/hooks/useProductById.test.ts`:

```tsx
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect } from 'vitest'
import { useProductById } from './useProductById'
import { mockProducts } from '../api/products.mock'
import type { ReactNode } from 'react'

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

describe('useProductById', () => {
  it('fetches a single product by id', async () => {
    const { result } = renderHook(() => useProductById('prod-1'), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockProducts[0])
  })

  it('does not fetch when id is empty', () => {
    const { result } = renderHook(() => useProductById(''), { wrapper })
    expect(result.current.fetchStatus).toBe('idle')
    expect(result.current.data).toBeUndefined()
  })
})
```

- [ ] **Step 2: Run to verify they fail**

Run: `npm run test:run -- src/domains/catalog/hooks/`
Expected: FAIL — `Cannot find module './useProducts'`

- [ ] **Step 3: Create `src/domains/catalog/hooks/useProducts.ts`**

```ts
import { useQuery } from '@tanstack/react-query'
import { productsApi } from '../api/products.api'
import type { ProductFilters } from '../types/product.types'

export const useProducts = (filters?: ProductFilters) =>
  useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsApi.getAll(filters),
  })
```

- [ ] **Step 4: Create `src/domains/catalog/hooks/useProductById.ts`**

```ts
import { useQuery } from '@tanstack/react-query'
import { productsApi } from '../api/products.api'

export const useProductById = (id: string) =>
  useQuery({
    queryKey: ['products', id],
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
  })
```

- [ ] **Step 5: Create `src/domains/catalog/hooks/useCategories.ts`**

```ts
import { useQuery } from '@tanstack/react-query'
import { categoriesApi } from '../api/products.api'

export const useCategories = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  })
```

- [ ] **Step 6: Run to verify all pass**

Run: `npm run test:run -- src/domains/catalog/hooks/`
Expected: `5 passed`

- [ ] **Step 7: Commit**

```bash
git add src/domains/catalog/hooks/
git commit -m "feat: add catalog hooks (useProducts, useProductById, useCategories)"
```

---

## Task 10: Cart domain (TDD)

**Files:**
- Create: `src/domains/cart/types/cart.types.ts`
- Create: `src/domains/cart/store/cart.store.ts`
- Create: `src/domains/cart/store/cart.store.test.ts`
- Create: `src/domains/cart/hooks/useCart.ts`

- [ ] **Step 1: Create `src/domains/cart/types/cart.types.ts`**

```ts
import type { Product } from '@domains/catalog/types/product.types'

export interface CartItem {
  product: Product
  quantity: number
}
```

- [ ] **Step 2: Write failing tests for the cart store**

Create `src/domains/cart/store/cart.store.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { act } from '@testing-library/react'
import { useCartStore } from './cart.store'
import { mockProducts } from '@domains/catalog/api/products.mock'

const [p1, p2] = mockProducts

beforeEach(() => {
  act(() => useCartStore.setState({ items: [] }))
})

describe('cart store', () => {
  it('adds a new item with quantity 1', () => {
    act(() => useCartStore.getState().addItem(p1))
    expect(useCartStore.getState().items).toHaveLength(1)
    expect(useCartStore.getState().items[0].quantity).toBe(1)
  })

  it('increments quantity when adding an existing item', () => {
    act(() => {
      useCartStore.getState().addItem(p1)
      useCartStore.getState().addItem(p1)
    })
    expect(useCartStore.getState().items).toHaveLength(1)
    expect(useCartStore.getState().items[0].quantity).toBe(2)
  })

  it('adds a custom quantity', () => {
    act(() => useCartStore.getState().addItem(p1, 3))
    expect(useCartStore.getState().items[0].quantity).toBe(3)
  })

  it('removes an item', () => {
    act(() => {
      useCartStore.getState().addItem(p1)
      useCartStore.getState().removeItem(p1.id)
    })
    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it('updates quantity', () => {
    act(() => {
      useCartStore.getState().addItem(p1)
      useCartStore.getState().updateQuantity(p1.id, 5)
    })
    expect(useCartStore.getState().items[0].quantity).toBe(5)
  })

  it('removes item when quantity is set to 0', () => {
    act(() => {
      useCartStore.getState().addItem(p1)
      useCartStore.getState().updateQuantity(p1.id, 0)
    })
    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it('clears all items', () => {
    act(() => {
      useCartStore.getState().addItem(p1)
      useCartStore.getState().addItem(p2)
      useCartStore.getState().clearCart()
    })
    expect(useCartStore.getState().items).toHaveLength(0)
  })
})
```

- [ ] **Step 3: Run to verify it fails**

Run: `npm run test:run -- src/domains/cart/store/cart.store.test.ts`
Expected: FAIL — `Cannot find module './cart.store'`

- [ ] **Step 4: Create `src/domains/cart/store/cart.store.ts`**

```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '../types/cart.types'
import type { Product } from '@domains/catalog/types/product.types'

interface CartStore {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            }
          }
          return { items: [...state.items, { product, quantity }] }
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.product.id !== productId)
              : state.items.map((i) =>
                  i.product.id === productId ? { ...i, quantity } : i
                ),
        })),

      clearCart: () => set({ items: [] }),
    }),
    { name: 'organico-cart' }
  )
)
```

- [ ] **Step 5: Run to verify all pass**

Run: `npm run test:run -- src/domains/cart/store/cart.store.test.ts`
Expected: `7 passed`

- [ ] **Step 6: Create `src/domains/cart/hooks/useCart.ts`**

```ts
import { useCartStore } from '../store/cart.store'

export function useCart() {
  const { items, addItem, removeItem, updateQuantity, clearCart } = useCartStore()

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  return { items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }
}
```

- [ ] **Step 7: Commit**

```bash
git add src/domains/cart/
git commit -m "feat: add cart domain (store, types, useCart hook)"
```

---

## Task 11: App bootstrap — providers and router skeleton

**Files:**
- Create: `src/app/providers/AppProviders.tsx`
- Create: `src/app/router/index.tsx` (skeleton — pages added in later tasks)
- Create: `src/main.tsx`

- [ ] **Step 1: Create `src/app/providers/AppProviders.tsx`**

```tsx
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@shared/lib/queryClient'
import type { ReactNode } from 'react'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

- [ ] **Step 2: Create `src/app/router/index.tsx` (skeleton)**

```tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Spinner } from '@shared/components/Spinner'

function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner size="lg" />
    </div>
  )
}

function wrap(Component: React.LazyExoticComponent<() => JSX.Element>) {
  return (
    <Suspense fallback={<Loading />}>
      <Component />
    </Suspense>
  )
}

// Layouts (not lazy — they wrap routes)
import { StoreLayout } from '@store/layouts/StoreLayout'
import { AdminLayout } from '@admin/layouts/AdminLayout'

// Store pages
const HomePage = lazy(() => import('@store/pages/home/HomePage'))
const CatalogPage = lazy(() => import('@store/pages/catalog/CatalogPage'))
const ProductDetailPage = lazy(() => import('@store/pages/product-detail/ProductDetailPage'))
const CartPage = lazy(() => import('@store/pages/cart/CartPage'))

// Admin pages
const DashboardPage = lazy(() => import('@admin/pages/dashboard/DashboardPage'))
const AdminProductsPage = lazy(() => import('@admin/pages/products/AdminProductsPage'))
const AdminProductFormPage = lazy(() => import('@admin/pages/products/AdminProductFormPage'))

// Shared
const NotFoundPage = lazy(() => import('@shared/pages/NotFoundPage'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <StoreLayout />,
    children: [
      { index: true, element: wrap(HomePage) },
      { path: 'catalog', element: wrap(CatalogPage) },
      { path: 'catalog/:id', element: wrap(ProductDetailPage) },
      { path: 'cart', element: wrap(CartPage) },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: wrap(DashboardPage) },
      { path: 'products', element: wrap(AdminProductsPage) },
      { path: 'products/new', element: wrap(AdminProductFormPage) },
      { path: 'products/:id', element: wrap(AdminProductFormPage) },
    ],
  },
  { path: '*', element: wrap(NotFoundPage) },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
```

- [ ] **Step 3: Create `src/main.tsx`**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './app/styles/globals.css'
import { AppProviders } from './app/providers/AppProviders'
import { AppRouter } from './app/router'

async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./shared/lib/msw/browser')
    return worker.start({ onUnhandledRequest: 'bypass' })
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </StrictMode>
  )
})
```

- [ ] **Step 4: Commit**

```bash
git add src/app/ src/main.tsx
git commit -m "feat: wire up app providers, router, and entry point"
```

---

## Task 12: Store layout and navigation components

**Files:**
- Create: `src/store/layouts/StoreLayout.tsx`
- Create: `src/store/components/CartIcon.tsx`

- [ ] **Step 1: Create `src/store/components/CartIcon.tsx`**

```tsx
import { Link } from 'react-router-dom'
import { useCart } from '@domains/cart/hooks/useCart'

export function CartIcon() {
  const { totalItems } = useCart()
  return (
    <Link
      to="/cart"
      aria-label={`Carrito con ${totalItems} productos`}
      className="relative text-stone-600 hover:text-green-700 transition-colors"
    >
      <span className="text-2xl">🛒</span>
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </Link>
  )
}
```

- [ ] **Step 2: Create `src/store/layouts/StoreLayout.tsx`**

```tsx
import { Link, Outlet } from 'react-router-dom'
import { CartIcon } from '../components/CartIcon'

export function StoreLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-green-700">
            🌿 OrganicoCR
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/catalog" className="text-stone-600 hover:text-green-700 text-sm font-medium transition-colors">
              Tienda
            </Link>
            <CartIcon />
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-green-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-green-200">
          © 2026 OrganicoCR — Productos orgánicos de Costa Rica
        </div>
      </footer>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/store/layouts/ src/store/components/CartIcon.tsx
git commit -m "feat: add store layout and cart icon"
```

---

## Task 13: ProductCard component (TDD)

**Files:**
- Create: `src/store/components/ProductCard.tsx`
- Create: `src/store/components/ProductCard.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/store/components/ProductCard.test.tsx`:

```tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { act } from '@testing-library/react'
import { ProductCard } from './ProductCard'
import { mockProducts } from '@domains/catalog/api/products.mock'
import { useCartStore } from '@domains/cart/store/cart.store'

const product = mockProducts[0]

beforeEach(() => {
  act(() => useCartStore.setState({ items: [] }))
})

function renderCard(p = product) {
  return render(
    <MemoryRouter>
      <ProductCard product={p} />
    </MemoryRouter>
  )
}

describe('ProductCard', () => {
  it('renders the product name', () => {
    renderCard()
    expect(screen.getByText(product.name)).toBeInTheDocument()
  })

  it('renders an "Agregar" button when in stock', () => {
    renderCard()
    expect(screen.getByRole('button', { name: /agregar/i })).toBeEnabled()
  })

  it('renders a disabled "Agotado" button when out of stock', () => {
    renderCard({ ...product, stock: 0 })
    expect(screen.getByRole('button', { name: /agotado/i })).toBeDisabled()
  })

  it('adds the product to cart when clicking Agregar', async () => {
    renderCard()
    await userEvent.click(screen.getByRole('button', { name: /agregar/i }))
    expect(useCartStore.getState().items).toHaveLength(1)
    expect(useCartStore.getState().items[0].product.id).toBe(product.id)
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm run test:run -- src/store/components/ProductCard.test.tsx`
Expected: FAIL — `Cannot find module './ProductCard'`

- [ ] **Step 3: Create `src/store/components/ProductCard.tsx`**

```tsx
import { Link } from 'react-router-dom'
import { useCart } from '@domains/cart/hooks/useCart'
import { formatPrice } from '@shared/utils/formatPrice'
import type { Product } from '@domains/catalog/types/product.types'

interface Props {
  product: Product
}

export function ProductCard({ product }: Props) {
  const { addItem } = useCart()

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-md transition-shadow">
      <Link to={`/catalog/${product.id}`}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4">
        {product.isOrganic && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
            🌿 Orgánico
          </span>
        )}
        <Link to={`/catalog/${product.id}`}>
          <h3 className="font-semibold text-stone-800 mt-2 hover:text-green-700 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-stone-500 text-sm mt-1 line-clamp-2">{product.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-bold text-green-700 text-lg">{formatPrice(product.price)}</span>
          <button
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
            className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {product.stock === 0 ? 'Agotado' : 'Agregar'}
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run to verify all pass**

Run: `npm run test:run -- src/store/components/ProductCard.test.tsx`
Expected: `4 passed`

- [ ] **Step 5: Commit**

```bash
git add src/store/components/ProductCard.tsx src/store/components/ProductCard.test.tsx
git commit -m "feat: add ProductCard component with cart integration"
```

---

## Task 14: Store pages — Home and Catalog

**Files:**
- Create: `src/store/pages/home/HomePage.tsx`
- Create: `src/store/pages/catalog/CatalogPage.tsx`
- Create: `src/store/pages/catalog/CatalogPage.test.tsx`

- [ ] **Step 1: Write failing test for CatalogPage**

Create `src/store/pages/catalog/CatalogPage.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import CatalogPage from './CatalogPage'
import { mockProducts } from '@domains/catalog/api/products.mock'

function renderPage() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <CatalogPage />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('CatalogPage', () => {
  it('shows a search input', () => {
    renderPage()
    expect(screen.getByPlaceholderText(/buscar/i)).toBeInTheDocument()
  })

  it('renders product cards after loading', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText(mockProducts[0].name)).toBeInTheDocument()
    })
  })

  it('shows a spinner while loading', () => {
    renderPage()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm run test:run -- src/store/pages/catalog/CatalogPage.test.tsx`
Expected: FAIL — `Cannot find module './CatalogPage'`

- [ ] **Step 3: Create `src/store/pages/home/HomePage.tsx`**

```tsx
import { Link } from 'react-router-dom'
import { useProducts } from '@domains/catalog/hooks/useProducts'
import { ProductCard } from '@store/components/ProductCard'
import { Spinner } from '@shared/components/Spinner'

export default function HomePage() {
  const { data: products, isPending } = useProducts()
  const featured = products?.filter(p => p.isFeatured) ?? []

  return (
    <div>
      <section className="bg-gradient-to-br from-green-800 to-green-600 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Productos Orgánicos de Costa Rica</h1>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Del campo a tu mesa. Apoya a productores locales y cuida tu salud con nuestros productos 100% orgánicos.
          </p>
          <Link
            to="/catalog"
            className="bg-white text-green-800 px-8 py-3 rounded-full font-semibold hover:bg-green-50 transition-colors"
          >
            Ver Catálogo
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-stone-800 mb-8">Productos Destacados</h2>
        {isPending ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  )
}
```

- [ ] **Step 4: Create `src/store/pages/catalog/CatalogPage.tsx`**

```tsx
import { useState } from 'react'
import { useProducts } from '@domains/catalog/hooks/useProducts'
import { useCategories } from '@domains/catalog/hooks/useCategories'
import { ProductCard } from '@store/components/ProductCard'
import { Spinner } from '@shared/components/Spinner'
import { useDebounce } from '@shared/hooks/useDebounce'
import type { ProductFilters } from '@domains/catalog/types/product.types'

export default function CatalogPage() {
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState<string | undefined>()
  const debouncedSearch = useDebounce(search, 300)

  const filters: ProductFilters = {
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(categoryId && { categoryId }),
  }

  const { data: products, isPending } = useProducts(filters)
  const { data: categories } = useCategories()

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-stone-800 mb-8">Catálogo</h1>

      <div className="flex flex-wrap gap-4 mb-8">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-stone-300 rounded-lg px-4 py-2 text-sm flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <select
          value={categoryId ?? ''}
          onChange={e => setCategoryId(e.target.value || undefined)}
          className="border border-stone-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Todas las categorías</option>
          {categories?.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {isPending ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products?.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 5: Run to verify tests pass**

Run: `npm run test:run -- src/store/pages/catalog/CatalogPage.test.tsx`
Expected: `3 passed`

- [ ] **Step 6: Commit**

```bash
git add src/store/pages/
git commit -m "feat: add HomePage and CatalogPage with search and filter"
```

---

## Task 15: Store pages — Product Detail and Cart

**Files:**
- Create: `src/store/pages/product-detail/ProductDetailPage.tsx`
- Create: `src/store/pages/cart/CartPage.tsx`

- [ ] **Step 1: Create `src/store/pages/product-detail/ProductDetailPage.tsx`**

```tsx
import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useProductById } from '@domains/catalog/hooks/useProductById'
import { useCart } from '@domains/cart/hooks/useCart'
import { formatPrice } from '@shared/utils/formatPrice'
import { Spinner } from '@shared/components/Spinner'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: product, isPending, isError } = useProductById(id!)
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)

  if (isPending) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  }
  if (isError || !product) {
    return <div className="text-center py-20 text-stone-500">Producto no encontrado.</div>
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <button onClick={() => navigate(-1)} className="text-stone-500 hover:text-stone-700 mb-6 text-sm">
        ← Volver
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <img src={product.imageUrl} alt={product.name} className="rounded-xl w-full object-cover aspect-square" />
        <div>
          {product.isOrganic && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
              🌿 Orgánico
            </span>
          )}
          <h1 className="text-3xl font-bold text-stone-800 mt-3">{product.name}</h1>
          <p className="text-2xl font-bold text-green-700 mt-2">{formatPrice(product.price)}</p>
          <p className="text-stone-600 mt-4 leading-relaxed">{product.description}</p>
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center border border-stone-300 rounded-lg">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="px-3 py-2 text-stone-500 hover:text-stone-800"
                aria-label="Disminuir cantidad"
              >
                −
              </button>
              <span className="px-4 py-2 font-medium">{qty}</span>
              <button
                onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                className="px-3 py-2 text-stone-500 hover:text-stone-800"
                aria-label="Aumentar cantidad"
              >
                +
              </button>
            </div>
            <button
              onClick={() => addItem(product, qty)}
              disabled={product.stock === 0}
              className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {product.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
            </button>
          </div>
          <p className="text-sm text-stone-400 mt-2">{product.stock} unidades disponibles</p>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `src/store/pages/cart/CartPage.tsx`**

```tsx
import { Link } from 'react-router-dom'
import { useCart } from '@domains/cart/hooks/useCart'
import { formatPrice } from '@shared/utils/formatPrice'

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-6xl mb-4">🛒</p>
        <h2 className="text-2xl font-bold text-stone-700 mb-2">Tu carrito está vacío</h2>
        <Link to="/catalog" className="text-green-600 hover:underline">
          Explorar el catálogo →
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-stone-800">
          Carrito ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})
        </h1>
        <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700">
          Vaciar carrito
        </button>
      </div>

      <div className="space-y-4">
        {items.map(({ product, quantity }) => (
          <div key={product.id} className="bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-4">
            <img src={product.imageUrl} alt={product.name} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-stone-800 truncate">{product.name}</h3>
              <p className="text-green-700 font-bold">{formatPrice(product.price)}</p>
            </div>
            <div className="flex items-center border border-stone-300 rounded-lg">
              <button
                onClick={() => updateQuantity(product.id, quantity - 1)}
                className="px-3 py-1.5 text-stone-500 hover:text-stone-800"
                aria-label="Disminuir"
              >
                −
              </button>
              <span className="px-3 font-medium">{quantity}</span>
              <button
                onClick={() => updateQuantity(product.id, quantity + 1)}
                className="px-3 py-1.5 text-stone-500 hover:text-stone-800"
                aria-label="Aumentar"
              >
                +
              </button>
            </div>
            <button
              onClick={() => removeItem(product.id)}
              className="text-stone-400 hover:text-red-500 transition-colors"
              aria-label="Eliminar"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-xl border border-stone-200 p-6">
        <div className="flex justify-between text-lg font-bold text-stone-800 mb-4">
          <span>Total</span>
          <span className="text-green-700">{formatPrice(totalPrice)}</span>
        </div>
        <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
          Proceder al pago
        </button>
        <Link to="/catalog" className="block text-center mt-3 text-sm text-stone-500 hover:text-stone-700">
          Seguir comprando
        </Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/store/pages/product-detail/ src/store/pages/cart/
git commit -m "feat: add ProductDetailPage and CartPage"
```

---

## Task 16: Admin layout and sidebar

**Files:**
- Create: `src/admin/components/Sidebar.tsx`
- Create: `src/admin/layouts/AdminLayout.tsx`

- [ ] **Step 1: Create `src/admin/components/Sidebar.tsx`**

```tsx
import { NavLink } from 'react-router-dom'
import { cn } from '@shared/utils/cn'

const links = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/products', label: 'Productos', icon: '🌿', end: false },
  { to: '/admin/orders', label: 'Pedidos', icon: '📦', end: false },
  { to: '/admin/customers', label: 'Clientes', icon: '👥', end: false },
]

export function Sidebar() {
  return (
    <aside className="w-64 bg-green-800 text-white flex flex-col flex-shrink-0">
      <div className="p-6 border-b border-green-700">
        <span className="text-xl font-bold">🌿 OrganicoCR</span>
        <p className="text-green-300 text-xs mt-1">Panel Admin</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-green-700 text-white'
                  : 'text-green-200 hover:bg-green-700 hover:text-white'
              )
            }
          >
            <span>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-green-700">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-green-300 hover:text-white transition-colors"
        >
          ← Ver Tienda
        </NavLink>
      </div>
    </aside>
  )
}
```

- [ ] **Step 2: Create `src/admin/layouts/AdminLayout.tsx`**

```tsx
import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'

export function AdminLayout() {
  return (
    <div className="flex h-screen bg-stone-100 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/admin/layouts/ src/admin/components/Sidebar.tsx
git commit -m "feat: add admin layout with sidebar navigation"
```

---

## Task 17: Admin pages

**Files:**
- Create: `src/admin/pages/dashboard/DashboardPage.tsx`
- Create: `src/admin/pages/products/AdminProductsPage.tsx`
- Create: `src/admin/pages/products/AdminProductFormPage.tsx`

- [ ] **Step 1: Create `src/admin/pages/dashboard/DashboardPage.tsx`**

```tsx
import { useProducts } from '@domains/catalog/hooks/useProducts'
import { useCart } from '@domains/cart/hooks/useCart'
import { formatPrice } from '@shared/utils/formatPrice'

export default function DashboardPage() {
  const { data: products = [] } = useProducts()
  const { totalItems, totalPrice } = useCart()

  const stats = [
    { label: 'Total Productos', value: products.length, icon: '🌿' },
    { label: 'Con Stock', value: products.filter(p => p.stock > 0).length, icon: '✅' },
    { label: 'Items en Carrito', value: totalItems, icon: '🛒' },
    { label: 'Valor Carrito', value: formatPrice(totalPrice), icon: '💰' },
  ]

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-stone-800 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ label, value, icon }) => (
          <div key={label} className="bg-white rounded-xl border border-stone-200 p-6">
            <div className="text-3xl mb-3">{icon}</div>
            <div className="text-2xl font-bold text-stone-800">{value}</div>
            <div className="text-sm text-stone-500 mt-1">{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `src/admin/pages/products/AdminProductsPage.tsx`**

```tsx
import { Link } from 'react-router-dom'
import { useProducts } from '@domains/catalog/hooks/useProducts'
import { formatPrice } from '@shared/utils/formatPrice'
import { Spinner } from '@shared/components/Spinner'

export default function AdminProductsPage() {
  const { data: products, isPending } = useProducts()

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-stone-800">Productos</h1>
        <Link
          to="/admin/products/new"
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
        >
          + Nuevo Producto
        </Link>
      </div>

      {isPending ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-stone-600">Producto</th>
                <th className="text-left px-6 py-3 font-medium text-stone-600">Precio</th>
                <th className="text-left px-6 py-3 font-medium text-stone-600">Stock</th>
                <th className="text-left px-6 py-3 font-medium text-stone-600">Orgánico</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {products?.map(product => (
                <tr key={product.id} className="hover:bg-stone-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                      <span className="font-medium text-stone-800">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-green-700 font-medium">{formatPrice(product.price)}</td>
                  <td className="px-6 py-4">
                    <span className={product.stock > 0 ? 'text-green-600' : 'text-red-500 font-medium'}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">{product.isOrganic ? '✅' : '—'}</td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/admin/products/${product.id}`}
                      className="text-green-600 hover:text-green-800 font-medium"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Create `src/admin/pages/products/AdminProductFormPage.tsx`**

```tsx
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useProductById } from '@domains/catalog/hooks/useProductById'
import { useCategories } from '@domains/catalog/hooks/useCategories'
import { Spinner } from '@shared/components/Spinner'
import type { Product } from '@domains/catalog/types/product.types'

type FormData = Omit<Product, 'id' | 'slug'>

const emptyForm: FormData = {
  name: '',
  description: '',
  price: 0,
  categoryId: '',
  imageUrl: '',
  stock: 0,
  isOrganic: true,
  isFeatured: false,
}

export default function AdminProductFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = !!id
  const { data: product, isPending } = useProductById(id ?? '')
  const { data: categories } = useCategories()
  const [form, setForm] = useState<FormData>(emptyForm)

  useEffect(() => {
    if (product) {
      const { id: _id, slug: _slug, ...rest } = product
      setForm(rest)
    }
  }, [product])

  if (isEdit && isPending) {
    return <div className="flex justify-center py-20"><Spinner /></div>
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO(backend): wire up POST /api/products or PUT /api/products/:id
    console.log('submit', form)
    navigate('/admin/products')
  }

  function field(label: string, node: React.ReactNode) {
    return (
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">{label}</label>
        {node}
      </div>
    )
  }

  const inputClass = "w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-stone-800 mb-8">
        {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-xl border border-stone-200 p-6">
        {field('Nombre', (
          <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputClass} />
        ))}
        {field('Descripción', (
          <textarea required rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className={inputClass} />
        ))}
        <div className="grid grid-cols-2 gap-4">
          {field('Precio (CRC)', (
            <input type="number" required min={0} value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} className={inputClass} />
          ))}
          {field('Stock', (
            <input type="number" required min={0} value={form.stock} onChange={e => setForm(f => ({ ...f, stock: Number(e.target.value) }))} className={inputClass} />
          ))}
        </div>
        {field('Categoría', (
          <select required value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} className={inputClass}>
            <option value="">Seleccionar categoría</option>
            {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        ))}
        {field('URL de Imagen', (
          <input type="url" value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} className={inputClass} />
        ))}
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm font-medium text-stone-700 cursor-pointer">
            <input type="checkbox" checked={form.isOrganic} onChange={e => setForm(f => ({ ...f, isOrganic: e.target.checked }))} className="rounded text-green-600" />
            Producto Orgánico
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-stone-700 cursor-pointer">
            <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} className="rounded text-green-600" />
            Destacado en inicio
          </label>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors">
            {isEdit ? 'Guardar Cambios' : 'Crear Producto'}
          </button>
          <button type="button" onClick={() => navigate('/admin/products')} className="border border-stone-300 text-stone-600 px-6 py-2.5 rounded-lg font-medium hover:bg-stone-50 transition-colors">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/admin/pages/
git commit -m "feat: add admin dashboard and product management pages"
```

---

## Task 18: NotFoundPage and final smoke test

**Files:**
- Create: `src/shared/pages/NotFoundPage.tsx`

- [ ] **Step 1: Create `src/shared/pages/NotFoundPage.tsx`**

```tsx
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <p className="text-8xl mb-4">🌿</p>
      <h1 className="text-4xl font-bold text-stone-800 mb-2">404</h1>
      <p className="text-stone-500 mb-8">Esta página no existe o fue movida.</p>
      <Link
        to="/"
        className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
```

- [ ] **Step 2: Run the full test suite**

Run: `npm run test:run`
Expected: All tests pass. Count should include tests from:
- `formatPrice.test.ts`
- `Button.test.tsx`
- `useDebounce.test.ts`
- `useProducts.test.ts`
- `useProductById.test.ts`
- `cart.store.test.ts`
- `ProductCard.test.tsx`
- `CatalogPage.test.tsx`

- [ ] **Step 3: Start the dev server and verify visually**

Run: `npm run dev`

Open `http://localhost:5173` — verify:
- Home page loads with hero section and featured products
- `/catalog` shows all products with search and filter
- `/catalog/prod-1` shows product detail page
- `/cart` shows empty cart state
- Add a product from catalog and verify cart badge increments
- `/admin` shows dashboard with stats
- `/admin/products` shows product table
- `/admin/products/new` shows empty form
- `/admin/products/prod-1` shows populated form

- [ ] **Step 4: Final commit**

```bash
git add src/shared/pages/NotFoundPage.tsx
git commit -m "feat: add NotFoundPage and complete project scaffold"
```

---

## Summary

| Layer | Tasks | Key decisions |
|---|---|---|
| Infrastructure | 1–3 | Manual config (not create-vite) to avoid overwriting docs/ |
| Shared | 4–6 | Utilities, components, and hooks with 100% test coverage |
| Domains | 7–10 | Catalog (types + mock + api + hooks) and Cart (store + hook) |
| App | 11 | Providers + lazy-loaded router |
| Store | 12–15 | Layout → components → pages, tested with MSW |
| Admin | 16–17 | Layout + all 3 admin pages |
| Final | 18 | 404 page + full suite green + smoke test |
