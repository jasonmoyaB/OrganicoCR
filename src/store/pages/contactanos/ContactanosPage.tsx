import { useRef, useEffect } from 'react'
import gsap from 'gsap'

const FIELDS = [
  { id: 'nombre', label: 'Nombre completo', type: 'text', placeholder: 'Tu nombre' },
  { id: 'telefono', label: 'Numero de telefono', type: 'tel', placeholder: '8888-8888' },
]

const CONTACT_INFO = [
  { icon: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z', hasSub: true, label: 'Ubicacion', value: 'Heredia, Costa Rica' },
  { icon: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.82 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.21-1.21a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.82 16Z', hasSub: false, label: 'WhatsApp', value: '8713 8944' },
  { icon: 'M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2Z', hasSub: false, label: 'Email', value: 'info@organicocr.com' },
]

export default function ContactanosPage() {
  const formRef = useRef<HTMLDivElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
      )
      if (infoRef.current) {
        gsap.fromTo(Array.from(infoRef.current.children),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out', delay: 0.2 }
        )
      }
      gsap.fromTo(formRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.35 }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-brand-cream">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-[300px] -right-[200px] h-[700px] w-[700px] rounded-full bg-brand-lime/[0.04] blur-[100px]" />
        <div className="absolute -bottom-[200px] -left-[200px] h-[500px] w-[500px] rounded-full bg-brand-green/[0.06] blur-[80px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 pb-32 pt-28 lg:px-16">
        <div className="text-center" ref={headingRef}>
          <p className="mb-3 text-[0.8125rem] font-semibold uppercase tracking-[0.15em] text-brand-lime">
            Contacto
          </p>
          <h1 className="text-page-h1 font-black leading-[1.05] tracking-[-0.03em] text-brand-black">
            Hablemos
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-[1.0625rem] leading-relaxed text-brand-dark/70">
            Estamos aqui para ayudarte. Respondemos en menos de 24 horas.
          </p>
        </div>

        <div className="mx-auto mt-20 grid max-w-5xl grid-cols-1 gap-14 lg:grid-cols-5">
          <div ref={infoRef} className="flex flex-col gap-8 lg:col-span-2">
            {CONTACT_INFO.map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-lime/10">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#83C441" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={item.icon} />
                    {item.hasSub && <circle cx="12" cy="10" r="3" />}
                  </svg>
                </div>
                <div>
                  <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-brand-dark/40">
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-[1.0625rem] font-medium text-brand-black">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div ref={formRef} className="lg:col-span-3">
            <form onSubmit={e => e.preventDefault()} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {FIELDS.map(field => (
                  <div key={field.id}>
                    <label htmlFor={field.id} className="form-label form-label--light">
                      {field.label}
                    </label>
                    <input
                      id={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      className="form-input form-input--light"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label htmlFor="mensaje" className="form-label form-label--light">
                  Mensaje
                </label>
                <textarea
                  id="mensaje"
                  rows={5}
                  placeholder="Cuentanos en que podemos ayudarte..."
                  className="form-input form-input--light resize-none"
                />
              </div>

              <button type="submit" className="btn-form-submit mt-2 w-full sm:w-auto">
                Enviar Mensaje
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
