// src/pages/SavedImagesPage.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSavedImages } from '../contexts/SavedImagesContext';
import ImageGrid from '../components/ImageGrid'; // Para mostrar las imágenes
import { useNavigate } from 'react-router-dom';
import './SavedImagesPage.css'; // Estilos para esta página

function SavedImagesPage() {
  const { isAuthenticated } = useAuth();
  const { getUserSavedImages } = useSavedImages(); // Obtenemos la función del contexto
  const navigate = useNavigate();

  const [savedImagesDetails, setSavedImagesDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login'); // Redirige al login si no está autenticado
      return;
    }

    const fetchSavedImageDetails = async () => {
      setLoading(true);
      setError(null);
      const imageIds = getUserSavedImages(); // Obtiene los IDs de las imágenes guardadas

      if (imageIds.length === 0) {
        setSavedImagesDetails([]); // Si no hay IDs, no hay nada que cargar
        setLoading(false);
        return;
      }

      const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
      if (!accessKey) {
        setError('Error: La clave API de Unsplash no está configurada. Asegúrate de tener VITE_UNSPLASH_ACCESS_KEY en tu archivo .env');
        setLoading(false);
        return;
      }

      // Hacemos una petición a la API de Unsplash por cada ID de imagen guardada.
      // OJO: Esto puede consumir tu límite de API rápidamente si guardas muchas imágenes.
      // En una aplicación real, los detalles de las imágenes se guardarían en tu propio backend.
      const fetchPromises = imageIds.map(id =>
        fetch(`https://api.unsplash.com/photos/${id}?client_id=${accessKey}`)
          .then(res => {
            if (!res.ok) {
              console.error(`Fallo al obtener imagen ${id}: Status ${res.status}`);
              return null; // Si una falla, no rompemos todas las promesas
            }
            return res.json();
          })
          .catch(e => {
            console.error(`Error de red al obtener imagen ${id}:`, e);
            return null;
          })
      );

      // Esperamos que todas las promesas se resuelvan
      const results = await Promise.all(fetchPromises);
      // Filtramos cualquier imagen que haya fallado o sea nula
      const validImages = results.filter(img => img !== null);

      setSavedImagesDetails(validImages);
      setLoading(false);
    };

    fetchSavedImageDetails();
  }, [isAuthenticated, getUserSavedImages, navigate]); // Dependencias: user, images guardadas, navegación

  if (loading) {
    return <p className="loading-message">Cargando tus imágenes guardadas...</p>;
  }

  if (error) {
    return <p className="error-message">Error al cargar las imágenes guardadas: {error}</p>;
  }

  if (!isAuthenticated) {
    // Esto es solo un mensaje breve, la redirección ya ocurrió en useEffect
    return <p className="info-message">Por favor, inicia sesión para ver tus imágenes guardadas.</p>;
  }

  if (savedImagesDetails.length === 0) {
    return <p className="info-message">Aún no has guardado ninguna imagen. ¡Explora y guarda algunas!</p>;
  }

  return (
    <div className="saved-images-page">
      <h2>Mis Pines</h2>
      <ImageGrid images={savedImagesDetails} />
    </div>
  );
}

export default SavedImagesPage;