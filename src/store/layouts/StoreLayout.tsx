import { Outlet, Link } from 'react-router-dom'
import { DynamicIslandNav } from '../components/DynamicIslandNav'
import { LeafIcon } from '@shared/components/icons/LeafIcon'

const FOOTER_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/catalog', label: 'Catalogo' },
  { to: '/sobre-nosotros', label: 'Sobre Nosotros' },
  { to: '/contactanos', label: 'Contactanos' },
  { to: '/cart', label: 'Carrito' },
]

export function StoreLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-cream">
      <DynamicIslandNav />

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-brand-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="footer-brand-icon">
                  <LeafIcon size={15} color="white" />
                </div>
                <span className="text-lg font-extrabold text-brand-cream">OrganicoCR</span>
              </div>
              <p className="text-gray-500 leading-7 text-base">
                Del campo costarricense a tu mesa. Productos organicos de la mas alta calidad, directo de productores locales.
              </p>
            </div>

            <div>
              <p className="font-bold text-brand-cream mb-5 text-base">Navegacion</p>
              <div className="flex flex-col gap-3.5">
                {FOOTER_LINKS.map(link => (
                  <Link key={link.to} to={link.to} className="footer-link">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="font-bold text-brand-cream mb-5 text-base">Contacto</p>
              <p className="text-gray-400 text-base leading-7">
                info@organicocr.com
                <br />
                Costa Rica
              </p>
            </div>

          </div>

          <div className="border-t border-[#202020] pt-8 text-center">
            <p className="text-gray-600 text-[0.9375rem]">
              &copy; 2026 OrganicoCR &mdash; Productos organicos de Costa Rica
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
