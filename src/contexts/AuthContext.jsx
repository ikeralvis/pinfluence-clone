// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Crear el Contexto
export const AuthContext = createContext();

// 2. Crear el Provider
export const AuthProvider = ({ children }) => {
  // Estado para el usuario. Intentamos cargarlo desde localStorage al inicio.
  // Si no hay usuario en localStorage, el estado inicial es null.
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('pinfluence-user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      return null; // En caso de error, no hay usuario
    }
  });

  // Efecto para guardar el usuario en localStorage cada vez que cambia
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('pinfluence-user', JSON.stringify(user));
      } else {
        localStorage.removeItem('pinfluence-user'); // Si no hay usuario, lo eliminamos
      }
    } catch (error) {
      console.error("Failed to save user to localStorage:", error);
    }
  }, [user]);

  // Funciones para simular login y logout
  const login = (username, password) => {
    // En una app real, aquí harías una llamada a tu backend para autenticar.
    // Por ahora, simulamos un usuario simple.
    if (username && password) { // Validación muy básica
      const simulatedUser = { username: username, id: Date.now() };
      setUser(simulatedUser);
      return true; // Simula éxito
    }
    return false; // Simula fallo
  };

  const logout = () => {
    setUser(null);
  };

  // El valor que se proveerá a los componentes hijos
  const authContextValue = {
    user,
    isAuthenticated: !!user, // Booleano para saber si hay un usuario logueado
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Crear un Custom Hook para consumir el contexto fácilmente
export const useAuth = () => useContext(AuthContext);