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
