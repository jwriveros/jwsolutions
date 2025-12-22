export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navegación */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
          <div className="text-2xl font-black tracking-tighter text-dark">
            JW<span className="text-primary">SOLUTIONS</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
            <a href="#servicios" className="hover:text-primary transition-colors">Servicios</a>
            <a href="#proceso" className="hover:text-primary transition-colors">Proceso</a>
          </div>
          <button className="bg-dark text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-primary transition-all active:scale-95">
            Empezar ahora
          </button>
        </div>
      </nav>

      {/* Hero Section estilo Cari AI */}
      <section className="px-6 pt-20 pb-32 max-w-5xl mx-auto text-center">
        <div className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-blue-50 text-primary rounded-full">
          Web Development & Automation
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-dark leading-[1.1] tracking-tight">
          Transformamos procesos en <br />
          <span className="text-primary">ventajas competitivas.</span>
        </h1>
        <p className="mt-8 text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Diseño web de alto impacto y automatizaciones inteligentes para empresas que buscan escalar sin fricciones.
        </p>
        
        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-primary text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 hover:scale-105 transition-transform">
            Ver servicios
          </button>
          <button className="bg-white border-2 border-slate-100 text-dark px-10 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-colors">
            Agendar llamada
          </button>
        </div>
      </section>
      <section className="py-12 border-y border-slate-50 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">
            Expertos en las mejores tecnologías
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all">
            {/* Puedes usar nombres de texto si no tienes los logos aún */}
            <span className="text-2xl font-bold text-slate-600">Next.js</span>
            <span className="text-2xl font-bold text-slate-600">Make</span>
            <span className="text-2xl font-bold text-slate-600">Zapier</span>
            <span className="text-2xl font-bold text-slate-600">Tailwind</span>
            <span className="text-2xl font-bold text-slate-600">OpenAI</span>
          </div>
        </div>
      </section>
    </div>
  );
}