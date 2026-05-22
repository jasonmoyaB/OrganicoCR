import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { useCart } from '@domains/cart/hooks/useCart'

const COMPACT_W = 190
const EXPANDED_W = 684

const NAV_LINKS = [
  { to: '/sobre-nosotros', label: 'Sobre Nosotros' },
  { to: '/contactanos', label: 'Contactanos' },
  { to: '/catalog', label: 'Tienda' },
]

function CartSVGIcon() {
  return (
    <svg
      width="17"
      height="17"
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

export function DynamicIslandNav() {
  const [scrolled, setScrolled] = useState(false)
  const [hovered, setHovered] = useState(false)

  const navRef = useRef<HTMLElement>(null)
  const pillRef = useRef<HTMLDivElement>(null)
  const expandedRef = useRef<HTMLDivElement>(null)
  const firstRender = useRef(true)

  const { totalItems } = useCart()
  const { pathname } = useLocation()

  const isExpanded = !scrolled || hovered

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
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
  }, [isExpanded])

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
            {NAV_LINKS.map(link => {
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
