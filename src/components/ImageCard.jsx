// src/components/ImageCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Necesitamos esto
import { useSavedImages } from '../contexts/SavedImagesContext'; // Necesitamos esto
import './ImageCard.css';

function ImageCard({ image }) {
  const { isAuthenticated } = useAuth();
  const { saveImage, unsaveImage, isImageSaved } = useSavedImages();

  // Comprueba si la imagen ya está guardada por el usuario actual
  const saved = isImageSaved(image.id);

  const handleSaveClick = (e) => {
    e.preventDefault(); // Previene que al hacer clic en el botón se navegue a la página de detalle
    e.stopPropagation(); // Evita que el evento se propague al div padre (que es un Link)

    if (saved) {
      unsaveImage(image.id);
    } else {
      saveImage(image.id);
    }
  };

  return (
    <div className="image-card">
      {/* El Link envuelve toda la tarjeta para ir al detalle */}
      <Link to={`/image/${image.id}`} className="image-link">
        <img src={image.urls.small} alt={image.alt_description || 'Unsplash image'} />
        <div className="overlay">
          <div className="card-actions">
            {/* El botón de Guardar solo se muestra si el usuario está autenticado */}
            {isAuthenticated && (
              <button
                className={`save-button ${saved ? 'saved' : ''}`}
                onClick={handleSaveClick}
              >
                {saved ? 'Guardado' : 'Guardar'}
              </button>
            )}
            {/* Botón para ver la imagen en Unsplash */}
            <a href={image.links.html} target="_blank" rel="noopener noreferrer" className="view-button">
              Ver
            </a>
          </div>
          <p className="image-description">{image.alt_description}</p>
        </div>
      </Link>
    </div>
  );
}

export default ImageCard;