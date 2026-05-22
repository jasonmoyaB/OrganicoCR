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
