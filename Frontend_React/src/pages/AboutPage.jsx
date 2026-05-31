import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Heart, ShieldCheck, Award, Leaf, Users, Check, MapPin, Calendar, Star, Headphones, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <Header />

      {/* Banner de la Página (Hero) */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/about-landscape.jpg"
            alt="Sobre Nosotros"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/45 " />
        </div>
        <div className="relative z-10 text-center text-white px-4 mt-16 animate-in fade-in zoom-in-95 duration-500">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-wide uppercase">Sobre Nosotros</h1>
        </div>
      </div>

      <main className="flex-grow bg-[#fafafa]">

        {/* SECCIÓN 1: NUESTRA HISTORIA */}
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-6 sm:px-12 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* contenido izquierdo  */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black tracking-widest text-[#0d5638] uppercase">
                    NUESTRA HISTORIA
                  </span>
                  <div className="w-10 h-[2px] bg-[#84cc16]" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#062e20] leading-tight mt-2">
                  Conoce nuestra historia
                </h2>
              </div>
              <p className="text-neutral-500 text-sm sm:text-base font-light leading-relaxed">
                Travel and Routes Perú nació en Cusco con el propósito de ofrecer servicios de viaje y transporte de alta calidad, combinando profesionalismo, calidez y conocimiento local.
              </p>
              <p className="text-neutral-500 text-sm sm:text-base font-light leading-relaxed">
                A lo largo de los años, hemos crecido junto a nuestros viajeros, manteniéndonos fieles a nuestros valores y compromiso con la excelencia.
              </p>
            </div>

            {/* imagen derecha  */}
            <div className="relative rounded-3xl overflow-hidden shadow-lg border border-neutral-100 group">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
                alt="Nuestro Equipo"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-black/5" />
            </div>

          </div>
        </section>

        {/* SECCIÓN 2: NUESTROS VALORES */}
        <section className="py-16 bg-white border-t border-b border-neutral-100">
          <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-8 text-center">

            <div className="mb-12">
              <div className="flex items-center gap-2 justify-center">
                <span className="text-[11px] font-black tracking-widest text-[#0d5638] uppercase">
                  NUESTROS VALORES
                </span>
                <div className="w-10 h-[2px] bg-[#84cc16]" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#062e20] leading-tight mt-2">
                Lo que nos guía cada día
              </h2>
            </div>

            {/* Cuadrícula de 5 Valores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">

              {/* Valor 1: Pasión */}
              <div className="flex flex-col items-center p-4 text-center space-y-3 group border-r border-neutral-100/80 last:border-0 pr-4">
                <div className="w-14 h-14 rounded-2xl bg-[#0d5638]/5 border border-[#0d5638]/10 text-[#0d5638] flex items-center justify-center group-hover:scale-108 transition-all duration-300 shadow-xs">
                  <Heart className="w-7 h-7 stroke-[1.5]" />
                </div>
                <h4 className="font-extrabold text-[#062e20] text-base">Pasión</h4>
                <p className="text-neutral-400 text-xs sm:text-sm font-light leading-relaxed">
                  Amamos lo que hacemos y eso se refleja en cada detalle de tu viaje.
                </p>
              </div>

              {/* valor 2: seguridad  */}
              <div className="flex flex-col items-center p-4 text-center space-y-3 group border-r border-neutral-100/80 last:border-0 pr-4">
                <div className="w-14 h-14 rounded-2xl bg-[#0d5638]/5 border border-[#0d5638]/10 text-[#0d5638] flex items-center justify-center group-hover:scale-108 transition-all duration-300 shadow-xs">
                  <ShieldCheck className="w-7 h-7 stroke-[1.5]" />
                </div>
                <h4 className="font-extrabold text-[#062e20] text-base">Seguridad</h4>
                <p className="text-neutral-400 text-xs sm:text-sm font-light leading-relaxed">
                  Tu bienestar es nuestra prioridad en cada servicio que brindamos.
                </p>
              </div>

              {/* valor 3: calidad  */}
              <div className="flex flex-col items-center p-4 text-center space-y-3 group border-r border-neutral-100/80 last:border-0 pr-4">
                <div className="w-14 h-14 rounded-2xl bg-[#0d5638]/5 border border-[#0d5638]/10 text-[#0d5638] flex items-center justify-center group-hover:scale-108 transition-all duration-300 shadow-xs">
                  <Award className="w-7 h-7 stroke-[1.5]" />
                </div>
                <h4 className="font-extrabold text-[#062e20] text-base">Calidad</h4>
                <p className="text-neutral-400 text-xs sm:text-sm font-light leading-relaxed">
                  Ofrecemos servicios de alto estándar con atención personalizada.
                </p>
              </div>

              {/* valor 4: sostenibilidad  */}
              <div className="flex flex-col items-center p-4 text-center space-y-3 group border-r border-neutral-100/80 last:border-0 pr-4">
                <div className="w-14 h-14 rounded-2xl bg-[#0d5638]/5 border border-[#0d5638]/10 text-[#0d5638] flex items-center justify-center group-hover:scale-108 transition-all duration-300 shadow-xs">
                  <Leaf className="w-7 h-7 stroke-[1.5]" />
                </div>
                <h4 className="font-extrabold text-[#062e20] text-base">Sostenibilidad</h4>
                <p className="text-neutral-400 text-xs sm:text-sm font-light leading-relaxed">
                  Promovemos el turismo responsable, cuidando nuestro entorno y cultura.
                </p>
              </div>

              {/* valor 5: compromiso  */}
              <div className="flex flex-col items-center p-4 text-center space-y-3 group last:border-0">
                <div className="w-14 h-14 rounded-2xl bg-[#0d5638]/5 border border-[#0d5638]/10 text-[#0d5638] flex items-center justify-center group-hover:scale-108 transition-all duration-300 shadow-xs">
                  <Users className="w-7 h-7 stroke-[1.5]" />
                </div>
                <h4 className="font-extrabold text-[#062e20] text-base">Compromiso</h4>
                <p className="text-neutral-400 text-xs sm:text-sm font-light leading-relaxed">
                  Nos comprometemos contigo desde el primer contacto hasta tu regreso.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* SECCIÓN 3: ¿POR QUÉ ELEGIRNOS? */}
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-6 sm:px-12 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* imagen izquierda (mercedes executive van)  */}
            <div className="relative rounded-3xl overflow-hidden shadow-lg border border-neutral-100 group">
              <img
                src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800"
                alt="Flota Ejecutiva"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-black/5" />
            </div>

            {/* puntos clave a la derecha  */}
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black tracking-widest text-[#0d5638] uppercase">
                    ¿POR QUÉ ELEGIRNOS?
                  </span>
                  <div className="w-10 h-[2px] bg-[#84cc16]" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#062e20] leading-tight mt-2">
                  Tu mejor opción en Perú
                </h2>
              </div>

              {/* lista de puntos  */}
              <div className="space-y-6">

                {/* punto 1  */}
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0d5638]/10 text-[#0d5638] flex items-center justify-center mt-1">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </span>
                  <div>
                    <h4 className="font-extrabold text-[#062e20] text-[15px]">Operadores turísticos certificados</h4>
                    <p className="text-neutral-500 text-xs sm:text-sm font-light mt-0.5 leading-relaxed">
                      Contamos con todas las certificaciones y permisos para brindar servicios confiables.
                    </p>
                  </div>
                </div>

                {/* punto 2  */}
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0d5638]/10 text-[#0d5638] flex items-center justify-center mt-1">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </span>
                  <div>
                    <h4 className="font-extrabold text-[#062e20] text-[15px]">Atención personalizada 24/7</h4>
                    <p className="text-neutral-500 text-xs sm:text-sm font-light mt-0.5 leading-relaxed">
                      Estamos contigo antes, durante y después de tu viaje.
                    </p>
                  </div>
                </div>

                {/* punto 3  */}
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0d5638]/10 text-[#0d5638] flex items-center justify-center mt-1">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </span>
                  <div>
                    <h4 className="font-extrabold text-[#062e20] text-[15px]">Experiencia local</h4>
                    <p className="text-neutral-500 text-xs sm:text-sm font-light mt-0.5 leading-relaxed">
                      Conocemos Perú como nadie y te llevamos a los mejores lugares.
                    </p>
                  </div>
                </div>

                {/* punto 4  */}
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0d5638]/10 text-[#0d5638] flex items-center justify-center mt-1">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </span>
                  <div>
                    <h4 className="font-extrabold text-[#062e20] text-[15px]">Flota moderna y confortable</h4>
                    <p className="text-neutral-500 text-xs sm:text-sm font-light mt-0.5 leading-relaxed">
                      Vehículos de última generación para tu máximo confort y seguridad.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* SECCIÓN 4: FRANJA OSCURA DE ESTADÍSTICAS */}
        <section className="bg-[#0c1815] py-8 border-t border-[#132521]">
          <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">

            {/* Estadística 1 */}
            <div className="flex items-center gap-4 justify-center">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 text-[#84cc16] flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div className="text-left">
                <h3 className="text-white font-extrabold text-xl sm:text-2xl leading-none">+12,000</h3>
                <span className="text-neutral-400 text-xs sm:text-sm font-light mt-0.5">Viajeros felices</span>
              </div>
            </div>

            {/* Estadística 2 */}
            <div className="flex items-center gap-4 justify-center">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 text-[#84cc16] flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div className="text-left">
                <h3 className="text-white font-extrabold text-xl sm:text-2xl leading-none">+100</h3>
                <span className="text-neutral-400 text-xs sm:text-sm font-light mt-0.5">Destinos increíbles</span>
              </div>
            </div>

            {/* Estadística 3 */}
            <div className="flex items-center gap-4 justify-center">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 text-[#84cc16] flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div className="text-left">
                <h3 className="text-white font-extrabold text-xl sm:text-2xl leading-none">+8</h3>
                <span className="text-neutral-400 text-xs sm:text-sm font-light mt-0.5">Años de experiencia</span>
              </div>
            </div>

            {/* Estadística 4 */}
            <div className="flex items-center gap-4 justify-center">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 text-[#84cc16] flex items-center justify-center flex-shrink-0">
                <Star className="w-5 h-5 fill-[#84cc16] text-[#84cc16]" />
              </div>
              <div className="text-left">
                <h3 className="text-white font-extrabold text-xl sm:text-2xl leading-none">4.9/5</h3>
                <span className="text-neutral-400 text-xs sm:text-sm font-light mt-0.5">Calificación de viajeros</span>
              </div>
            </div>

          </div>
        </section>

        {/* SECCIÓN 5: BANNER INFERIOR DE LLAMADA A LA ACCIÓN DE CONTACTO */}
        <section className="py-12 bg-[#f4f6f4] border-t border-neutral-100">
          <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">

            <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
              <div className="w-14 h-14 rounded-full bg-[#0d5638] text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-[#062e20] font-extrabold text-lg sm:text-xl">
                  ¿Listo para vivir tu próxima aventura?
                </h3>
                <p className="text-neutral-500 text-xs sm:text-sm font-light mt-0.5">
                  Permítenos ser parte de tu historia en Perú.
                </p>
              </div>
            </div>

            <div className="w-full md:w-auto">
              <button className="w-full md:w-auto bg-[#0d5638] hover:bg-[#0a452c] text-white font-extrabold px-8 py-4 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer text-sm sm:text-base">
                Contáctanos ahora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
