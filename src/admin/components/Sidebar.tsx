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
