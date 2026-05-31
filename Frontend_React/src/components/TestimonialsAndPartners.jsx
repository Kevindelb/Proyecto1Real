import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

export function TestimonialsAndPartners() {
  const testimonials = [
    {
      text: "Una experiencia increíble de principio a fin. Cumplieron todo lo que prometieron y más. ¡Volveremos a viajar con Travel and Routes!",
      author: "María G. – España",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
      rating: 5,
    },
    {
      text: "El mejor servicio de transporte en Cusco. Autos muy cómodos, choferes profesionales y muy puntuales. 100% recomendados.",
      author: "Juan P. – Colombia",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
      rating: 5,
    },
    {
      text: "Increíble organización para nuestro tour a Machu Picchu. La asesoría personalizada por WhatsApp estuvo disponible todo el tiempo.",
      author: "Sarah K. – EE.UU.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
      rating: 5,
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-[#fcfaf6]" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-8">

        {/* seccion del titulo */}
        <div className="mb-12">
          <div className="flex items-center gap-2">
            <div className="w-10 h-[2px] bg-[#84cc16]" />
            <span className="text-xs font-black tracking-widest text-[#0d5638] uppercase">
              LO QUE DICEN NUESTROS VIAJEROS
            </span>
          </div>
        </div>

        {/* layout de testimonios */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* columna izquierda */}
          <div className="lg:col-span-7 flex flex-col md:flex-row items-center gap-6">

            {/* testimonials */}
            <div className="relative bg-white rounded-2xl p-8 shadow-md border border-neutral-100/50 flex-grow min-h-[220px] flex flex-col justify-between transition-all duration-500 hover:shadow-lg">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#84cc16]/30 shadow-xs flex-shrink-0">
                    <img
                      src={testimonials[activeIndex].avatar}
                      alt={testimonials[activeIndex].author}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex text-yellow-400 gap-0.5 mb-1">
                      {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-sm font-black text-[#062e20]">
                      {testimonials[activeIndex].author}
                    </span>
                  </div>
                </div>

                <p className="text-neutral-600 text-sm sm:text-base italic leading-relaxed font-light">
                  "{testimonials[activeIndex].text}"
                </p>
              </div>
            </div>

            {/* botones de navegacion */}
            <div className="flex md:flex-col gap-4">
              <button
                onClick={handlePrev}
                className="w-12 h-12 rounded-full border border-neutral-200 hover:border-[#0d5638] hover:bg-[#0d5638] bg-white hover:text-white flex items-center justify-center text-neutral-500 transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer active:scale-95"
                aria-label="Testimonio anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="w-12 h-12 rounded-full border border-neutral-200 hover:border-[#0d5638] hover:bg-[#0d5638] bg-white hover:text-white flex items-center justify-center text-neutral-500 transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer active:scale-95"
                aria-label="Siguiente testimonio"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

          </div>

          {/* columna derecha : nuestros viajeros */}
          <div className="lg:col-span-5 flex flex-wrap items-center justify-center lg:justify-end gap-10 md:gap-14 py-4">

            {/* promperu logo svg  */}
            <div className="h-14 flex items-center justify-center grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-350 transform hover:scale-105">
              <svg viewBox="0 0 160 50" className="h-10 w-auto" fill="none" xmlns="http:// www.w3.org/2000/svg">

                <path
                  d="M25 25C25 15.5 31.5 9 40 9C48.5 9 53 15.5 53 23C53 30.5 47 37 38.5 37C34.5 37 32 35 32 32.5C32 30.5 33.5 29.5 35.5 29.5C37 29.5 38.5 30.5 40 31.5C41.5 32.5 43.5 33 45.5 33C48 33 50.5 30 50.5 25.5C50.5 21 48 18 45.5 18C43.5 18 41.5 19 40 20C38 21.5 36.5 23.5 36.5 26.5C36.5 28.5 35 29.5 33 29.5C30.5 29.5 29.5 27 29.5 25.5C29.5 23 31.5 21.5 33 20"
                  stroke="#DE2027" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"
                />
                {/* Texto "prom" */}
                <text x="62" y="27" fill="#1C1B1F" fontSize="17" fontWeight="bold" fontFamily="system-ui, sans-serif">prom</text>
                {/* Texto "perú" */}
                <text x="62" y="44" fill="#DE2027" fontSize="17" fontWeight="bold" fontFamily="system-ui, sans-serif">perú</text>
              </svg>
            </div>

            {/* mincetur logo svg  */}
            <div className="h-14 flex items-center justify-center grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-350 transform hover:scale-105">
              <svg viewBox="0 0 180 50" className="h-11 w-auto" fill="none" xmlns="http:// www.w3.org/2000/svg">

                <rect x="2" y="8" width="12" height="32" rx="2" fill="#0d5638" />
                <rect x="18" y="14" width="12" height="26" rx="2" fill="#84cc16" />
                <rect x="34" y="20" width="12" height="20" rx="2" fill="#062e20" />


                <text x="54" y="26" fill="#062e20" fontSize="19" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.5">MIN</text>
                <text x="91" y="26" fill="#84cc16" fontSize="19" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.5">CETUR</text>

                <text x="54" y="38" fill="#717182" fontSize="7" fontWeight="bold" fontFamily="sans-serif">MINISTERIO DE COMERCIO EXTERIOR Y TURISMO</text>
              </svg>
            </div>

            {/* viajes seguros svg  */}
            <div className="h-14 flex items-center justify-center grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-350 transform hover:scale-105">
              <svg viewBox="0 0 80 80" className="h-16 w-auto" xmlns="http:// www.w3.org/2000/svg">

                <circle cx="40" cy="40" r="36" fill="#005A36" />
                <circle cx="40" cy="40" r="32" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="3,3" />


                <text x="40" y="34" fill="#FFFFFF" fontSize="10" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" letterSpacing="0.5">SAFE</text>
                <text x="40" y="46" fill="#FFFFFF" fontSize="9" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" letterSpacing="0.5">TRAVELS</text>


                <path d="M32 55 L38 60 L48 48" stroke="#84cc16" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                <circle cx="24" cy="24" r="1.5" fill="#84cc16" />
                <circle cx="56" cy="24" r="1.5" fill="#84cc16" />
                <circle cx="40" cy="18" r="1.5" fill="#84cc16" />
              </svg>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
