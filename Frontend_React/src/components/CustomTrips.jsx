import { Link } from 'react-router-dom';
import { Users, Map, Tag } from 'lucide-react';

export function CustomTrips() {
  return (
    <section className="py-16 bg-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Columna izquierda: imagen del banner */}
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden h-[340px] shadow-lg group">
            {/* imagen */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&q=80&w=800"
                alt="Viajes a medida"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              {/* capa  */}
              <div className="absolute inset-0 bg-[#062e20]/75 mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#062e20]/90 via-[#062e20]/40 to-transparent" />
            </div>

            {/* contenido  */}
            <div className="relative z-10 h-full p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black tracking-widest text-[#84cc16] uppercase">
                    VIAJES A MEDIDA
                  </span>
                  <div className="w-8 h-[2px] bg-[#84cc16]" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mt-3">
                  Tu viaje, a tu manera
                </h3>
                <p className="text-white/80 text-xs sm:text-sm mt-3 leading-relaxed max-w-sm font-light">
                  Cuéntanos qué sueñas y nosotros lo hacemos realidad. Rutas personalizadas, experiencias únicas.
                </p>
              </div>

              <div>
                <Link
                  to="/tours"
                  className="inline-block bg-[#0d5638] hover:bg-[#84cc16] text-white hover:text-[#062e20] py-3.5 px-8 rounded-full font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-[#84cc16]/10 transform active:scale-98"
                >
                  COTIZA TU VIAJE
                </Link>
              </div>
            </div>
          </div>

          {/* Columna derecha: tres características horizontales */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-neutral-100 py-4">

            {/* Característica 1: Asesoría Experta */}
            <div className="flex flex-col items-center text-center p-6 sm:px-4 lg:px-8 space-y-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-[#84cc16] group">
                <Users className="w-9 h-9 stroke-[1.25] transform group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-[#062e20]">
                  Asesoría experta
                </h4>
                <p className="text-xs sm:text-sm text-neutral-500 font-light leading-relaxed">
                  Te ayudamos a planificar cada detalle de tu viaje.
                </p>
              </div>
            </div>

            {/* Característica 2: Rutas flexibles */}
            <div className="flex flex-col items-center text-center p-6 sm:px-4 lg:px-8 space-y-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-[#84cc16] group">
                <Map className="w-9 h-9 stroke-[1.25] transform group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-[#062e20]">
                  Rutas flexibles
                </h4>
                <p className="text-xs sm:text-sm text-neutral-500 font-light leading-relaxed">
                  Itinerarios adaptados a tus tiempos e intereses.
                </p>
              </div>
            </div>

            {/* Característica 3: Mejor Precio */}
            <div className="flex flex-col items-center text-center p-6 sm:px-4 lg:px-8 space-y-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-[#84cc16] group">
                <Tag className="w-9 h-9 stroke-[1.25] transform group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-[#062e20]">
                  Mejor precio
                </h4>
                <p className="text-xs sm:text-sm text-neutral-500 font-light leading-relaxed">
                  Calidad garantizada al mejor precio.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
