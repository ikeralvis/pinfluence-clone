// src/pages/ImageDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Para obtener el ID de la URL y volver
import './ImageDetailPage.css'; // Estilos para la página de detalle
import ImageGrid from '../components/ImageGrid'; // Para mostrar imágenes relacionadas

function ImageDetailPage() {
  const { id } = useParams(); // Obtiene el ID de la imagen de la URL
  const [image, setImage] = useState(null);
  const [relatedImages, setRelatedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImageDetails = async () => {
      setLoading(true);
      setError(null);
      const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

      if (!accessKey) {
        setError('Error: La clave API de Unsplash no está configurada.');
        setLoading(false);
        return;
      }

      try {
        // Petición para los detalles de la imagen
        const response = await fetch(`https://api.unsplash.com/photos/${id}?client_id=${accessKey}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setImage(data);

        // Petición para imágenes relacionadas (usando el endpoint de búsqueda con tags de la imagen)
        if (data.tags && data.tags.length > 0) {
          const firstTag = data.tags[0].title; // Usamos el primer tag como término de búsqueda
          const relatedResponse = await fetch(`https://api.unsplash.com/search/photos?query=${firstTag}&per_page=10&client_id=${accessKey}`);
          if (!relatedResponse.ok) {
            throw new Error(`HTTP error! status: ${relatedResponse.status}`);
          }
          const relatedData = await relatedResponse.json();
          // Filtra la imagen actual de las relacionadas para no mostrarla dos veces
          setRelatedImages(relatedData.results.filter(img => img.id !== id));
        }

      } catch (e) {
        setError(`Error al cargar los detalles de la imagen: ${e.message}`);
        console.error("Error fetching image details:", e);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchImageDetails();
    }
  }, [id]); // Se re-ejecuta cuando el ID de la URL cambia

  if (loading) return <p className="loading-message">Cargando detalles de la imagen...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!image) return <p className="no-results-message">Imagen no encontrada.</p>;

  return (
    <div className="image-detail-page">
      <Link to="/" className="back-button">← Volver al inicio</Link>

      <div className="detail-card">
        <img src={image.urls.regular} alt={image.alt_description || 'Unsplash Image'} className="detail-image" />
        <div className="detail-info">
          <h2>{image.alt_description || 'Imagen de Unsplash'}</h2>
          <p className="author">Por: <a href={image.user.links.html} target="_blank" rel="noopener noreferrer">{image.user.name}</a></p>
          {image.description && <p className="description">{image.description}</p>}
          <p className="likes">❤️ {image.likes} Me gusta</p>
          <p className="download-link">
            <a href={image.links.download} target="_blank" rel="noopener noreferrer" className="download-button">Descargar</a>
          </p>
          {image.tags && image.tags.length > 0 && (
            <div className="tags">
              <h3>Etiquetas:</h3>
              {image.tags.map(tag => (
                <span key={tag.title} className="tag">{tag.title}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {relatedImages.length > 0 && (
        <div className="related-images-section">
          <h2>Imágenes Relacionadas</h2>
          <ImageGrid images={relatedImages} />
        </div>
      )}
    </div>
  );
}

export default ImageDetailPage;