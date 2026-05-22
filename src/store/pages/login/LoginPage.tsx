import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { PasswordToggle } from '@store/components/PasswordToggle'
import { supabase } from '@/utils/supabase'

function ChevronLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

gsap.registerPlugin(useGSAP)

const TRUST = [
  '100% Organico', 'Entrega Segura', 'Productores Locales',
  'Pago Protegido', 'Cosechado Hoy', 'Costa Rica',
]

export default function LoginPage() {
  const pageRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useGSAP(() => {
    gsap.from('.auth-left-img', {
      scale: 1.08,
      duration: 1.6,
      ease: 'power2.out',
    })
    gsap.from('.auth-quote', {
      opacity: 0,
      y: 28,
      duration: 0.9,
      delay: 0.3,
      ease: 'power3.out',
    })
    gsap.from('.login-field', {
      x: 28,
      opacity: 0,
      stagger: 0.09,
      duration: 0.6,
      delay: 0.45,
      ease: 'power3.out',
    })
  }, { scope: pageRef })

  return (
    <div ref={pageRef} className="auth-split">
      <Link to="/" aria-label="Volver al inicio" className="back-home-btn">
        <ChevronLeft />
        Inicio
      </Link>

      {/* LEFT — cinematic editorial panel */}
      <div className="auth-left">
        <img
          src="public/FotoLogin-register/fotoLogin.jpg"
          alt=""
          aria-hidden="true"
          className="auth-left-img"
        />
        <div className="auth-left-overlay" />

        {/* Quote — centered in remaining space above marquee */}
        <div className="flex-1 flex items-center relative z-10">
          <div className="auth-quote">
            <p
              className="font-black leading-[0.95] tracking-[-0.04em] text-brand-cream"
              style={{ fontSize: 'clamp(2.75rem, 4vw, 4.5rem)' }}
            >
              Del campo
              <br />
              <span className="text-brand-lime">a tu</span> mesa.
            </p>
            <p className="mt-5 text-[1.0625rem] text-white/55 leading-relaxed max-w-xs">
              Productores costarricenses. Frescura garantizada. Directo a tu hogar.
            </p>
          </div>
        </div>

        {/* Trust marquee — pinned at bottom */}
        <div className="relative z-10 overflow-hidden -mx-12">
          <div className="auth-marquee-track">
            {[...TRUST, ...TRUST, ...TRUST].map((item, i) => (
              <span key={i} className="auth-marquee-item">
                {item}
                <span aria-hidden="true" className="auth-marquee-dot" />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — clean form */}
      <div className="auth-right">
        <div className="auth-form-wrap">

          <div className="login-field mb-10">
            <h1 className="text-[2.125rem] font-black text-brand-black tracking-[-0.03em] leading-tight mb-2">
              Bienvenido de vuelta
            </h1>
            <p className="text-[0.9375rem] text-gray-500">
              Ingresa a tu cuenta para continuar
            </p>
          </div>

          <form
            onSubmit={async e => {
              e.preventDefault()
              setError('')
              setSubmitting(true)
              const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
              setSubmitting(false)
              if (authError) { setError(authError.message); return }
              navigate('/')
            }}
            className="flex flex-col gap-4"
          >
            <div className="login-field">
              <label htmlFor="login-email" className="form-label form-label--light">
                Correo electronico
              </label>
              <input
                id="login-email"
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="form-input form-input--light"
              />
            </div>

            <div className="login-field">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="login-password" className="form-label form-label--light" style={{ marginBottom: 0 }}>
                  Contrasena
                </label>
                <button
                  type="button"
                  className="text-[0.8125rem] text-brand-green font-medium transition-opacity hover:opacity-60"
                >
                  Olvide mi contrasena
                </button>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="form-input form-input--light pr-12"
                />
                <PasswordToggle
                  isPassword={!showPassword}
                  onToggle={() => setShowPassword(!showPassword)}
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500" role="alert">{error}</p>
            )}

            <div className="login-field mt-1">
              <button type="submit" disabled={submitting} className="btn-auth-submit disabled:opacity-50">
                {submitting ? 'Ingresando...' : 'Ingresar'}
              </button>
            </div>

            <div className="login-field flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-[0.8125rem] text-gray-400 font-medium">o</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="login-field text-center">
              <p className="text-[0.9375rem] text-gray-500">
                No tienes cuenta?{' '}
                <Link
                  to="/register"
                  className="text-brand-green font-semibold hover:text-brand-lime transition-colors"
                >
                  Crear una cuenta
                </Link>
              </p>
            </div>
          </form>

        </div>
      </div>
    </div>
  )
}
