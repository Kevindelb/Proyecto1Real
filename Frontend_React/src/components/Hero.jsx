import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Hero() {
  return (<section id="home" className="relative h-screen flex items-center justify-start overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
    {/* video de fondo  */}
    <div className="absolute inset-0">
      <video
        src="/videos/travelperu.mp4"
        autoPlay
        loop
        muted
        playsInline
        poster="/images/hero-machu-picchu.jpg"
        className="w-full h-screen object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />
    </div>

    <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-20 lg:px-24">
      <div className="max-w-4xl text-left animate-in fade-in slide-in-from-left-8 duration-700">

        <span
          style={{ fontFamily: "'Caveat', cursive" }}
          className="text-[#84cc16] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal block leading-none select-none"
        >
          Descubre
        </span>

        <h1 className="text-white text-7xl sm:text-9xl md:text-[10rem] lg:text-[12rem] font-black tracking-widest leading-none select-none uppercase mt-2">
          PERÚ
        </h1>

        <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-6 tracking-normal leading-tight">
          Experiencias auténticas, lugares inolvidables
        </h2>

        <div className="w-24 h-[4px] bg-[#84cc16] mt-6" />

        <p className="text-white/90 text-base sm:text-lg md:text-xl mt-6 max-w-2xl font-light leading-relaxed">
          En Travel and Routes diseñamos viajes únicos para que vivas lo mejor de nuestro país.
        </p>

        <div className="mt-10">
          <Link
            to="/services"
            className="bg-[#f28b0c] hover:bg-[#d97c0a] text-white py-4 px-10 rounded-full font-extrabold text-sm uppercase tracking-widest inline-flex items-center gap-3 transition-all duration-350 shadow-lg hover:shadow-orange-500/20 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Explora nuestros tours
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
    <button
      type="button"
      className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 hover:border-white/40 bg-black/10 hover:bg-black/30 backdrop-blur-sm hidden md:flex items-center justify-center text-white transition-all cursor-pointer z-20 group"
      onClick={() => { <LINK TO="/services" ></LINK> }}
    >
      <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
    </button>

    <button
      type="button"
      className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 hover:border-white/40 bg-black/10 hover:bg-black/30 backdrop-blur-sm hidden md:flex items-center justify-center text-white transition-all cursor-pointer z-20 group"
      onClick={() => { <LINK TO="/services"></LINK> }}
    >
      <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
    </button>
  </section>);
}
