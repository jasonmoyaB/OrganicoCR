import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const PRODUCTS = [
  {
    id: 'frutas',
    label: 'Frutas',
    icon: '🍎',
    description: 'Cosechadas en su punto óptimo de madurez',
    details: 'Seleccionamos cada pieza con cuidado, garantizando dulzura, aroma y nutrientes máximos. Manzanas, piñas, naranjas, papayas y más, todas desde nuestras fincas locales.',
    image: 'https://www.donaguacato.com/mw/wp-content/uploads/2017/10/5-de-frutas-que-es-mejor-consumir-organicas.jpg',
  },
  {
    id: 'verduras',
    label: 'Verduras y Hortalizas',
    icon: '🥦',
    description: 'Libres de pesticidas químicos y llenas de sabor',
    details: 'Brócoli, espinaca, chayote, ayote, tomate, chile. Cada verdura es cultivada sin químicos sintéticos, manteniendo su sabor natural y su valor nutritivo completo.',
    image: 'https://media.scoolinary.app/blog/images/2021/02/hortalizas-portada.jpg',
  },
  {
    id: 'huevos',
    label: 'Huevos de Pastoreo',
    icon: '🥚',
    description: 'De gallinas felices, 100% naturales',
    details: 'Nuestras gallinas viven en pastizales abiertos, alimentadas con granos naturales. Los huevos tienen yemas doradas intensas y sabor superior que lo diferencia inmediatamente.',
    image: 'https://www.ucr.ac.cr/medios/fotos/2023/rs119785_dsc_0027-64109f76109c2.jpg',
  },
  {
    id: 'carnes',
    label: 'Carnes Orgánicas',
    icon: '🥩',
    description: 'Calidad premium con procesos sostenibles',
    details: 'Pollo, cerdo y res criados en condiciones naturales, alimentados con pasto y sin antibióticos. Sabor auténtico, textura superior y completamente libre de residuos químicos.',
    image: 'https://cloudfront-us-east-1.images.arcpublishing.com/infobae/IRS3F5CPXRE73KIM7PFYM6U5BM.jpg',
  },
]

const BENEFITS = [
  '100% Orgánico',
  'Directamente del Productor',
  'Sin Pesticidas',
  'Garantía de Frescura',
  'Apoyo a Productores Locales',
  'Sostenibilidad Garantizada',
]

export default function SobreNosotrosPage() {
  const pageRef = useRef<HTMLDivElement>(null)
  const productsRef = useRef<HTMLDivElement>(null)
  const heroImageRef = useRef<HTMLImageElement>(null)

  useGSAP(
    () => {
      if (heroImageRef.current) {
        gsap.from(heroImageRef.current, {
          x: 120,
          y: 60,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out',
        })
      }

      if (productsRef.current) {
        const cards = productsRef.current.querySelectorAll<HTMLElement>('.product-card')
        cards.forEach((card, i) => {
          gsap.from(card, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            delay: i * 0.15,
            ease: 'power3.out',
          })

          card.addEventListener('mouseenter', () => {
            gsap.to(card, {
              scale: 1.02,
              duration: 0.5,
              ease: 'power2.out',
              overwrite: 'auto',
            })
          })

          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              scale: 1,
              duration: 0.5,
              ease: 'power2.out',
              overwrite: 'auto',
            })
          })
        })
      }
    },
    { scope: pageRef }
  )

  return (
    <main ref={pageRef} className="overflow-x-hidden w-full max-w-full bg-brand-cream">
      {/* Hero Section - Artistic Asymmetry */}
      <section className="min-h-screen flex items-center justify-center px-6 py-20 lg:py-0 relative overflow-hidden">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div className="relative z-10">
            <h1 className="text-hero font-black text-brand-black tracking-[-0.04em] leading-[1.1] mb-6">
              Sabor Orgánico en Heredia
            </h1>
            <p className="text-body-lg text-brand-dark leading-relaxed mb-8 max-w-xl">
              Frutas, verduras y carnes 100% naturales, directamente desde la finca a tu mesa. Cada producto es cultivado con cuidado, sin químicos sintéticos, respetando la tierra y apoyando a productores locales costarricenses.
            </p>
            <a href="/catalog" className="inline-block bg-brand-lime text-brand-black font-bold px-8 py-3.5 rounded-lg hover:scale-105 transition-transform duration-300">
              Conoce Nuestros Productos
            </a>
          </div>

          {/* Right: Floating Image */}
          <div className="relative h-96 lg:h-[500px] hidden lg:flex items-end justify-end">
            <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl">
              <img
                ref={heroImageRef}
                src="public/FotoOrganico_n.jpg"
                alt="Finca orgánica en Heredia"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/40 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Products Section - Horizontal Accordions */}
      <section className="py-32 md:py-48 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-section font-black text-brand-black tracking-[-0.03em] mb-4">
              Nuestros Productos
            </h2>
            <p className="text-body-lg text-brand-dark max-w-2xl mx-auto">
              Cada categoría cultivada con dedicación y pasión por la sostenibilidad
            </p>
          </div>

          <div
            ref={productsRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {PRODUCTS.map(product => (
              <div
                key={product.id}
                className="product-card rounded-2xl border border-brand-black/10 bg-white flex flex-col h-[340px] transition-shadow duration-300 hover:shadow-lg overflow-hidden"
              >
                <div className="h-[140px] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.label}
                    className="w-full h-full object-cover contrast-110 saturate-90"
                  />
                </div>
                <div className="p-5 flex flex-col justify-between flex-1">
                  <h3 className="text-lg font-black text-brand-black leading-tight">
                    {product.label}
                  </h3>
                  <div className="mt-auto">
                    <p className="text-sm text-brand-dark leading-relaxed mb-2">
                      {product.description}
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed border-t border-brand-black/10 pt-2">
                      {product.details}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Infinite Marquee */}
      <section className="py-20 border-y border-brand-black/10">
        <div className="overflow-hidden">
          <div className="flex animate-scroll gap-8 whitespace-nowrap">
            {[...BENEFITS, ...BENEFITS].map((benefit, i) => (
              <div key={i} className="flex items-center gap-8 text-2xl font-bold text-brand-black">
                <span>{benefit}</span>
                <div className="w-2 h-2 rounded-full bg-brand-lime flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-50% - 1rem)); }
          }
          .animate-scroll {
            animation: scroll 40s linear infinite;
          }
          .animate-scroll:hover {
            animation-play-state: paused;
          }
        `}</style>
      </section>

      {/* Our Story Section */}
      <section className="py-32 md:py-48 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-section font-black text-brand-black tracking-[-0.03em] mb-12">
            Por Qué Elegir OrganicoCR
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="text-5xl font-black text-brand-lime mb-4">50+</div>
              <p className="text-xl font-bold text-brand-black mb-3">Productores Locales</p>
              <p className="text-brand-dark leading-relaxed">
                Trabajamos directamente con familias de agricultores en Heredia, garantizando trazabilidad y soporte directo.
              </p>
            </div>

            <div>
              <div className="text-5xl font-black text-brand-lime mb-4">5000+</div>
              <p className="text-xl font-bold text-brand-black mb-3">Familias Servidas</p>
              <p className="text-brand-dark leading-relaxed">
                Cada semana, miles de hogares costarricenses disfrutan de nuestros productos orgánicos de calidad premium.
              </p>
            </div>

            <div>
              <div className="text-5xl font-black text-brand-lime mb-4">2019</div>
              <p className="text-xl font-bold text-brand-black mb-3">Desde Nuestros Inicios</p>
              <p className="text-brand-dark leading-relaxed">
                Más de 5 años conectando productores sostenibles con familias que valoran autenticidad y frescura.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-brand-black text-brand-cream px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-cta-h2 font-black leading-tight mb-6">
            Vive el Sabor Auténtico
          </h2>
          <p className="text-body-lg mb-10 max-w-xl mx-auto text-brand-cream/80">
            Cada compra es un apoyo directo a productores locales y a la sostenibilidad de Costa Rica.
          </p>
          <a
            href="/catalog"
            className="inline-block bg-brand-lime text-brand-black font-black px-10 py-4 rounded-lg text-lg hover:scale-105 transition-transform duration-300 shadow-lg"
          >
            Comprar Ahora
          </a>
        </div>
      </section>
    </main>
  )
}
