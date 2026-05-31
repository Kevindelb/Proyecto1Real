import { useEffect, useState } from 'react';
import api from '../api/axios';

/**
 * Controlador de Estado (Model-Controlador) para la obtención y gestión de tours.
 * Encapsula la lógica de fetching a la API y las operaciones de filtrado y ordenado.
 */
export function useTours(initialSortBy = 'recomendados') {
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState(initialSortBy);

  // carga inicial de datos desde la api del backend (modelo)
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await api.get('/servicios');
        const data = response.data.data || response.data;
        
        // filtra por nombres de tipo: paquete_turistico, actividad, excursion
        const tourTypes = ['paquete_turistico', 'actividad', 'excursion'];
        const filtered = data.filter(item => tourTypes.includes(item.tipo_servicio));
        
        setTours(filtered);
        setError(null);
      } catch (err) {
        console.error('Error al obtener tours:', err);
        setError('No se pudieron cargar los tours desde la API.');
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  // Lógica de ordenamiento dinámico
  useEffect(() => {
    let result = [...tours];

    if (sortBy === 'precio_bajo') {
      result.sort((a, b) => parseFloat(a.precio) - parseFloat(b.precio));
    } else if (sortBy === 'precio_alto') {
      result.sort((a, b) => parseFloat(b.precio) - parseFloat(a.precio));
    } else if (sortBy === 'nombre') {
      result.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }

    setFilteredTours(result);
  }, [tours, sortBy]);

  return {
    tours,
    filteredTours,
    loading,
    error,
    sortBy,
    setSortBy
  };
}
