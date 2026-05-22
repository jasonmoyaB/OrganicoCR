import { useRef, useEffect } from 'react'
import gsap from 'gsap'

interface PasswordToggleProps {
  isPassword: boolean
  onToggle: () => void
}

export function PasswordToggle({ isPassword, onToggle }: PasswordToggleProps) {
  const eyeRef = useRef<HTMLButtonElement>(null)
  const irisRef = useRef<SVGGElement>(null)

  // Animated blink effect when toggling visibility
  const handleToggle = () => {
    gsap.to(irisRef.current, {
      scaleY: 0,
      duration: 0.15,
      ease: 'power2.in',
      onComplete: () => {
        onToggle()
        gsap.to(irisRef.current, {
          scaleY: 1,
          duration: 0.15,
          ease: 'power2.out',
        })
      },
    })
  }

  // Iris movement following cursor (optional subtle interaction)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!eyeRef.current || !irisRef.current) return

      const rect = eyeRef.current.getBoundingClientRect()
      const eyeCenterX = rect.left + rect.width / 2
      const eyeCenterY = rect.top + rect.height / 2

      const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX)
      const distance = 6 // Max movement in pixels

      const irisX = Math.cos(angle) * distance
      const irisY = Math.sin(angle) * distance

      gsap.to(irisRef.current, {
        x: irisX,
        y: irisY,
        duration: 0.3,
        overwrite: 'auto',
      })
    }

    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <button
      ref={eyeRef}
      type="button"
      onClick={handleToggle}
      className="password-toggle"
      aria-label={isPassword ? 'Show password' : 'Hide password'}
      title={isPassword ? 'Mostrar' : 'Ocultar'}
    >
      {/* Eyeball container */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="password-toggle__eye"
      >
        {/* Outer eye circle (sclera) */}
        <circle cx="12" cy="12" r="10" fill="white" stroke="currentColor" strokeWidth="1.5" />

        {/* Iris with reflex */}
        <g ref={irisRef} className="password-toggle__iris">
          <circle
            cx="12"
            cy="12"
            r="6"
            fill="url(#irisGradient)"
            filter="url(#irisFilter)"
          />
          {/* Iris border for definition */}
          <circle
            cx="12"
            cy="12"
            r="6"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.3"
          />
          {/* Light reflex (gloss) */}
          <circle cx="10.5" cy="10" r="2.5" fill="white" opacity="0.7" filter="url(#glossFilter)" />
        </g>

        {/* SVG filters for depth */}
        <defs>
          {/* Iris gradient for depth */}
          <radialGradient id="irisGradient" cx="35%" cy="35%">
            <stop offset="0%" stopColor="#1B5C4C" />
            <stop offset="60%" stopColor="#0D3B31" />
            <stop offset="100%" stopColor="#001810" />
          </radialGradient>

          {/* Subtle shadow on iris */}
          <filter id="irisFilter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" />
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.3" />
          </filter>

          {/* Glow on light reflex */}
          <filter id="glossFilter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.3" />
          </filter>
        </defs>
      </svg>

      <style>{`
        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #003023;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 10;
        }

        .password-toggle:hover {
          color: #83C441;
          transform: translateY(-50%) scale(1.1);
        }

        .password-toggle:active {
          transform: translateY(-50%) scale(0.95);
        }

        .password-toggle__eye {
          display: block;
        }

        .password-toggle__iris {
          transform-origin: 12px 12px;
          transform-box: fill-box;
        }
      `}</style>
    </button>
  )
}
