// src/components/ImageCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSavedImages } from '../contexts/SavedImagesContext';
import './ImageCard.css';

function ImageCard({ image }) {
  const { isAuthenticated } = useAuth();
  const { saveImage, unsaveImage, isImageSaved } = useSavedImages();

  const saved = isImageSaved(image.id);

  const handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (saved) {
      unsaveImage(image.id);
    } else {
      saveImage(image.id);
    }
  };

  // NUEVA FUNCIÓN: Maneja el clic del botón "Ver"
  const handleViewClick = (e) => {
    e.preventDefault(); // Prevenir navegación del Link padre
    e.stopPropagation(); // Prevenir propagación a otros elementos
    window.open(image.links.html, '_blank'); // Abre la URL en una nueva pestaña
  };

  return (
    <div className="image-card">
      {/* El Link principal que va a la página de detalle de la imagen */}
      <Link to={`/image/${image.id}`} className="image-link">
        <img src={image.urls.small} alt={image.alt_description || 'Unsplash image'} />
        <div className="overlay">
          <div className="card-actions">
            {isAuthenticated && (
              <button
                className={`save-button ${saved ? 'saved' : ''}`}
                onClick={handleSaveClick}
              >
                {saved ? 'Guardado' : 'Guardar'}
              </button>
            )}
            {/* CAMBIO AQUÍ: Ahora es un <button> en lugar de <a> */}
            <button
              onClick={handleViewClick}
              className="view-button"
            >
              Ver
            </button>
          </div>
          <p className="image-description">{image.alt_description}</p>
        </div>
      </Link>
    </div>
  );
}

export default ImageCard;