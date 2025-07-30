// src/components/Pagination.jsx
import React from 'react';
import './Pagination.css'; // Asegúrate de crear este archivo para los estilos

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pageNumbers = [];
  // Define cuántas páginas quieres mostrar alrededor de la página actual
  const maxPagesToShow = 7;

  // Lógica para determinar el rango de páginas a mostrar (ej. 1 ... 5 6 [7] 8 9 ... 30)
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  // Ajusta si el rango no cubre maxPagesToShow debido a los límites
  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  // Llena el array con los números de página a mostrar
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination-container">
      {/* Botón para ir a la Primera página */}
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="pagination-button"
      >
        &laquo; Primera
      </button>

      {/* Botón para ir a la página Anterior */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-button"
      >
        &lsaquo; Anterior
      </button>

      {/* Muestra puntos suspensivos si el inicio de las páginas visibles no es la página 1 */}
      {startPage > 1 && (
        <span className="pagination-dots">...</span>
      )}

      {/* Renderiza los botones de números de página */}
      {pageNumbers.map(number => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          // Añade la clase 'active' si es la página actual
          className={`pagination-button ${currentPage === number ? 'active' : ''}`}
        >
          {number}
        </button>
      ))}

      {/* Muestra puntos suspensivos si el final de las páginas visibles no es la última página */}
      {endPage < totalPages && (
        <span className="pagination-dots">...</span>
      )}

      {/* Botón para ir a la página Siguiente */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-button"
      >
        Siguiente &rsaquo;
      </button>

      {/* Botón para ir a la Última página */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="pagination-button"
      >
        Última &raquo;
      </button>
    </div>
  );
}

export default Pagination;