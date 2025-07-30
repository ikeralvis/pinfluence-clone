// src/contexts/SavedImagesContext.jsx
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useAuth } from './AuthContext';

export const SavedImagesContext = createContext();

export const SavedImagesProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const [savedImagesMap, setSavedImagesMap] = useState(() => {
    try {
      const storedMap = localStorage.getItem('pinfluence-saved-images');
      return storedMap ? JSON.parse(storedMap) : {};
    } catch (error) {
      console.error("Error al parsear imágenes guardadas desde localStorage:", error);
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('pinfluence-saved-images', JSON.stringify(savedImagesMap));
    } catch (error) {
      console.error("Error al guardar imágenes en localStorage:", error);
    }
  }, [savedImagesMap]);

  const getUserSavedImages = useCallback(() => {
    if (!isAuthenticated || !user) {
      return [];
    }
    return savedImagesMap[user.id] || [];
  }, [isAuthenticated, user, savedImagesMap]);

  const saveImage = (imageId) => {
    if (!isAuthenticated || !user) {
      alert("Debes iniciar sesión para guardar imágenes.");
      return;
    }
    setSavedImagesMap(prevMap => {
      const userSaved = new Set(prevMap[user.id] || []);
      userSaved.add(imageId);
      return {
        ...prevMap,
        [user.id]: Array.from(userSaved)
      };
    });
  };

  const unsaveImage = (imageId) => {
    if (!isAuthenticated || !user) {
      return;
    }
    setSavedImagesMap(prevMap => {
      const userSaved = new Set(prevMap[user.id] || []);
      userSaved.delete(imageId);
      return {
        ...prevMap,
        [user.id]: Array.from(userSaved)
      };
    });
  };

  const isImageSaved = (imageId) => {
    if (!isAuthenticated || !user) {
      return false;
    }
    const userSaved = new Set(savedImagesMap[user.id] || []);
    return userSaved.has(imageId);
  };

  // ¡NUEVA FUNCIÓN PARA BORRAR TODOS LOS PINES DEL USUARIO ACTUAL!
  const clearSavedImages = () => {
    if (!isAuthenticated || !user) {
      alert("Debes iniciar sesión para borrar pines.");
      return;
    }
    if (window.confirm("¿Estás seguro de que quieres borrar TODOS tus pines guardados? Esta acción es irreversible.")) {
      setSavedImagesMap(prevMap => {
        const newMap = { ...prevMap };
        delete newMap[user.id]; // Elimina la entrada completa del usuario
        return newMap;
      });
    }
  };

  const savedImagesContextValue = {
    getUserSavedImages,
    saveImage,
    unsaveImage,
    isImageSaved,
    clearSavedImages, // <-- ¡Exportamos la nueva función!
  };

  return (
    <SavedImagesContext.Provider value={savedImagesContextValue}>
      {children}
    </SavedImagesContext.Provider>
  );
};

export const useSavedImages = () => useContext(SavedImagesContext);