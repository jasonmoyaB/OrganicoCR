import { useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useProducts } from "@domains/catalog/hooks/useProducts";
import { ProductCard } from "@store/components/ProductCard";
import { Spinner } from "@shared/components/Spinner";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const MARQUEE_ITEMS = [
  "100% Organico",
  "Productores Locales",
  "Sin Pesticidas",
  "Entrega a Domicilio",
  "Cosechado Hoy",
  "Comercio Justo",
  "Costa Rica",
  "Sostenible",
];

const PROMISES = [
  {
    title: "Frescura Garantizada",
    body: "Ciclos cortos de distribucion. Ningun producto tiene mas de 48 horas de cosechado cuando llega a tu puerta.",
  },
  {
    title: "Sin Intermediarios",
    body: "Directamente del agricultor a tu mesa. Precios justos para los productores y mas economico para tu familia.",
  },
  {
    title: "Impacto Real",
    body: "Cada compra protege los suelos y acuiferos de Costa Rica y apoya a familias agricultoras locales.",
  },
];

const TESTIMONIALS = [
  {
    name: "Maria Gonzalez",
    location: "San Jose",
    quote:
      "Los vegetales llegan increiblemente frescos. Nunca volvere a comprar en el supermercado.",
  },
  {
    name: "Carlos Mora",
    location: "Heredia",
    quote:
      "Servicio excelente y rapido. Los precios son muy justos para la calidad que se recibe.",
  },
  {
    name: "Ana Rodriguez",
    location: "Alajuela",
    quote:
      "Me encanta saber que estoy apoyando a productores locales con cada compra que hago.",
  },
];

const STATS = [
  { value: "200+", label: "Productos" },
  { value: "50+", label: "Productores" },
  { value: "24h", label: "Entrega" },
];

function StarIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="#83C441"
      stroke="none"
      aria-hidden="true"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export default function HomePage() {
  const { data: products, isPending } = useProducts();
  const featured = products?.filter((p) => p.isFeatured) ?? [];

  const productsRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (productsRef.current) {
        const cards = productsRef.current.querySelectorAll<HTMLElement>(
          ".product-scale-card",
        );
        cards.forEach((card) => {
          gsap.fromTo(
            card,
            { scale: 0.88, opacity: 0.5 },
            {
              scale: 1,
              opacity: 1,
              scrollTrigger: {
                trigger: card,
                start: "top 88%",
                end: "top 50%",
                scrub: 1,
              },
            },
          );
        });
      }

      if (testimonialsRef.current) {
        const cards =
          testimonialsRef.current.querySelectorAll<HTMLElement>(".stack-card");
        gsap.fromTo(
          cards,
          { y: 64, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.12,
            scrollTrigger: {
              trigger: testimonialsRef.current,
              start: "top 78%",
              end: "bottom 55%",
              scrub: 0.8,
            },
          },
        );
      }
    },
    { dependencies: [isPending] },
  );

  return (
    <main className="overflow-x-hidden w-full max-w-full">
      {/* HERO */}
      <section className="hero-section">
        <img
          src="https://picsum.photos/seed/vegetables-fresh-market/1920/1080"
          alt=""
          aria-hidden="true"
          className="hero-bg-img"
        />
        <div className="hero-overlay" />

        <div className="hero-content">
          <h1 className="hero-title text-hero">
            Del campo
            <br />
            <span className="text-brand-lime">a tu</span> mesa.
          </h1>

          <p className="hero-subtitle text-body-lg">
            Frutas, verduras y carnes 100% naturales, directamente desde la
            finca.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/catalog" className="btn-hero-primary">
              Ver Productos
            </Link>
            <a
              href="https://wa.me/50687138944"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hero-outline inline-flex items-center gap-2"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                style={{ flexShrink: 0 }}
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Pedir por WhatsApp
            </a>
          </div>

          <div className="hero-stats">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="hero-stat-value">{stat.value}</div>
                <div className="hero-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-strip">
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map(
            (item, i) => (
              <span key={i} className="marquee-item">
                {item}
                <span aria-hidden="true" className="marquee-dot" />
              </span>
            ),
          )}
        </div>
      </div>

      {/* BENTO GRID */}
      <section className="bg-brand-cream py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <h2 className="bento-heading text-bento">Cultivado en Costa Rica</h2>

          <div
            className="grid grid-cols-12 grid-flow-dense gap-4"
            style={{ gridAutoRows: "280px" }}
          >
            {/* Card A — tall left */}
            <div className="col-span-12 lg:col-span-6 row-span-2 rounded-3xl overflow-hidden relative bento-card">
              <img
                src="https://cloudfront-eu-central-1.images.arcpublishing.com/prisa/MONEL77JFRHBJG2HDRMSJUNDXU.jpg"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-brand-black/20 to-transparent" />
              <div className="bento-card-body">
                <p className="text-[2rem] font-extrabold text-brand-cream mb-2.5">
                  100% Organico
                </p>
                <p className="text-[1.0625rem] text-brand-cream/80 leading-[1.65]">
                  Certificado sin pesticidas ni quimicos artificiales. Naturales
                  desde la semilla.
                </p>
              </div>
            </div>

            {/* Card B — top right */}
            <div className="col-span-12 lg:col-span-6 rounded-3xl overflow-hidden relative flex flex-col justify-between bento-card">
              <img
                src="https://comunitaria.com/wp-content/uploads/2024/04/Imagenes-para-articulos-1-1-1.png"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/70 via-brand-black/10 to-transparent" />
              <div className="relative z-10 py-10 px-11 flex flex-col justify-between h-full">
                <div />
                <div>
                  <p className="text-[1.875rem] font-extrabold text-brand-cream mb-2.5">
                    Productores Locales
                  </p>
                  <p className="text-[1.0625rem] text-brand-cream/70 leading-[1.65]">
                    Apoya directamente a mas de 50 familias agricultoras
                    costarricenses con cada compra.
                  </p>
                </div>
              </div>
            </div>

            {/* Card C — bottom right */}
            <div className="col-span-12 lg:col-span-6 rounded-3xl overflow-hidden relative flex flex-col justify-between bento-card">
              <img
                src="https://peruretail.sfo3.cdn.digitaloceanspaces.com/wp-content/uploads/delivery-moto7.jpg"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/70 via-brand-black/10 to-transparent" />
              <div className="relative z-10 py-10 px-11 flex flex-col justify-between h-full">
                <div />
                <div>
                  <p className="text-[1.875rem] font-extrabold text-brand-cream mb-2.5">
                    Entrega en 24h
                  </p>
                  <p className="text-[1.0625rem] text-brand-cream/70 leading-[1.65]">
                    Recibe tus productos frescos en casa. Rapido, seguro, y a
                    tiempo garantizado.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section ref={productsRef} className="bg-brand-cream py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="flex items-end justify-between mb-14">
            <h2 className="text-title font-extrabold text-brand-black tracking-[-0.025em]">
              Productos Destacados
            </h2>
            <Link to="/catalog" className="view-all-link">
              Ver todos
            </Link>
          </div>

          {isPending ? (
            <div className="flex justify-center py-16">
              <Spinner />
            </div>
          ) : featured.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-brand-dark mb-5">
                No hay productos destacados en este momento.
              </p>
              <Link to="/catalog" className="view-all-link">
                Ver todos los productos
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((p) => (
                <div key={p.id} className="product-scale-card">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* NUESTRA PROMESA */}
      <section className="bg-brand-black py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <div className="lg:sticky lg:top-28 self-start">
              <h2 className="text-display font-black leading-[1.05] tracking-[-0.03em] text-brand-cream mb-6">
                Nuestra
                <br />
                <span className="text-brand-lime">promesa</span>
              </h2>
              <p className="text-[1.1875rem] text-gray-500 leading-7 max-w-sm">
                Calidad, frescura y sostenibilidad en cada compra que realizas
                con nosotros.
              </p>
            </div>

            <div className="flex flex-col">
              {PROMISES.map((item, i) => (
                <div key={i} className="promise-row group">
                  <span className="promise-row-num">0{i + 1}</span>
                  <div>
                    <h3 className="text-xl font-bold text-brand-cream mb-2.5 group-hover:text-brand-lime transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-[1.0625rem] leading-[1.75] text-gray-500">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-brand-cream py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <h2 className="text-section font-black tracking-[-0.025em] text-brand-black text-center mb-16">
            Lo que dicen nuestros clientes
          </h2>

          <div
            ref={testimonialsRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="stack-card"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-4px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <StarIcon key={s} />
                  ))}
                </div>
                <p className="text-[1.125rem] text-brand-cream leading-7 mb-8">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="font-bold text-brand-lime text-base">
                    {t.name}
                  </p>
                  <p className="text-gray-400 text-[0.9375rem] mt-1">
                    {t.location}, Costa Rica
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-green py-40">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-cta-h2 font-black leading-none tracking-[-0.035em] text-brand-cream mb-6">
            Empieza hoy
          </h2>
          <p className="text-body-lg text-[#86efac] leading-[1.65] max-w-lg mx-auto mb-14">
            Mas de 200 productos organicos listos para ti. Entrega a domicilio
            en todo Costa Rica.
          </p>
          <Link to="/catalog" className="btn-cta text-body-lg">
            Ver Catalogo Completo
          </Link>
        </div>
      </section>
    </main>
  );
}
