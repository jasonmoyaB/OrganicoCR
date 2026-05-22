import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Spinner } from '@shared/components/Spinner'
import { StoreLayout } from '@store/layouts/StoreLayout'
import { AdminLayout } from '@admin/layouts/AdminLayout'

function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner size="lg" />
    </div>
  )
}

function wrap(Component: React.ElementType) {
  return (
    <Suspense fallback={<Loading />}>
      <Component />
    </Suspense>
  )
}

const HomePage = lazy(() => import('@store/pages/home/HomePage'))
const CatalogPage = lazy(() => import('@store/pages/catalog/CatalogPage'))
const ProductDetailPage = lazy(() => import('@store/pages/product-detail/ProductDetailPage'))
const CartPage = lazy(() => import('@store/pages/cart/CartPage'))
const SobreNosotrosPage = lazy(() => import('@store/pages/sobre-nosotros/SobreNosotrosPage'))
const ContactanosPage = lazy(() => import('@store/pages/contactanos/ContactanosPage'))
const LoginPage = lazy(() => import('@store/pages/login/LoginPage'))
const RegisterPage = lazy(() => import('@store/pages/register/RegisterPage'))
const DashboardPage = lazy(() => import('@admin/pages/dashboard/DashboardPage'))
const AdminProductsPage = lazy(() => import('@admin/pages/products/AdminProductsPage'))
const AdminProductFormPage = lazy(() => import('@admin/pages/products/AdminProductFormPage'))
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
      { path: 'sobre-nosotros', element: wrap(SobreNosotrosPage) },
      { path: 'contactanos', element: wrap(ContactanosPage) },
    ],
  },
  { path: '/login', element: wrap(LoginPage) },
  { path: '/register', element: wrap(RegisterPage) },
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
