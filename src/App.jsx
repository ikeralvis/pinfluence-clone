// src/App.jsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import SearchBar from './components/SearchBar';
import ImageGrid from './components/ImageGrid';
import { useTheme } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext';
import ImageDetailPage from './pages/ImageDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SavedImagesPage from './pages/SavedImagesPage';
import useUnsplashImages from './hooks/useUnsplashImages';
import FilterBar from './components/FilterBar';
import Pagination from './components/Pagination';

function App() {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();

  const {
    images,
    loading,
    error,
    searchTerm,
    handleSearch,
    orientation,
    setOrientation,
    orderBy,
    setOrderBy,
    page,
    totalPages,
    handlePageChange
  } = useUnsplashImages();

  // Función para resetear la búsqueda y volver a la página principal de imágenes random
  const resetSearchAndGoHome = () => {
    handleSearch('random'); // Establece el término de búsqueda a 'random'
    // Opcional: También puedes resetear filtros si lo deseas:
    // setOrientation('');
    // setOrderBy('relevant');
  };

  // Función para limpiar solo la búsqueda actual
  const clearCurrentSearch = () => {
    handleSearch('random'); // Vuelve a las imágenes random
  };

  return (
    <div className="App">
      <header className="App-header">
        <Link to="/" onClick={resetSearchAndGoHome} className="app-title-link">
          <h1>Pinfluence Clone</h1>
        </Link>

        <SearchBar onSearch={handleSearch} />
        <FilterBar
          orientation={orientation}
          setOrientation={setOrientation}
          orderBy={orderBy}
          setOrderBy={setOrderBy}
        />
        <div className="header-actions">
          {isAuthenticated ? (
            <>
              <span className="welcome-message">Hola, {user.username}!</span>
              <Link to="/saved" className="auth-button-header">
                Mis Pines
              </Link>
              <button onClick={logout} className="auth-button-header">
                Cerrar Sesión
              </button>
            </>
          ) : (
            <Link to="/login" className="auth-button-header">
              Iniciar Sesión
            </Link>
          )}
          <button onClick={toggleTheme} className="theme-toggle-button">
            Cambiar a Modo {theme === 'light' ? 'Oscuro' : 'Claro'}
          </button>
        </div>
      </header>

      <main>
        {/* Aquí mostramos el indicador de búsqueda si searchTerm no es 'random' */}
        {searchTerm && searchTerm !== 'random' && (
          <div className="search-indicator-container">
            <p className="search-indicator-text">
              Resultados para: "<span className="search-term-display">{searchTerm}</span>"
            </p>
            <button onClick={clearCurrentSearch} className="clear-search-button">
              Limpiar Búsqueda &times;
            </button>
          </div>
        )}

        <Routes>
          <Route
            path="/"
            element={
              <>
                {error && <p className="error-message">{error}</p>}
                {images.length > 0 && <ImageGrid images={images} />}
                {loading && images.length === 0 && <p className="loading-message">Cargando imágenes...</p>}

                {!loading && images.length > 0 && totalPages > 1 && (
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}

                {!loading && !error && images.length === 0 && searchTerm !== 'random' && (
                  <p className="no-results-message">No se encontraron resultados para "{searchTerm}".</p>
                )}
              </>
            }
          />
          <Route path="/image/:id" element={<ImageDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/saved" element={<SavedImagesPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;