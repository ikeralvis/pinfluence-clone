// src/pages/SavedImagesPage.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSavedImages } from '../contexts/SavedImagesContext';
import ImageGrid from '../components/ImageGrid';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import './SavedImagesPage.css';

function SavedImagesPage() {
  const { isAuthenticated } = useAuth();
  const { getUserSavedImages, clearSavedImages } = useSavedImages();
  const navigate = useNavigate(); // Hook para navegar

  const [savedImagesDetails, setSavedImagesDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchSavedImageDetails = async () => {
      setLoading(true);
      setError(null);
      const imageIds = getUserSavedImages();

      if (imageIds.length === 0) {
        setSavedImagesDetails([]);
        setLoading(false);
        return;
      }

      const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
      if (!accessKey) {
        setError('Error: La clave API de Unsplash no está configurada. Asegúrate de tener VITE_UNSPLASH_ACCESS_KEY en tu archivo .env');
        setLoading(false);
        return;
      }

      const fetchPromises = imageIds.map(id =>
        fetch(`https://api.unsplash.com/photos/${id}?client_id=${accessKey}`)
          .then(res => {
            if (!res.ok) {
              console.error(`Fallo al obtener imagen ${id}: Status ${res.status}`);
              return null;
            }
            return res.json();
          })
          .catch(e => {
            console.error(`Error de red al obtener imagen ${id}:`, e);
            return null;
          })
      );

      const results = await Promise.all(fetchPromises);
      const validImages = results.filter(img => img !== null);

      setSavedImagesDetails(validImages);
      setLoading(false);
    };

    fetchSavedImageDetails();
  }, [isAuthenticated, getUserSavedImages, navigate]);

  const handleClearAllPines = () => {
    clearSavedImages();
    setSavedImagesDetails([]);
  };

  const handleGoBack = () => {
    navigate('/'); // Navega a la ruta principal
  };

  if (loading) {
    return <p className="loading-message">Cargando tus imágenes guardadas...</p>;
  }

  if (error) {
    return <p className="error-message">Error al cargar las imágenes guardadas: {error}</p>;
  }

  if (!isAuthenticated) {
    return <p className="info-message">Por favor, inicia sesión para ver tus imágenes guardadas.</p>;
  }

  return (
    <div className="saved-images-page">
      <div className="saved-images-header-actions"> {/* Contenedor para los botones superiores */}
        <button onClick={handleGoBack} className="back-to-home-button"> {/* Nuevo botón */}
          &lsaquo; Volver al Inicio
        </button>
        <h2>Mis Pines</h2>
        {savedImagesDetails.length > 0 && ( // Muestra el botón de borrar solo si hay pines
          <button onClick={handleClearAllPines} className="clear-pines-button">
            Borrar Todos los Pines
          </button>
        )}
      </div>

      {savedImagesDetails.length > 0 ? (
        <ImageGrid images={savedImagesDetails} />
      ) : (
        <p className="info-message">Aún no has guardado ninguna imagen. ¡Explora y guarda algunas!</p>
      )}
    </div>
  );
}

export default SavedImagesPage;