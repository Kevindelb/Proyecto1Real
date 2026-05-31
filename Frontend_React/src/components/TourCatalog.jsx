import { useEffect, useState } from 'react';
import { Star, Heart, ArrowRight, Check, Shield, Headphones, Compass, Users, Sparkles, Calendar, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTours } from '../hooks/useTours';

export function TourCatalog() {
  const { filteredTours, loading, error, sortBy, setSortBy } = useTours();
  const [favorites, setFavorites] = useState({});
  const { addToCart } = useCart();
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const handleAddToCart = async (serviceId) => {
    const res = await addToCart(serviceId, 1);
    if (res.success) {
      setToast({ show: true, message: '¡Tour agregado al carrito!', type: 'success' });
      setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    } else {
      if (res.requireLogin) {
        setToast({ show: true, message: 'Por favor, inicia sesión para agregar productos.', type: 'warning' });
      } else {
        setToast({ show: true, message: res.message || 'Error al agregar al carrito.', type: 'warning' });
      }
      setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
    }
  };

  // propiedades dinamicas del tour
  const getDynamicTourProps = (tour, index) => {
    return {
      image: tour.imagen_url && tour.imagen_url.trim() !== '' ? tour.imagen_url : 'http://127.0.0.1:8000/storage/servicios/no%20hay%20imagen.webp',
      duration: tour.duracion_dias ? `${tour.duracion_dias} Días` : '1 Día',
      subtitle: tour.destino || 'Perú',
      rating: '4.8',
      reviews: (15 + (index * 6)).toString(),
      description: tour.descripcion || 'Explora esta increíble ruta diseñada para brindarte la mejor aventura en tu viaje.'
    };
  };

  // selector de favoritos
  const toggleFavorite = (id) => {
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section className="py-12 bg-[#fafafa]" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-8">

        {/* barra de caracteristicas  */}
        <div className="bg-[#f7f9f7] rounded-3xl p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 border border-neutral-100">

          {/*Caracteristica 1*/}
          <div className="flex gap-4 items-start border-b sm:border-b-0 pb-4 sm:pb-0 sm:border-r border-neutral-200/60 last:border-0 pr-4">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-neutral-100 text-[#0d5638] flex items-center justify-center flex-shrink-0">
              <Compass className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="font-bold text-[#062e20] text-sm sm:text-base">Guías certificados</h4>
              <p className="text-neutral-500 text-xs sm:text-sm font-light mt-0.5">Expertos locales apasionados por la historia.</p>
            </div>
          </div>

          {/*Caracteristica 2*/}
          <div className="flex gap-4 items-start border-b sm:border-b-0 pb-4 sm:pb-0 lg:border-r border-neutral-200/60 last:border-0 pr-4">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-neutral-100 text-[#0d5638] flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="font-bold text-[#062e20] text-sm sm:text-base">Grupos reducidos</h4>
              <p className="text-neutral-500 text-xs sm:text-sm font-light mt-0.5">Experiencias íntimas y muy seguras.</p>
            </div>
          </div>

          {/*Caracteristica 3*/}
          <div className="flex gap-4 items-start border-b sm:border-b-0 pb-4 sm:pb-0 sm:border-r border-neutral-200/60 last:border-0 pr-4">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-neutral-100 text-[#0d5638] flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="font-bold text-[#062e20] text-sm sm:text-base">Todo incluido</h4>
              <p className="text-neutral-500 text-xs sm:text-sm font-light mt-0.5">Entradas, almuerzo y transporte garantizados.</p>
            </div>
          </div>

          {/*Caracteristica 4*/}
          <div className="flex gap-4 items-start last:border-0">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-neutral-100 text-[#0d5638] flex items-center justify-center flex-shrink-0">
              <Calendar className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="font-bold text-[#062e20] text-sm sm:text-base">Cancelación flexible</h4>
              <p className="text-neutral-500 text-xs sm:text-sm font-light mt-0.5">Cambia de fecha gratis hasta 24 horas antes.</p>
            </div>
          </div>

        </div>

        {/* titulo y barra de orden */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <span className="text-[11px] font-black tracking-widest text-[#0d5638] uppercase">
              EXPLORA PERÚ
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#062e20] leading-none mt-1">
              Nuestros Tours
            </h2>
            <p className="text-neutral-500 text-sm sm:text-base mt-2 font-light">
              Elige tu próxima aventura y déjanos encargarnos del resto.
            </p>
          </div>

          {/* selector de orden */}
          <div className="flex-shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-neutral-200 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-neutral-600 outline-none shadow-xs hover:border-neutral-300 transition-colors cursor-pointer"
            >
              <option value="recomendados">Ordenar por recomendados</option>
              <option value="precio_bajo">Precio: de menor a mayor</option>
              <option value="precio_alto">Precio: de mayor a menor</option>
              <option value="nombre">Orden alfabético</option>
            </select>
          </div>
        </div>

        {/* loading skeletons  */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden border border-neutral-100 p-4 space-y-4 animate-pulse shadow-sm">
                <div className="bg-neutral-200 h-44 w-full rounded-2xl" />
                <div className="h-6 bg-neutral-200 rounded w-2/3" />
                <div className="h-4 bg-neutral-200 rounded w-full" />
                <div className="flex justify-between items-center pt-2">
                  <div className="h-5 bg-neutral-200 rounded w-1/3" />
                  <div className="h-5 bg-neutral-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* error state  */}
        {error && !loading && (
          <div className="bg-red-50 text-red-700 p-6 rounded-2xl text-center max-w-2xl mx-auto border border-red-100 mb-12">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* empty state  */}
        {!loading && !error && filteredTours.length === 0 && (
          <div className="text-center text-neutral-500 py-16 bg-white rounded-3xl border border-neutral-100 shadow-xs mb-12">
            <span className="text-4xl">🗺️</span>
            <h3 className="text-lg font-bold text-[#062e20] mt-3">No se encontraron tours</h3>
            <p className="text-neutral-400 text-sm mt-1 max-w-xs mx-auto">
              No hay tours disponibles en este momento.
            </p>
          </div>
        )}

        {/* cards grid  */}
        {!loading && !error && filteredTours.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {filteredTours.map((tour, index) => {
              const props = getDynamicTourProps(tour, index);
              const isFav = !!favorites[tour.id_servicio];

              return (
                <div
                  key={tour.id_servicio}
                  className="bg-white rounded-3xl overflow-hidden border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col group transform hover:-translate-y-1.5"
                >
                  {/* Image with Tag & Favorite Button */}
                  <div className="relative h-44 w-full overflow-hidden">
                    <img
                      src={props.image}
                      alt={tour.nombre}
                      className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-black/10" />

                    {/* float duration tag  */}
                    <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-xs text-[10px] text-white font-bold py-1 px-2.5 rounded-full flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#84cc16]" />
                      {props.duration}
                    </div>

                    {/* wishlist heart  */}
                    <button
                      onClick={() => toggleFavorite(tour.id_servicio)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center shadow-md transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer text-neutral-400 hover:text-red-500"
                    >
                      <Heart className={`w-4.5 h-4.5 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                  </div>

                  {/* body text  */}
                  <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-[16px] font-bold text-[#062e20] leading-snug group-hover:text-[#0d5638] transition-colors duration-300 line-clamp-1">
                        {tour.nombre}
                      </h3>
                      <div className="text-[11px] font-bold uppercase text-[#0d5638] tracking-wider">
                        {props.subtitle}
                      </div>
                      <p className="text-xs text-neutral-400 font-light leading-relaxed line-clamp-2 pt-1">
                        {props.description}
                      </p>
                    </div>

                    {/* price and rating  */}
                    <div className="pt-3 border-t border-neutral-50 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Desde</span>
                        <span className="text-[#062e20] font-black text-sm">USD {parseInt(tour.precio)}</span>
                      </div>

                      {/* stars rating  */}
                      <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-black text-amber-600">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>{props.rating}</span>
                        <span className="text-[10px] font-normal text-neutral-400">({props.reviews})</span>
                      </div>
                    </div>

                    {/* add to cart button  */}
                    <button
                      onClick={() => handleAddToCart(tour.id_servicio)}
                      className="w-full mt-2 py-2 px-4 rounded-xl bg-[#0d5638] hover:bg-[#062e20] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-sm cursor-pointer hover:shadow-md"
                    >
                      Añadir al Carrito
                      <ShoppingBag className="w-4 h-4" />
                    </button>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* dynamic cta banner  */}
        <div className="relative rounded-3xl overflow-hidden bg-[#051a14] text-white p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-lg">
          {/* background image overlay  */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&q=80&w=1200')" }}
          />

          <div className="relative z-10 max-w-xl space-y-4 text-center lg:text-left">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-snug">
              ¿No sabes qué tour elegir?
            </h3>
            <p className="text-neutral-300 text-sm sm:text-base font-light">
              Cuéntanos qué te gustaría hacer y te ayudamos a planear tu viaje perfecto.
            </p>

            <button className="bg-[#84cc16] hover:bg-[#72b012] text-white font-extrabold px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group/cta mx-auto lg:mx-0 cursor-pointer text-xs sm:text-sm">
              Crear mi viaje personalizado
              <ArrowRight className="w-4 h-4 group-hover/cta:translate-x-1 transition-transform duration-300" />
            </button>
          </div>

          {/* key bullet benefits on the right  */}
          <div className="relative z-10 space-y-4 w-full lg:w-auto text-left border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-10">

            {/* benefit 1  */}
            <div className="flex gap-3.5 items-start">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs text-[#84cc16] flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 stroke-[3.5]" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-xs sm:text-sm uppercase tracking-wider">Asesoría gratuita</h4>
                <p className="text-neutral-300 text-[11px] font-light mt-0.5 max-w-[200px]">Te ayudamos a elegir la mejor opción.</p>
              </div>
            </div>

            {/* benefit 2  */}
            <div className="flex gap-3.5 items-start">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs text-[#84cc16] flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-xs sm:text-sm uppercase tracking-wider">100% Personalizado</h4>
                <p className="text-neutral-300 text-[11px] font-light mt-0.5 max-w-[200px]">Diseñamos tu viaje a medida.</p>
              </div>
            </div>

            {/* benefit 3  */}
            <div className="flex gap-3.5 items-start">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs text-[#84cc16] flex items-center justify-center flex-shrink-0">
                <Headphones className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-xs sm:text-sm uppercase tracking-wider">Mejor precio garantizado</h4>
                <p className="text-neutral-300 text-[11px] font-light mt-0.5 max-w-[200px]">Te ofrecemos la mejor relación calidad - precio.</p>
              </div>
            </div>

          </div>
        </div>

        {/* premium toast notification  */}
        {toast.show && (
          <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border text-sm font-semibold transition-all duration-500 animate-slideIn ${toast.type === 'success'
            ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
            : 'bg-amber-50 border-amber-100 text-amber-800'
            }`}>
            {toast.type === 'success' ? (
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs flex justify-center items-center font-bold">✓</span>
            ) : (
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs flex justify-center items-center font-bold">!</span>
            )}
            <span>{toast.message}</span>
            <button onClick={() => setToast({ ...toast, show: false })} className="text-neutral-400 hover:text-neutral-600 ml-2 font-bold cursor-pointer">×</button>
          </div>
        )}

      </div>
    </section>
  );
}
