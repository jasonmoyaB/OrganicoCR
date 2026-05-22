import { createBrowserRouter, RouterProvider, isRouteErrorResponse, useRouteError, Link } from 'react-router-dom'
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

function RouteErrorFallback() {
  const error = useRouteError()
  const is404 = isRouteErrorResponse(error) && error.status === 404
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-white px-4">
      <h1 className="text-2xl font-bold text-stone-800">{is404 ? 'Pagina no encontrada' : 'Algo salio mal'}</h1>
      <p className="text-sm text-stone-500">
        {is404 ? 'La pagina que buscas no existe.' : 'Ocurrio un error inesperado en esta pagina.'}
      </p>
      <Link to="/" className="mt-2 rounded-lg bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors">
        Volver al inicio
      </Link>
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
    errorElement: <RouteErrorFallback />,
    children: [
      { index: true, element: wrap(HomePage) },
      { path: 'catalog', element: wrap(CatalogPage) },
      { path: 'catalog/:id', element: wrap(ProductDetailPage) },
      { path: 'cart', element: wrap(CartPage) },
      { path: 'sobre-nosotros', element: wrap(SobreNosotrosPage) },
      { path: 'contactanos', element: wrap(ContactanosPage) },
    ],
  },
  { path: '/login', element: wrap(LoginPage), errorElement: <RouteErrorFallback /> },
  { path: '/register', element: wrap(RegisterPage), errorElement: <RouteErrorFallback /> },
  {
    path: '/admin',
    element: <AdminLayout />,
    errorElement: <RouteErrorFallback />,
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
