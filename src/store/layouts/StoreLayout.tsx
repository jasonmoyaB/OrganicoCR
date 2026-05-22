import { Outlet, Link } from 'react-router-dom'
import { DynamicIslandNav } from '../components/DynamicIslandNav'
import { WhatsAppWidget } from '../components/WhatsAppWidget'

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
      <WhatsAppWidget />

      <main className="flex-1 pt-16 md:pt-0">
        <Outlet />
      </main>

      <footer className="bg-brand-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <img src="/logo/Manzana.webp" alt="OrganicoCR logo" className="w-8 h-8 object-contain" />
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
              <p className="font-bold text-brand-cream mb-5 text-base">¿Dónde estamos?</p>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#83C441" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <p className="text-gray-400 text-[0.9375rem] leading-6">
                    Corazón de Heredia,<br />Costa Rica
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#83C441" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.82 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.21-1.21a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.82 16Z"/>
                    </svg>
                  </div>
                  <p className="text-gray-400 text-[0.9375rem]">
                    <span className="text-gray-300 font-medium">WhatsApp:</span> 8713 8944
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#83C441" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </div>
                  <p className="text-gray-400 text-[0.9375rem] leading-6">
                    Lun–Sáb<br />
                    <span className="text-gray-300 font-medium">8:00 AM – 6:00 PM</span>
                  </p>
                </div>
              </div>
            </div>

          </div>

          <div className="border-t border-[#1a1a1a] pt-8 text-center">
            <p className="text-gray-600 text-[0.9375rem]">
              &copy; 2026 OrganicoCR &mdash; Productos organicos de Costa Rica
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
