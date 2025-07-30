// src/contexts/ThemeContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Intentar cargar el tema desde localStorage o usar 'light' por defecto
    return localStorage.getItem('pinfluence-theme') || 'light'; // <-- 'light' es el DEFAULT
  });

  // ESTE ES EL EFECTO CLAVE: Aplica la clase al <body>
  useEffect(() => {
    localStorage.setItem('pinfluence-theme', theme);
    document.body.className = theme + '-theme'; // <-- Esto aplica 'light-theme' o 'dark-theme'
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);