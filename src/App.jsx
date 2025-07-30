// src/App.jsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css'; // Estilos generales
import SearchBar from './components/SearchBar';
import ImageGrid from './components/ImageGrid';
import { useTheme } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext';
import ImageDetailPage from './pages/ImageDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SavedImagesPage from './pages/SavedImagesPage'; // Asegúrate de que esta importación esté
import useUnsplashImages from './hooks/useUnsplashImages';
import FilterBar from './components/FilterBar';
import Pagination from './components/Pagination'; // Asegúrate de que esta importación esté

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

  return (
    <div className="App">
      <header className="App-header">
        <h1>Pinfluence Clone</h1>
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
              {/* ENLACE A MIS PINES: Solo se muestra si el usuario está autenticado */}
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
        <Routes>
          <Route
            path="/"
            element={
              <>
                {error && <p className="error-message">{error}</p>}
                {/* La cuadrícula de imágenes */}
                {images.length > 0 && <ImageGrid images={images} />}
                {loading && images.length === 0 && <p className="loading-message">Cargando imágenes...</p>}

                {/* PAGINACIÓN: Solo se muestra si no está cargando, hay imágenes y más de una página */}
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
          {/* RUTA A MIS PINES */}
          <Route path="/saved" element={<SavedImagesPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;