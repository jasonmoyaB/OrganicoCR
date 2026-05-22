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
