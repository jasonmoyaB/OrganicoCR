const FIELDS = [
  { id: 'nombre', label: 'Nombre completo', type: 'text', placeholder: 'Tu nombre' },
  { id: 'email', label: 'Correo electronico', type: 'email', placeholder: 'tu@correo.com' },
]

export default function ContactanosPage() {
  return (
    <main className="page-center page-center--light">
      <div className="max-w-2xl mx-auto px-6 w-full">
        <h1 className="text-page-h1 font-black text-brand-black tracking-[-0.03em] text-center mb-4">
          Contactanos
        </h1>
        <p className="text-[1.125rem] text-brand-dark leading-7 text-center mb-12">
          Estamos aqui para ayudarte. Escríbenos y te responderemos en menos de 24 horas.
        </p>

        <form onSubmit={e => e.preventDefault()} className="flex flex-col gap-5">
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

          <div>
            <label htmlFor="mensaje" className="form-label form-label--light">
              Mensaje
            </label>
            <textarea
              id="mensaje"
              rows={5}
              placeholder="Cuéntanos en qué podemos ayudarte..."
              className="form-input form-input--light"
            />
          </div>

          <button type="submit" className="btn-form-submit">
            Enviar Mensaje
          </button>
        </form>
      </div>
    </main>
  )
}
