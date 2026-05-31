import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, DollarSign, Calendar } from 'lucide-react';
import api from '../api/axios';

export function HomeServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/servicios');
        const data = response.data.data || response.data;
        //  filtra los servicios que sean de tipo transporte y toma hasta 4
        const filtered = data.filter(item => item.tipo_servicio === 'transporte').slice(0, 4);
        setServices(filtered);
        setLoading(false);
      } catch (err) {
        console.error('Error al obtener servicios:', err);
        setError('No se pudieron cargar los servicios de la API.');
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  //  obtiene una imagen de respaldo basada en la categoría o destino del servicio
  const getServiceImage = (item) => {
    if (item.imagen_url && item.imagen_url.trim() !== '') {
      return item.imagen_url;
    }
    return 'http://127.0.0.1:8000/storage/servicios/no%20hay%20imagen.webp';
  };

  const getFriendlyTypeLabel = (type) => {
    const labels = {
      paquete_turistico: 'Paquete Turístico',
      hotel: 'Hospedaje / Hotel',
      vuelo: 'Vuelo / Traslado',
      excursion: 'Excursión Guiada',
      transporte: 'Transporte Premium',
      actividad: 'Actividad / Tour',
      otros: 'Servicio Especial'
    };
    return labels[type] || 'Servicio';
  };

  return (
    <section className="py-20 bg-[#fdfdfd]" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-8">

        {/* encabezado */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-widest text-[#0d5638] uppercase">
                NUESTROS SERVICIOS
              </span>
              <div className="w-10 h-[2px] bg-[#84cc16]" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold text-[#062e20] leading-tight mt-2">
              Servicios diseñados para ti
            </h2>
          </div>
          <div>
            <Link
              to="/services"
              className="text-[#0d5638] hover:text-[#84cc16] font-bold text-sm sm:text-base inline-flex items-center gap-2 group transition-colors duration-300 border-b-2 border-transparent hover:border-[#84cc16] pb-1"
            >
              Ver todos los servicios
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-350" />
            </Link>
          </div>
        </div>

        {/*skeleton   */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-neutral-100 p-4 space-y-4 animate-pulse">
                <div className="bg-neutral-200 h-48 w-full rounded-xl" />
                <div className="h-6 bg-neutral-200 rounded w-2/3" />
                <div className="h-4 bg-neutral-200 rounded w-full" />
                <div className="h-4 bg-neutral-200 rounded w-5/6" />
                <div className="flex justify-between items-center pt-4">
                  <div className="h-6 bg-neutral-200 rounded w-1/3" />
                  <div className="h-8 bg-neutral-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* si hay error  */}
        {error && !loading && (
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center max-w-2xl mx-auto shadow-xs border border-red-100">
            <p className="font-semibold">{error}</p>
            <p className="text-xs text-red-500 mt-2">Mostrando servicios sugeridos a continuación como alternativa.</p>
          </div>
        )}

        {/* si no hay servicios */}
        {!loading && !error && services.length === 0 && (
          <div className="text-center text-neutral-500 py-12">
            No hay servicios de transporte disponibles en este momento.
          </div>
        )}

        {/* grid de servicios */}
        {!loading && services.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, idx) => (
              <Link
                to="/services"
                key={idx}
                className="bg-white rounded-2xl overflow-hidden border border-neutral-100 shadow-xs hover:shadow-xl transition-all duration-500 flex flex-col group transform hover:-translate-y-1"
              >
                {/* imagen  */}
                <div className="relative h-56 w-full overflow-hidden">
                  <img
                    src={getServiceImage(service)}
                    alt={service.nombre}
                    className="w-full h-full object-cover group-hover:scale-108 transition-all duration-700 ease-out"
                  />
                  {/* degradado oscuro en la parte inferior */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* badge de ubicacion  */}
                  {service.destino && (
                    <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-xs rounded-full px-3 py-1 flex items-center gap-1 text-[11px] font-bold text-white">
                      <MapPin className="w-3 h-3 text-[#84cc16] fill-[#84cc16]" />
                      {service.destino}
                    </div>
                  )}

                  {/* badge de categoria */}
                  <div className="absolute top-3 right-3 bg-[#0d5638]/90 text-[10px] text-white font-extrabold uppercase px-2.5 py-1 rounded-md tracking-wider">
                    {getFriendlyTypeLabel(service.tipo_servicio)}
                  </div>
                </div>

                {/* texto  */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-[#062e20] leading-tight group-hover:text-[#84cc16] transition-colors duration-300 line-clamp-1">
                      {service.nombre}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-light line-clamp-2">
                      {service.descripcion || "Disfruta de este servicio exclusivo diseñado para brindarte la mejor experiencia en tu viaje."}
                    </p>
                  </div>

                  {/* texto  */}
                  <div className="pt-4 border-t border-neutral-50 flex items-center justify-between">
                    <div className="flex items-center text-xs font-light text-neutral-500 gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#84cc16]" />
                      <span>{service.duracion_dias > 0 ? `${service.duracion_dias} días` : '1 día'}</span>
                    </div>
                    <div className="flex items-center text-[#0d5638] font-black text-lg">
                      <DollarSign className="w-4 h-4 -mr-0.5" />
                      <span>{parseFloat(service.precio).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs sm:text-sm font-extrabold text-[#0d5638] group-hover:text-[#84cc16] transition-colors duration-300">
                    Reservar
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
