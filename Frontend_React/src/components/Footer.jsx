import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#05251a] text-white pt-16 pb-8 border-t border-emerald-950/20" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-8">

        {/* Cuadrícula Principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-12 border-b border-white/10">

          {/* columna 1: logo y marca  */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center">
              <Link to="/" className="flex items-center py-1">
                <img
                  src="/images/logo_travel_and_routes_2.PNG"
                  alt="Travel & Routes Logo"
                  className="h-16 sm:h-18 w-auto object-contain transition-transform duration-300 hover:scale-105"
                />
              </Link>
            </div>
            <p className="text-white/60 text-xs sm:text-sm font-light leading-relaxed max-w-sm">
              Tu socio de confianza para experiences de viaje premium y transporte ejecutivo de lujo en todo el Perú.
            </p>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-black tracking-wider text-[#84cc16] uppercase">
              ENLACES RÁPIDOS
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-light text-white/70">
              <li>
                <Link to="/tours" className="hover:text-[#84cc16] hover:underline transition-all">
                  Destinos
                </Link>
              </li>
              <li>
                <Link to="/tours" className="hover:text-[#84cc16] hover:underline transition-all">
                  Tours
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-[#84cc16] hover:underline transition-all">
                  Viajes a medida
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-[#84cc16] hover:underline transition-all">
                  Transporte
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Información de contacto */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-black tracking-wider text-[#84cc16] uppercase">
              CONTÁCTANOS
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm font-light text-white/70">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#84cc16]" />
                <span>+51 987 654 321</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#84cc16]" />
                <a href="mailto:info@travelandroutes.pe" className="hover:text-[#84cc16]">
                  info@travelandroutes.pe
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#84cc16]" />
                <span>Cusco, Perú</span>
              </li>
            </ul>
          </div>

          {/* Columna 4: Síguenos y Mapa del Perú */}
          <div className="lg:col-span-4 flex justify-between items-start gap-4">

            {/* iconos de redes sociales  */}
            <div className="space-y-4">
              <h4 className="text-xs font-black tracking-wider text-[#84cc16] uppercase">
                SÍGUENOS
              </h4>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-[#84cc16] hover:bg-[#84cc16]/10 flex items-center justify-center text-white hover:text-[#84cc16] transition-all"
                  aria-label="Facebook"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-[#84cc16] hover:bg-[#84cc16]/10 flex items-center justify-center text-white hover:text-[#84cc16] transition-all"
                  aria-label="Instagram"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none stroke-[2]" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-[#84cc16] hover:bg-[#84cc16]/10 flex items-center justify-center text-white hover:text-[#84cc16] transition-all"
                  aria-label="TikTok"
                >
                  {/* icono tiktok :)  */}
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.62 4.17 1.22 1.34 2.99 2.06 4.79 2.22v3.9c-1.89-.01-3.72-.67-5.2-1.86-.1.08-.1.21-.11.31-.01 2.91.01 5.82-.01 8.73-.1 1.77-.66 3.51-1.74 4.93-1.89 2.58-5.32 3.65-8.32 2.55-2.88-1.01-4.99-3.79-5.18-6.85-.24-3.41 1.95-6.68 5.25-7.53 1.15-.31 2.37-.3 3.5.03v4.03c-.88-.34-1.88-.32-2.73.12-1.3.64-2.1 2.1-1.89 3.55.19 1.49 1.43 2.63 2.93 2.6 1.49-.03 2.67-1.18 2.76-2.67.06-2.58.02-5.16.03-7.74-.01-3.23-.01-6.46-.01-9.69-.11-.22-.24-.31-.48-.31z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-[#84cc16] hover:bg-[#84cc16]/10 flex items-center justify-center text-white hover:text-[#84cc16] transition-all"
                  aria-label="YouTube"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.002 3.002 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Logo oficial de Marca Perú */}
            <div className="relative group select-none flex items-center justify-center">
              <img
                src="/images/marca-peru.png"
                alt="Marca Perú"
                className="w-28 sm:w-40 h-auto opacity-75 group-hover:opacity-100 transition-all duration-300 hover:scale-105 filter drop-shadow-[0_0_4px_rgba(255,255,255,0.15)]"
              />
            </div>

          </div>

        </div>

        {/* barra inferior  */}
        <div className="mt-8 pt-8 flex flex-col md:flex-row items-center justify-between text-xs font-light text-white/40 gap-4">
          <p>© 2026 Travel and Routes. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Términos de servicio</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">Política de privacidad</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
