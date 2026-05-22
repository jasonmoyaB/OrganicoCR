import { useState, useRef, useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { useCart } from '@domains/cart/hooks/useCart'

const COMPACT_W = 190
const EXPANDED_W = 684

const DESKTOP_LINKS = [
  { to: '/sobre-nosotros', label: 'Sobre Nosotros' },
  { to: '/contactanos', label: 'Contactanos' },
  { to: '/catalog', label: 'Tienda' },
]

const MOBILE_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/catalog', label: 'Tienda' },
  { to: '/sobre-nosotros', label: 'Nosotros' },
  { to: '/contactanos', label: 'Contacto' },
]

function CartSVGIcon({ size = 17 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  )
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [query])
  return matches
}

export function DynamicIslandNav() {
  const [scrolled, setScrolled] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const isMobile = useMediaQuery('(max-width: 767px)')

  const navRef = useRef<HTMLElement>(null)
  const pillRef = useRef<HTMLDivElement>(null)
  const expandedRef = useRef<HTMLDivElement>(null)
  const firstRender = useRef(true)

  const overlayRef = useRef<HTMLDivElement>(null)
  const menuItemsRef = useRef<HTMLDivElement>(null)

  const { totalItems } = useCart()
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isExpanded = !scrolled || hovered

  useEffect(() => {
    if (isMobile) return

    const pill = pillRef.current
    const content = expandedRef.current
    const nav = navRef.current
    if (!pill || !content || !nav) return

    const items = Array.from(nav.querySelectorAll<HTMLElement>('.island-nav-item'))

    if (firstRender.current) {
      firstRender.current = false
      if (isExpanded) {
        gsap.set(pill, { width: EXPANDED_W })
        gsap.set(content, { opacity: 1, pointerEvents: 'auto' })
        gsap.set(items, { opacity: 1, y: 0 })
      } else {
        gsap.set(pill, { width: COMPACT_W })
        gsap.set(content, { opacity: 0, pointerEvents: 'none' })
        gsap.set(items, { opacity: 0 })
      }
      return
    }

    if (isExpanded) {
      gsap.to(pill, { width: EXPANDED_W, duration: 0.55, ease: 'back.out(1.3)', overwrite: 'auto' })
      gsap.to(content, { opacity: 1, pointerEvents: 'auto', duration: 0.25, delay: 0.22, overwrite: 'auto' })
      gsap.fromTo(
        items,
        { opacity: 0, y: -5 },
        { opacity: 1, y: 0, stagger: 0.055, delay: 0.27, duration: 0.28, ease: 'power2.out', overwrite: 'auto' }
      )
    } else {
      gsap.to(items, { opacity: 0, duration: 0.15, overwrite: 'auto' })
      gsap.to(content, { opacity: 0, pointerEvents: 'none', duration: 0.2, overwrite: 'auto' })
      gsap.to(pill, { width: COMPACT_W, duration: 0.45, ease: 'power3.inOut', delay: 0.1, overwrite: 'auto' })
    }
  }, [isExpanded, isMobile])

  const animateMenu = useCallback((open: boolean) => {
    const overlay = overlayRef.current
    const container = menuItemsRef.current
    if (!overlay || !container) return

    const items = Array.from(container.children) as HTMLElement[]

    if (open) {
      gsap.set(overlay, { display: 'flex' })
      gsap.fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: 'power2.out' })
      gsap.fromTo(
        items,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, stagger: 0.05, duration: 0.45, ease: 'power3.out', delay: 0.08 }
      )
    } else {
      gsap.to(items, {
        autoAlpha: 0, y: 12, duration: 0.15, ease: 'power2.in', stagger: 0.025,
        onComplete: () => {
          gsap.to(overlay, {
            autoAlpha: 0, duration: 0.2, ease: 'power2.in',
            onComplete: () => gsap.set(overlay, { display: 'none' }),
          })
        },
      })
    }
  }, [])

  useEffect(() => {
    if (!isMobile) {
      gsap.set(overlayRef.current, { display: 'none', autoAlpha: 0 })
      return
    }
    animateMenu(menuOpen)
  }, [menuOpen, isMobile, animateMenu])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const isActive = (to: string) => {
    if (to === '/') return pathname === '/'
    return pathname === to || pathname.startsWith(to)
  }

  if (isMobile) {
    return (
      <>
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 h-16 bg-[rgba(246,254,249,0.92)] backdrop-blur-xl border-b border-[rgba(0,0,0,0.05)]">
          <Link to="/" aria-label="OrganicoCR — Inicio" className="flex items-center">
            <img
              src="/logo/Organico.webp"
              alt="OrganicoCR"
              className="h-6 w-auto object-contain"
            />
          </Link>

          <div className="flex items-center gap-1">
            <Link
              to="/cart"
              className="relative p-2.5 text-stone-600 hover:text-brand-dark transition-colors"
              aria-label={`Carrito${totalItems > 0 ? `, ${totalItems} producto${totalItems !== 1 ? 's' : ''}` : ''}`}
            >
              <CartSVGIcon size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-lime text-[0.55rem] font-extrabold text-brand-black rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-[2px]">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMenuOpen(prev => !prev)}
              className="relative z-50 w-11 h-11 flex items-center justify-center rounded-xl text-stone-600 hover:text-brand-dark transition-colors"
              aria-label={menuOpen ? 'Cerrar menu' : 'Abrir menu'}
              aria-expanded={menuOpen}
            >
              <div className="w-5 h-3.5 relative flex flex-col justify-between">
                <span className={`block h-[1.5px] w-full bg-current rounded-full origin-center transition-all duration-300 ease-out ${menuOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
                <span className={`block h-[1.5px] w-full bg-current rounded-full transition-all duration-300 ease-out ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
                <span className={`block h-[1.5px] w-full bg-current rounded-full origin-center transition-all duration-300 ease-out ${menuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
              </div>
            </button>
          </div>
        </nav>

        <div
          ref={overlayRef}
          className="fixed inset-0 z-40 hidden flex-col bg-[rgba(246,254,249,0.97)] backdrop-blur-2xl"
        >
          <div className="flex-1 flex flex-col justify-center px-10 pb-16">
            <div ref={menuItemsRef} className="flex flex-col gap-2">
              {MOBILE_LINKS.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative text-4xl font-bold py-3 px-4 transition-colors duration-200 ${
                    isActive(link.to)
                      ? 'text-brand-green'
                      : 'text-stone-600 hover:text-brand-dark'
                  }`}
                >
                  {isActive(link.to) && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand-lime rounded-full" />
                  )}
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="px-10 pb-14 border-t border-[rgba(0,0,0,0.07)] pt-6">
            <Link
              to="/login"
              className="block w-full text-center bg-brand-green text-white font-semibold py-4 text-base tracking-wide rounded-2xl hover:bg-opacity-90 active:scale-[0.98] transition-all duration-200 shadow-sm"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <nav ref={navRef} aria-label="Navegacion principal" className="island-nav">
      <div
        ref={pillRef}
        className="island-pill"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setHovered(true)}
        onBlurCapture={e => {
          if (!pillRef.current?.contains(e.relatedTarget as Node)) setHovered(false)
        }}
      >
        <Link to="/" aria-label="OrganicoCR — Inicio" className="island-logo-link">
          <div className="island-logo-wrap">
            <img
              src="/logo/Organico.webp"
              alt="OrganicoCR"
              className="h-7 w-auto max-w-[110px] object-contain"
            />
            {totalItems > 0 && <span aria-hidden="true" className="island-activity-dot" />}
          </div>
        </Link>

        <div ref={expandedRef} className="island-expanded">
          <div aria-hidden="true" className="island-divider" />

          <div className="island-links">
            {DESKTOP_LINKS.map(link => {
              const isActive =
                pathname === link.to ||
                (link.to === '/catalog' && pathname.startsWith('/catalog'))
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`island-link island-nav-item${isActive ? ' island-link--active' : ''}`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          <div className="island-actions">
            <Link
              to="/cart"
              className="island-cart-btn island-nav-item"
              aria-label={`Carrito, ${totalItems} producto${totalItems !== 1 ? 's' : ''}`}
            >
              <CartSVGIcon />
              {totalItems > 0 && (
                <span aria-hidden="true" className="island-badge">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            <Link to="/login" className="island-login-btn island-nav-item">
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
