import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { WHATSAPP_NUMBER } from '@shared/config/env'

const QUICK_ACTIONS = [
  { label: 'Quiero hacer un pedido', message: 'Hola! Quiero hacer un pedido de productos organicos.' },
  { label: 'Consultar precios', message: 'Hola! Me gustaria consultar los precios de sus productos.' },
  { label: 'Horarios y entregas', message: 'Hola! Quisiera saber sobre los horarios y entregas.' },
  { label: 'Otro consulta', message: 'Hola! Tengo una consulta.' },
]

export function WhatsAppWidget() {
  const [open, setOpen] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      gsap.fromTo(modalRef.current,
        { scale: 0.85, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)' }
      )
      gsap.fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      )
    }
  }, [open])

  const openWhatsApp = (message?: string) => {
    const text = message
      ? encodeURIComponent(message)
      : encodeURIComponent('Hola! Estoy interesado en sus productos.')
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank', 'noopener,noreferrer')
    setOpen(false)
  }

  return (
    <>
      {open && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {open && (
          <div
            ref={modalRef}
            className="w-[340px] origin-bottom-right overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/15"
          >
            <div className="flex items-center justify-between bg-[#25D366] px-4 py-3.5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[0.8125rem] font-semibold leading-tight text-white">OrganicoCR</p>
                  <p className="text-[0.6875rem] leading-tight text-white/75">Normalmente responde en 1 hora</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-white/15"
                aria-label="Cerrar chat"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="bg-gray-50 px-4 py-5">
              <div className="rounded-xl bg-white px-3.5 py-3 shadow-sm">
                <p className="text-[0.8125rem] leading-relaxed text-gray-700">
                  Hola! Bienvenido a OrganicoCR
                </p>
                <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-gray-700">
                  En que puedo ayudarte?
                </p>
              </div>
              <div className="mt-1 ml-1">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="white" aria-hidden="true">
                  <path d="M0 10 Q 0 0 10 0 Q 5 3 3 8 Z" />
                </svg>
              </div>

              <div className="mt-4 flex flex-col gap-1.5">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => openWhatsApp(action.message)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-left text-[0.8125rem] font-medium text-gray-700 transition-all duration-200 hover:border-[#25D366]/30 hover:bg-[#25D366]/5 hover:text-gray-900"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center border-t border-gray-100 bg-white px-4 py-2.5">
              <span className="text-[0.625rem] text-gray-400">
                Normalmente responde en 1 hora
              </span>
            </div>
          </div>
        )}

        <button
          onClick={() => setOpen(!open)}
          aria-label="Chatear por WhatsApp"
          className="flex items-center justify-center rounded-full bg-[#25D366] p-3.5 text-white shadow-lg shadow-[#25D366]/30 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-[#25D366]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-brand-cream"
        >
          {open ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          )}
        </button>
      </div>
    </>
  )
}
