import React from 'react';
import './FilterBar.css'; // Asegúrate de tener un archivo CSS para estilos

function FilterBar({ orientation, setOrientation, orderBy, setOrderBy }) {
    const handleOrientationChange = (event) => {
        setOrientation(event.target.value);
    }
    const handleOrderByChange = (event) => {
        setOrderBy(event.target.value);
    }

    return (
    <div className="filter-bar">
      <div className="filter-group">
        <label htmlFor="orientation-select">Orientación:</label>
        <select
          id="orientation-select"
          value={orientation}
          onChange={handleOrientationChange}
          className="filter-select"
        >
          <option value="">Cualquiera</option>
          <option value="landscape">Horizontal</option>
          <option value="portrait">Vertical</option>
          <option value="squarish">Cuadrada</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="order-by-select">Ordenar por:</label>
        <select
          id="order-by-select"
          value={orderBy}
          onChange={handleOrderByChange}
          className="filter-select"
        >
          <option value="relevant">Relevancia</option> {/* Por defecto en búsqueda */}
          <option value="latest">Recientes</option>
          <option value="popular">Popular</option>
        </select>
      </div>
    </div>
  );
}

export default FilterBar;

