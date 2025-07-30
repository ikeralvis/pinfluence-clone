// src/hooks/useUnsplashImages.js
import { useState, useEffect, useCallback } from 'react'; // Eliminamos 'useRef' ya que no usaremos IntersectionObserver

const useUnsplashImages = () => {
  const [images, setImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('random');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Página actual, inicia en 1
  // Eliminamos la ref 'loader' aquí: const loader = useRef(null);
  const [orientation, setOrientation] = useState('');
  const [orderBy, setOrderBy] = useState('relevant');
  const [totalPages, setTotalPages] = useState(1); // <-- ¡Nuevo estado para el número total de páginas!

  // `fetchImages` ahora es responsable de cargar una página específica
  const fetchImages = useCallback(async () => {
    // Ya no necesitamos la condición `if (loading && page > 1) return;`
    // porque la paginación es explícita y controlada por el usuario.

    setLoading(true);
    setError(null); // Limpiamos errores anteriores

    const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      setError('Error: La clave API de Unsplash no está configurada. Asegúrate de tener VITE_UNSPLASH_ACCESS_KEY en tu archivo .env');
      setLoading(false);
      return;
    }

    try {
      let url;
      const queryParams = new URLSearchParams();
      queryParams.append('page', page); // Usamos la página actual
      queryParams.append('per_page', 30); // Número de imágenes por página
      queryParams.append('client_id', accessKey);

      if (orientation) {
        queryParams.append('orientation', orientation);
      }
      if (orderBy) {
        queryParams.append('order_by', orderBy);
      }

      if (searchTerm && searchTerm !== 'random') {
        url = `https://api.unsplash.com/search/photos?query=${searchTerm}&${queryParams.toString()}`;
      } else {
        // Para la API /photos, 'relevant' no es una opción para order_by. Usamos 'popular' en su lugar si se elige 'relevant'.
        if (orderBy === 'relevant') {
          queryParams.set('order_by', 'popular');
        }
        url = `https://api.unsplash.com/photos?${queryParams.toString()}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorData.errors ? errorData.errors.join(', ') : 'Unknown API error.'}`);
      }
      const data = await response.json();

      const newlyFetchedImages = searchTerm && searchTerm !== 'random' ? data.results : data;
      
      // La API de Unsplash devuelve el total de resultados en diferentes lugares
      const totalItems = searchTerm && searchTerm !== 'random' ? data.total : parseInt(response.headers.get('x-total') || 0);
      
      // Calculamos el número total de páginas
      const calculatedTotalPages = Math.ceil(totalItems / queryParams.get('per_page'));
      // Aseguramos que siempre haya al menos 1 página
      setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);

      // ¡Importante!: Con paginación, siempre reemplazamos el array de imágenes con las de la nueva página.
      setImages(Array.isArray(newlyFetchedImages) ? newlyFetchedImages : []);

    } catch (e) {
      setError(`Error al cargar las imágenes: ${e.message}`);
      console.error("Error fetching images:", e);
      setImages([]); // Limpia las imágenes si hay un error
      setTotalPages(1); // Resetea totalPages a 1 en caso de error
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, orientation, orderBy]); // Dependencias de useCallback

  // Este useEffect se encargará de llamar a fetchImages cuando cambien los filtros o el término de búsqueda,
  // y **reseteará la página a 1** para una nueva búsqueda/filtro.
  useEffect(() => {
    setPage(1); // Siempre vuelve a la primera página con una nueva búsqueda o filtro
    fetchImages(); // Llama a la función para cargar imágenes
  }, [searchTerm, orientation, orderBy, fetchImages]); // Asegúrate de que fetchImages está aquí


  // Función para manejar la búsqueda (llamada desde SearchBar)
  const handleSearch = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
  };

  // Función para cambiar de página (llamada desde el componente Pagination)
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      // Opcional: Scroll al inicio de la página al cambiar de página
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return {
    images,
    loading,
    error,
    searchTerm,
    handleSearch,
    // loader, // Ya no se exporta loader
    orientation,
    setOrientation,
    orderBy,
    setOrderBy,
    page,          // <-- ¡Exportamos la página actual!
    totalPages,    // <-- ¡Exportamos el total de páginas!
    handlePageChange // <-- ¡Exportamos la función para cambiar de página!
  };
};

export default useUnsplashImages;