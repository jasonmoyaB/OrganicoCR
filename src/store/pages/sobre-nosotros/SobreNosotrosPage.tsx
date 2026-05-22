const STATS = [
  { value: '2019', label: 'Fundados' },
  { value: '50+', label: 'Productores' },
  { value: '5000+', label: 'Familias Servidas' },
]

export default function SobreNosotrosPage() {
  return (
    <main className="page-center page-center--light">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <img
          src="/logo/Organico.webp"
          alt="OrganicoCR"
          className="h-20 w-auto max-w-[220px] mx-auto mb-8 object-contain"
        />

        <h1 className="text-page-h1 font-black text-brand-black tracking-[-0.03em] mb-6">
          Sobre Nosotros
        </h1>

        <p className="text-xl text-brand-dark leading-7 mb-12">
          OrganicoCR nacio del amor por la tierra costarricense y el compromiso de conectar a familias con productores organicos locales. Cada producto que ofrecemos es seleccionado con cuidado, garantizando calidad, frescura y sostenibilidad.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {STATS.map(stat => (
            <div key={stat.label} className="stat-card">
              <div className="stat-card-value">{stat.value}</div>
              <div className="stat-card-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
