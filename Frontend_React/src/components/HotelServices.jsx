import { useEffect, useState } from 'react';
import { Building, Bed, Sparkles, Trees, Check, Waves, DollarSign, Headphones, ArrowRight, ShoppingBag } from 'lucide-react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

export function HotelServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const handleAddToCart = async (serviceId) => {
    const res = await addToCart(serviceId, 1);
    if (res.success) {
      setToast({ show: true, message: '¡Hotel agregado al carrito!', type: 'success' });
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

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/servicios');
        const data = response.data.data || response.data;
        // filtro estricto del tipo 'hotel'
        const filtered = data.filter(item => item.tipo_servicio === 'hotel');
        setServices(filtered);
        setLoading(false);
      } catch (err) {
        console.error('Error al obtener servicios de hoteles:', err);
        setError('No se pudieron cargar los servicios de hospedaje desde la API.');
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const getDynamicCardProperties = (service, index) => {
    // iconos premium dinámicos e imágenes hermosas basadas en el índice para la variedad
    const icons = [Sparkles, Building, Trees, Bed];
    const iconComponent = icons[index % icons.length] || Building;

    const fallbackImages = [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=600'
    ];
    const image = service.imagen_url && service.imagen_url.trim() !== ''
      ? service.imagen_url
      : 'http://127.0.0.1:8000/storage/servicios/no%20hay%20imagen.webp';

    const featurePresets = [
      ['Desayuno buffet incluido', 'Piscina exterior climatizada', 'Wi-Fi de alta velocidad'],
      ['Estacionamiento gratuito', 'Gimnasio completo', 'Servicio de lavandería'],
      ['Servicio al cuarto 24/7', 'Aire acondicionado', 'Cancelación flexible'],
      ['Vistas a la ciudad', 'Salas de juntas premium', 'Restaurante de autor']
    ];
    const features = featurePresets[index % featurePresets.length];

    return {
      image,
      features,
      icon: iconComponent
    };
  };

  return (
    <section className="py-16 bg-[#fafafa] border-t border-neutral-100" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-8">

        {/* titulo */}
        <div className="mb-12">
          <div className="w-12 h-[3px] bg-[#0d5638] mb-4 rounded-full" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#062e20] tracking-tight">
            Nuestros servicios de hospedaje y hoteles
          </h2>
          <p className="text-neutral-500 text-sm sm:text-base mt-2 max-w-3xl font-light leading-relaxed">
            Disfruta de una estancia inolvidable en los mejores hoteles seleccionados por su confort, ubicación y servicio excepcional.
          </p>
        </div>

        {/* estado de carga */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden border border-neutral-100 p-4 space-y-4 animate-pulse shadow-sm">
                <div className="bg-neutral-200 h-48 w-full rounded-2xl" />
                <div className="h-6 bg-neutral-200 rounded w-2/3 mx-auto" />
                <div className="h-4 bg-neutral-200 rounded w-full" />
                <div className="h-4 bg-neutral-200 rounded w-5/6" />
                <div className="h-10 bg-neutral-200 rounded-full w-full mt-4" />
              </div>
            ))}
          </div>
        )}

        {/* estado de error */}
        {error && !loading && (
          <div className="bg-red-50 text-red-700 p-6 rounded-2xl text-center max-w-2xl mx-auto border border-red-100 mb-16">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* estado de vacío */}
        {!loading && !error && services.length === 0 && (
          <div className="text-center text-neutral-500 py-16 bg-white rounded-3xl border border-neutral-100 shadow-xs mb-16 px-4">
            <Building className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#062e20]">No hay hoteles registrados</h3>
            <p className="text-neutral-400 text-sm mt-1 max-w-md mx-auto">
              Actualmente no contamos con servicios del tipo hotel cargados en la base de datos del backend.
            </p>
          </div>
        )}

        {/* grid de tarjetas */}
        {!loading && !error && services.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {services.map((service, index) => {
              const cardProps = getDynamicCardProperties(service, index);
              const IconComponent = cardProps.icon;

              return (
                <div
                  key={service.id_servicio}
                  className="bg-white rounded-3xl overflow-hidden border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col group transform hover:-translate-y-2"
                >
                  {/* imagen */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={cardProps.image}
                      alt={service.nombre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-black/10" />
                  </div>

                  {/* cuerpo */}
                  <div className="px-6 pb-6 pt-8 flex-grow flex flex-col justify-between relative">

                    {/* circulo flotante */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#0d5638] text-white flex items-center justify-center border-4 border-white shadow-md group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="text-center space-y-3">
                      {/* titulo */}
                      <h3 className="text-lg font-bold text-[#062e20] leading-snug group-hover:text-[#0d5638] transition-colors duration-300 line-clamp-1">
                        {service.nombre}
                      </h3>
                      {/* descripcion */}
                      <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-light line-clamp-3">
                        {service.descripcion || 'Disfruta de una estadía de primer nivel con todas las comodidades modernas a tu entera disposición.'}
                      </p>

                      {/* lista de caracteristicas */}
                      <ul className="text-left space-y-2 pt-2 pb-4">
                        {cardProps.features.map((feature, indexIdx) => (
                          <li key={indexIdx} className="flex items-center gap-2 text-xs text-neutral-600 font-medium">
                            <span className="flex-shrink-0 w-4 h-4 rounded-full bg-[#0d5638]/10 text-[#0d5638] flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* precio y boton  */}
                    <div className="space-y-3 mt-auto">
                      <div className="flex justify-between items-center px-1 text-xs text-neutral-400 font-medium">
                        <span>Precio por noche</span>
                        <span className="text-[#0d5638] font-bold text-sm">${parseFloat(service.precio).toFixed(2)}</span>
                      </div>

                      <button
                        onClick={() => handleAddToCart(service.id_servicio)}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#0d5638] hover:bg-[#062e20] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-sm cursor-pointer hover:shadow-md"
                      >
                        Añadir al Carrito
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* cartitas de hoteles en servicios pagina */}
        <div className="bg-[#f7f9f7] rounded-3xl p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 border border-neutral-100">

          {/* caratita 1 */}
          <div className="flex gap-4 items-start border-b sm:border-b-0 pb-4 sm:pb-0 sm:border-r border-neutral-200/60 last:border-0 pr-4">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-neutral-100 text-[#0d5638] flex items-center justify-center flex-shrink-0">
              <Building className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="font-bold text-[#062e20] text-sm sm:text-base">Instalaciones premium</h4>
              <p className="text-neutral-500 text-xs sm:text-sm font-light mt-0.5">Habitaciones amplias con el mejor confort.</p>
            </div>
          </div>

          {/* caratita 2  */}
          <div className="flex gap-4 items-start border-b sm:border-b-0 pb-4 sm:pb-0 lg:border-r border-neutral-200/60 last:border-0 pr-4">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-neutral-100 text-[#0d5638] flex items-center justify-center flex-shrink-0">
              <Waves className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="font-bold text-[#062e20] text-sm sm:text-base">Ubicación ideal</h4>
              <p className="text-neutral-500 text-xs sm:text-sm font-light mt-0.5">Cerca de destinos turísticos y financieros.</p>
            </div>
          </div>

          {/* caratita 3  */}
          <div className="flex gap-4 items-start border-b sm:border-b-0 pb-4 sm:pb-0 sm:border-r border-neutral-200/60 last:border-0 pr-4">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-neutral-100 text-[#0d5638] flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="font-bold text-[#062e20] text-sm sm:text-base">Tarifa garantizada</h4>
              <p className="text-neutral-500 text-xs sm:text-sm font-light mt-0.5">Sin costos ocultos ni sorpresas.</p>
            </div>
          </div>

          {/* caratita 4 */}
          <div className="flex gap-4 items-start last:border-0">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-neutral-100 text-[#0d5638] flex items-center justify-center flex-shrink-0">
              <Headphones className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="font-bold text-[#062e20] text-sm sm:text-base">Soporte 24/7</h4>
              <p className="text-neutral-500 text-xs sm:text-sm font-light mt-0.5">Atención personalizada en cualquier momento.</p>
            </div>
          </div>

        </div>

        {/* el cta de la pagina de servicios de hoteles */}
        <div className="relative rounded-3xl overflow-hidden bg-[#051a14] text-white p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-lg">
          {/* imagen de fondo */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200')" }}
          />

          <div className="relative z-10 max-w-xl space-y-4 text-center lg:text-left">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              ¿Planeando tu próximo descanso?
            </h3>
            <p className="text-neutral-300 text-sm sm:text-base font-light">
              Encuentra la habitación perfecta al mejor precio. Reservas garantizadas con cancelación flexible.
            </p>
          </div>

          <div className="relative z-10 flex-shrink-0 w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-[#84cc16] hover:bg-[#72b012] text-white font-extrabold px-8 py-4 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group/cta">
              Reservar ahora
              <ArrowRight className="w-5 h-5 group-hover/cta:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
        {/* toast de confirmacion */}
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
