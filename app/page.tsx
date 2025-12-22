export default function Home() {
  return (
    <div className="min-h-screen font-sans selection:bg-blue-100">
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
          <a 
            href="https://wa.me/573000000000" // Reemplaza con tu número real
            className="bg-dark text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-primary transition-all active:scale-95"
          >
            Empezar ahora
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 pt-20 pb-32 max-w-5xl mx-auto text-center">
        <div className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-blue-50 text-primary rounded-full">
          Web Development & Automation
        </div>
        <h1 className="animate-in fade-in slide-in-from-bottom-4 duration-1000 text-5xl md:text-7xl font-extrabold text-dark leading-[1.1] tracking-tight">
          Transformamos procesos en <br />
          <span className="text-primary">ventajas competitivas.</span>
        </h1>
        <p className="mt-8 text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Diseño web de alto impacto y automatizaciones inteligentes para empresas que buscan escalar sin fricciones.
        </p>
        
        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
          <a href="#servicios" className="bg-primary text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 hover:scale-105 transition-transform text-center">
            Ver servicios
          </a>
          <a href="https://wa.me/573000000000" className="bg-white border-2 border-slate-100 text-dark px-10 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-colors text-center">
            Agendar llamada
          </a>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-12 border-y border-slate-50 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">
            Expertos en las mejores tecnologías
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all">
            <span className="text-2xl font-bold text-slate-600">Next.js</span>
            <span className="text-2xl font-bold text-slate-600">Make</span>
            <span className="text-2xl font-bold text-slate-600">Zapier</span>
            <span className="text-2xl font-bold text-slate-600">Tailwind</span>
            <span className="text-2xl font-bold text-slate-600">OpenAI</span>
          </div>
        </div>
      </section>

      {/* Sección de Servicios */}
      <section id="servicios" className="bg-slate-50 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-dark">Nuestras Soluciones</h2>
            <p className="text-slate-500 mt-4">Tecnología a medida para cada etapa de tu negocio</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-shadow group">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors text-primary group-hover:text-white">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-2m0 0l4 2m-4-2v-4m-6 4l4-2m0 0l4 2m-4-2V7l4-2m0 0l4 2m-4-2v4" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Desarrollo Web</h3>
              <p className="text-slate-600 leading-relaxed">Sitios optimizados para SEO y conversión, creados con Next.js para una velocidad inigualable.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-shadow group">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors text-primary group-hover:text-white">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Automatizaciones</h3>
              <p className="text-slate-600 leading-relaxed">Conectamos tus herramientas favoritas para que tu negocio trabaje de forma autónoma 24/7.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-shadow group">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors text-primary group-hover:text-white">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Soluciones IA</h3>
              <p className="text-slate-600 leading-relaxed">Implementamos agentes inteligentes para mejorar la atención al cliente y ventas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Proceso */}
      <section id="proceso" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-dark">Cómo Trabajamos</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="relative">
            <div className="text-6xl font-black text-slate-100 absolute -top-8 -left-4 -z-10">01</div>
            <h3 className="text-xl font-bold mb-2">Diagnóstico</h3>
            <p className="text-slate-500">Analizamos tus cuellos de botella y procesos manuales actuales.</p>
          </div>
          <div className="relative">
            <div className="text-6xl font-black text-slate-100 absolute -top-8 -left-4 -z-10">02</div>
            <h3 className="text-xl font-bold mb-2">Desarrollo</h3>
            <p className="text-slate-500">Creamos tu plataforma y conectamos tus herramientas con IA.</p>
          </div>
          <div className="relative">
            <div className="text-6xl font-black text-slate-100 absolute -top-8 -left-4 -z-10">03</div>
            <h3 className="text-xl font-bold mb-2">Despegue</h3>
            <p className="text-slate-500">Implementamos la solución y capacitamos a tu equipo para escalar.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark py-20 px-6 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Listo para automatizar tu éxito?</h2>
        <p className="text-slate-400 mb-10 max-w-xl mx-auto">
          Únete a las empresas que ya están ahorrando horas de trabajo manual con nuestras soluciones.
        </p>
        <a 
          href="https://wa.me/573181757220?text=Hola%20JW%20Solutions,%20me%20gustaría%20agendar%20una%20llamada%20para%20conocer%20más%20sobre%20sus%20servicios." 
          className="bg-primary hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold transition-all inline-block shadow-lg shadow-blue-500/20"
        >
          Hablar por WhatsApp
        </a>
        <div className="mt-12 pt-8 border-t border-slate-800 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} JW Solutions. Todos los derechos reservados.</p>
          <p className="mt-2 text-xs">Desarrollado con Next.js y Tailwind v4</p>
        </div>
      </footer>
    </div>
  );
}