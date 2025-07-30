// src/components/ImageGrid.jsx
import React from 'react';
import ImageCard from './ImageCard'; // Lo crearemos en breve
import './ImageGrid.css'; // Crearemos este archivo de estilos

function ImageGrid({ images }) {
  return (
    <div className="image-grid">
      {images.map(image => (
        <ImageCard key={image.id} image={image} />
      ))}
    </div>
  );
}

export default ImageGrid;