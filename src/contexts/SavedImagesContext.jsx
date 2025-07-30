// src/contexts/SavedImagesContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext'; // Necesitamos el usuario actual para saber quién guarda qué

// 1. Crea el Contexto
export const SavedImagesContext = createContext();

// 2. Crea el Provider que gestionará el estado y la lógica
export const SavedImagesProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth(); // Obtén el usuario actual del AuthContext

  // `savedImagesMap` será un objeto donde la clave es el ID del usuario
  // y el valor es un array de IDs de imágenes guardadas por ese usuario.
  const [savedImagesMap, setSavedImagesMap] = useState(() => {
    try {
      const storedMap = localStorage.getItem('pinfluence-saved-images');
      // Intenta parsear el JSON; si hay un error (ej. datos corruptos), inicia con un objeto vacío
      return storedMap ? JSON.parse(storedMap) : {};
    } catch (error) {
      console.error("Error al parsear imágenes guardadas desde localStorage:", error);
      return {}; // En caso de error, inicializa vacío
    }
  });

  // Guarda `savedImagesMap` en `localStorage` cada vez que cambia
  useEffect(() => {
    try {
      localStorage.setItem('pinfluence-saved-images', JSON.stringify(savedImagesMap));
    } catch (error) {
      console.error("Error al guardar imágenes en localStorage:", error);
    }
  }, [savedImagesMap]);

  // Función para obtener las imágenes guardadas del usuario actual
  // Usamos useCallback para memoizar esta función, útil si la pasamos como dependencia
  const getUserSavedImages = React.useCallback(() => {
    if (!isAuthenticated || !user) {
      return []; // Si no hay usuario o no está autenticado, devuelve un array vacío
    }
    // Devuelve el array de IDs de imágenes para el usuario actual, o un array vacío si no hay
    return savedImagesMap[user.id] || [];
  }, [isAuthenticated, user, savedImagesMap]); // Dependencias para useCallback

  // Función para guardar una imagen por su ID
  const saveImage = (imageId) => {
    if (!isAuthenticated || !user) {
      alert("Debes iniciar sesión para guardar imágenes.");
      return;
    }
    setSavedImagesMap(prevMap => {
      // Usa un `Set` para asegurar IDs únicos y evitar duplicados
      const userSaved = new Set(prevMap[user.id] || []);
      userSaved.add(imageId); // Añade el nuevo ID de imagen

      return {
        ...prevMap, // Copia el mapa existente
        [user.id]: Array.from(userSaved) // Actualiza el array de IDs para el usuario
      };
    });
  };

  // Función para desguardar una imagen por su ID
  const unsaveImage = (imageId) => {
    if (!isAuthenticated || !user) {
      return; // No se puede desguardar si no hay usuario
    }
    setSavedImagesMap(prevMap => {
      const userSaved = new Set(prevMap[user.id] || []);
      userSaved.delete(imageId); // Elimina el ID de imagen
      return {
        ...prevMap,
        [user.id]: Array.from(userSaved)
      };
    });
  };

  // Función para verificar si una imagen específica ya está guardada
  const isImageSaved = (imageId) => {
    if (!isAuthenticated || !user) {
      return false;
    }
    const userSaved = new Set(savedImagesMap[user.id] || []);
    return userSaved.has(imageId);
  };

  // Valor que se proveerá a los componentes hijos que consuman este contexto
  const savedImagesContextValue = {
    getUserSavedImages, // Asegúrate de que esta función está aquí
    saveImage,
    unsaveImage,
    isImageSaved,
  };

  return (
    <SavedImagesContext.Provider value={savedImagesContextValue}>
      {children}
    </SavedImagesContext.Provider>
  );
};

// 3. Crea un Custom Hook para consumir el contexto fácilmente en cualquier componente
export const useSavedImages = () => useContext(SavedImagesContext);