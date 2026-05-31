import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Calendar, DollarSign } from 'lucide-react';
import api from '../api/axios';

export function PopularDestinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await api.get('/servicios');
        const data = response.data.data || response.data;
        //filtra solo los de tipo 'actividad' o 'paquete_turistico' y toma hasta 4
        const filtered = data.filter(item =>
          item.tipo_servicio === 'actividad' || item.tipo_servicio === 'paquete_turistico'
        ).slice(0, 4);
        setDestinations(filtered);
        setLoading(false);
      } catch (err) {
        console.error('Error al obtener destinos populares:', err);
        setError('No se pudieron cargar los destinos de la API.');
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  // ayuda para obtener una imagen de respaldo hermosa basada en el nombre del destino o la categoría
  const getDestinationImage = (item) => {
    if (item.imagen_url && item.imagen_url.trim() !== '') {
      return item.imagen_url;
    }
    return 'http://127.0.0.1:8000/storage/servicios/no%20hay%20imagen.webp';
  };

  const getFriendlyTypeLabel = (type) => {
    return type === 'paquete_turistico' ? 'Paquete Exclusivo' : 'Actividad / Tour';
  };

  return (
    <section className="py-20 bg-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-8">

        {/* bloque de encabezado */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-widest text-[#0d5638] uppercase">
                DESTINOS POPULARES
              </span>
              <div className="w-10 h-[2px] bg-[#84cc16]" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold text-[#062e20] leading-tight mt-2">
              Lugares que te enamorarán
            </h2>
          </div>
          <div>
            <Link
              to="/tours"
              className="text-[#0d5638] hover:text-[#84cc16] font-bold text-sm sm:text-base inline-flex items-center gap-2 group transition-colors duration-300 border-b-2 border-transparent hover:border-[#84cc16] pb-1"
            >
              Ver todos los destinos
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-350" />
            </Link>
          </div>
        </div>

        {/* Carga de imágenes  */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-neutral-100 p-4 space-y-4 animate-pulse">
                <div className="bg-neutral-200 h-56 w-full rounded-xl" />
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

        {/* error handler  */}
        {error && !loading && (
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center max-w-2xl mx-auto shadow-xs border border-red-100">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Estado vacío */}
        {!loading && !error && destinations.length === 0 && (
          <div className="text-center text-neutral-500 py-12">
            No hay paquetes turísticos ni actividades disponibles en este momento.
          </div>
        )}

        {/* grid de las cartas */}
        {!loading && destinations.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {destinations.map((dest, idx) => (
              <Link
                to="/tours"
                key={idx}
                className="bg-white rounded-2xl overflow-hidden border border-neutral-100 shadow-xs hover:shadow-xl transition-all duration-500 flex flex-col group transform hover:-translate-y-1"
              >
                {/* bloque de imagen  */}
                <div className="relative h-56 w-full overflow-hidden">
                  <img
                    src={getDestinationImage(dest)}
                    alt={dest.nombre}
                    className="w-full h-full object-cover group-hover:scale-108 transition-all duration-700 ease-out"
                  />
                  {/* degradado oscuro de fondo */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* etiqueta de ubicacion  */}
                  {dest.destino && (
                    <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-xs rounded-full px-3 py-1 flex items-center gap-1 text-[11px] font-bold text-white">
                      <MapPin className="w-3 h-3 text-[#84cc16] fill-[#84cc16]" />
                      {dest.destino}
                    </div>
                  )}

                  {/* etiqueta de tipo de servicio */}
                  <div className="absolute top-3 right-3 bg-[#0d5638]/90 text-[10px] text-white font-extrabold uppercase px-2.5 py-1 rounded-md tracking-wider">
                    {getFriendlyTypeLabel(dest.tipo_servicio)}
                  </div>
                </div>

                {/* bloque de texto  */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-[#062e20] group-hover:text-[#84cc16] transition-colors duration-300 line-clamp-1">
                      {dest.nombre}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-500 mt-2 leading-relaxed font-light line-clamp-2">
                      {dest.descripcion || "Explora este increíble destino turístico con guías profesionales y experiencias inolvidables."}
                    </p>
                  </div>

                  {/* precio y duración */}
                  <div className="pt-4 border-t border-neutral-50 flex items-center justify-between">
                    <div className="flex items-center text-xs font-light text-neutral-500 gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#84cc16]" />
                      <span>{dest.duracion_dias > 0 ? `${dest.duracion_dias} días` : '1 día'}</span>
                    </div>
                    <div className="flex items-center text-[#0d5638] font-black text-lg">
                      <DollarSign className="w-4 h-4 -mr-0.5" />
                      <span>{parseFloat(dest.precio).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs sm:text-sm font-extrabold text-[#0d5638] group-hover:text-[#84cc16] transition-colors duration-300">
                    Explorar
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
