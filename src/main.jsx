// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { SavedImagesProvider } from './contexts/SavedImagesContext.jsx'; // ¡Esta es importante!
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        {/* AuthProvider DEBE ir antes de SavedImagesProvider porque SavedImagesProvider lo usa */}
        <AuthProvider>
          <SavedImagesProvider> {/* ¡Este es el que provee la lógica de guardado! */}
            <App />
          </SavedImagesProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);