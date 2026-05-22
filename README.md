# OrganicoCR

Plataforma de e-commerce para la venta de productos orgánicos frescos, conectando directamente a consumidores con más de 50 productores locales de Costa Rica. Entrega en 24 horas, más de 200 productos orgánicos certificados.

---

## Stack Tecnológico

| Categoría | Tecnología |
|-----------|-----------|
| Framework | React 19 + TypeScript 6 |
| Build Tool | Vite 8 |
| Routing | React Router v7 |
| Estilos | Tailwind CSS v3 |
| Estado servidor | TanStack React Query v5 |
| Estado cliente | Zustand v5 (persistido en `localStorage`) |
| Animaciones | GSAP 3 + ScrollTrigger |
| Testing | Vitest 4 + Testing Library + jsdom |
| Mocking API | Mock Service Worker (MSW) v2 |
| Package Manager | pnpm 10 |

---

## Requisitos

- **Node.js** >= 18
- **pnpm** >= 10 — `npm install -g pnpm`

---

## Instalación

```bash
git clone https://github.com/jasonMB12/OrganicoCR.git
cd OrganicoCR
pnpm install
pnpm dev
```

La aplicación estará disponible en `http://localhost:5173`.

---

## Comandos

```bash
pnpm dev              # Servidor de desarrollo con HMR
pnpm build            # Type-check + build de producción
pnpm preview          # Preview del build de producción
pnpm test             # Vitest en modo watch
pnpm test:run         # Tests una sola vez (CI)
pnpm test:coverage    # Reporte de cobertura
```

Para ejecutar un archivo de test específico:

```bash
pnpm test src/domains/catalog/hooks/useProducts.test.tsx
```

---

## Arquitectura

SPA con estructura domain-driven. Cada dominio posee su propia capa de API, hooks y tipos.

```
src/
├── app/             # Bootstrap — providers, router, CSS global
├── domains/         # Dominios de negocio
│   ├── catalog/     # Productos y categorías (React Query)
│   └── cart/        # Carrito de compras (Zustand + localStorage)
├── shared/          # Utilidades, componentes y configuración transversal
├── store/           # Páginas y layouts del sitio público
└── admin/           # Panel de administración
```

### Dominios

**`catalog/`** — Gestiona productos, categorías y filtros. Toda la data se obtiene mediante React Query con `staleTime` de 5 minutos y 1 reintento. Los handlers de MSW interceptan `/api/*` tanto en desarrollo como en tests.

**`cart/`** — Store de Zustand con middleware `persist`. El estado se serializa en `localStorage` bajo la clave `organico-cart`.

### State Management

- **Estado servidor** (productos, categorías): React Query — configurado en `src/shared/lib/queryClient.ts`
- **Estado cliente** (carrito): Zustand — store en `src/domains/cart/store/cart.store.ts`

### Routing

Dos árboles de layout en `src/app/router/index.tsx`. Todos los componentes de página son lazy-loaded con `<Suspense>`.

| Layout | Rutas |
|--------|-------|
| `StoreLayout` | `/`, `/catalog`, `/catalog/:id`, `/cart`, `/sobre-nosotros`, `/contactanos` |
| Auth | `/login`, `/register` |
| `AdminLayout` | `/admin`, `/admin/products`, `/admin/products/new`, `/admin/products/:id` |

### Path Aliases

```
@/*         → src/
@domains/*  → src/domains/
@shared/*   → src/shared/
@store/*    → src/store/
@admin/*    → src/admin/
```

---

## Diseño y Estilos

- **Tipografía**: Familia `Outfit`, sistema de escala fluida con clamp (`text-hero`, `text-display`, `text-section`).
- **Paleta de marca**:

| Token | Color |
|-------|-------|
| `brand-cream` | `#F8F8F8` |
| `brand-green` | `#337418` |
| `brand-lime` | `#5DD62C` |
| `brand-dark` | `#202020` |
| `brand-black` | `#0F0F0F` |

- **Clases de componente** definidas en `globals.css`: `.island-pill`, `.bento-card`, `.promise-row`, entre otras.
- **Utilidad de clases**: `cn()` en `@shared/utils/cn.ts` — wrapper de `clsx` + `tailwind-merge`.
- **Animaciones**: GSAP ScrollTrigger para efectos de scroll, scroll-stacking de testimonios y escalado de cards.
- **Navegación**: Dynamic Island — píldora flotante estilo iOS posicionada en el centro superior.

---

## Testing

Los tests de integración corren contra MSW (sin mocks manuales). La configuración del servidor de test está en `src/test-setup.ts`.

```
src/
├── domains/catalog/hooks/   # useProducts, useProductById, useCategories
├── domains/cart/store/      # cart.store
├── shared/components/       # Button
├── shared/hooks/            # useDebounce
├── shared/utils/            # formatPrice
└── store/components/        # ProductCard
```

---

## Estructura de Páginas

### Sitio Público

| Página | Ruta | Descripción |
|--------|------|-------------|
| Home | `/` | Hero con GSAP, bento grid, productos destacados, testimonios |
| Catálogo | `/catalog` | Grid de productos con búsqueda y filtros por categoría |
| Detalle | `/catalog/:id` | Vista de producto individual |
| Carrito | `/cart` | Gestión del carrito con actualización de cantidades |
| Nosotros | `/sobre-nosotros` | Historia y misión de la empresa |
| Contacto | `/contactanos` | Formulario de contacto e información |
| Login | `/login` | Autenticación de usuario |
| Registro | `/register` | Creación de cuenta |

### Panel Admin

| Página | Ruta | Descripción |
|--------|------|-------------|
| Dashboard | `/admin` | Resumen general y estadísticas |
| Productos | `/admin/products` | Listado con acciones CRUD |
| Nuevo producto | `/admin/products/new` | Formulario de creación |
| Editar producto | `/admin/products/:id` | Formulario de edición |

---

## Licencia

Privado — todos los derechos reservados.
