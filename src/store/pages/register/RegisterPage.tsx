import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { LeafIcon } from '@shared/components/icons/LeafIcon'
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

export default function RegisterPage() {
  const pageRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useGSAP(() => {
    gsap.from('.register-card', {
      scale: 0.96,
      opacity: 0,
      duration: 0.75,
      ease: 'power3.out',
    })
    gsap.from('.register-field', {
      y: 22,
      opacity: 0,
      stagger: 0.07,
      duration: 0.55,
      delay: 0.35,
      ease: 'power3.out',
    })
  }, { scope: pageRef })

  return (
    <div ref={pageRef} className="register-page">
      <Link to="/" aria-label="Volver al inicio" className="back-home-btn">
        <ChevronLeft />
        Inicio
      </Link>

      {/* Ambient glows */}
      <div aria-hidden="true" className="register-ambient register-ambient--tl" />
      <div aria-hidden="true" className="register-ambient register-ambient--br" />

      {/* Faint texture */}
      <img
        src="https://yotzsagyxelwfftcatxo.supabase.co/storage/v1/object/public/imagenes/fotoRegister.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ opacity: 0.04, filter: 'saturate(0.3) contrast(1.2)' }}
      />

      <div className="register-card">

        {/* Header */}
        <div className="register-field flex items-center gap-3 mb-8">
          <div className="w-11 h-11 bg-brand-green rounded-[0.875rem] flex items-center justify-center flex-shrink-0">
            <LeafIcon size={20} color="white" />
          </div>
          <div>
            <h1 className="text-[1.75rem] font-black text-brand-black tracking-[-0.035em] leading-tight">
              Crea tu cuenta
            </h1>
            <p className="text-[0.875rem] text-gray-400 mt-0.5">
              Empieza a comprar organico hoy
            </p>
          </div>
        </div>

        <form
          onSubmit={async e => {
            e.preventDefault()
            setError('')
            if (password !== confirmPassword) { setError('Las contrasenas no coinciden'); return }
            setSubmitting(true)
            const { error: authError } = await supabase.auth.signUp({
              email,
              password,
              options: {
                data: { nombre, apellido },
              },
            })
            setSubmitting(false)
            if (authError) { setError(authError.message); return }
            navigate('/login')
          }}
          className="flex flex-col gap-4"
        >

          {/* Name row */}
          <div className="register-field register-field-grid">
            <div>
              <label htmlFor="nombre" className="form-label form-label--light">Nombre</label>
              <input id="nombre" type="text" placeholder="Tu nombre" value={nombre} onChange={e => setNombre(e.target.value)} required className="form-input form-input--light" />
            </div>
            <div>
              <label htmlFor="apellido" className="form-label form-label--light">Apellido</label>
              <input id="apellido" type="text" placeholder="Tu apellido" value={apellido} onChange={e => setApellido(e.target.value)} required className="form-input form-input--light" />
            </div>
          </div>

          {/* Email */}
          <div className="register-field">
            <label htmlFor="reg-email" className="form-label form-label--light">
              Correo electronico
            </label>
            <input
              id="reg-email"
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="form-input form-input--light"
            />
          </div>

          {/* Password row */}
          <div className="register-field register-field-grid">
            <div>
              <label htmlFor="password" className="form-label form-label--light">Contrasena</label>
              <div className="relative">
                <input
                  id="password"
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
            <div>
              <label htmlFor="confirm-password" className="form-label form-label--light">Confirmar</label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  className="form-input form-input--light pr-12"
                />
                <PasswordToggle
                  isPassword={!showConfirmPassword}
                  onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500" role="alert">{error}</p>
          )}

          {/* Submit */}
          <div className="register-field mt-2">
            <button type="submit" disabled={submitting} className="btn-auth-submit disabled:opacity-50">
              {submitting ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </div>

          {/* Sign in */}
          <div className="register-field text-center">
            <p className="text-[0.9375rem] text-gray-500">
              Ya tienes cuenta?{' '}
              <Link
                to="/login"
                className="text-brand-green font-semibold hover:text-brand-lime transition-colors"
              >
                Ingresar
              </Link>
            </p>
          </div>

        </form>
      </div>
    </div>
  )
}
