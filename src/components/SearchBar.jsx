// src/components/SearchBar.jsx
import React from 'react';
import { useForm } from 'react-hook-form'; // <-- Importa useForm
import './SearchBar.css';

function SearchBar({ onSearch }) {
  // Inicializa useForm. 'register' es para registrar inputs, 'handleSubmit' para manejar el submit.
  // 'formState: { errors }' es para la validación, aunque por ahora no la usaremos.
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      searchQuery: '' // Define un valor por defecto para el campo de búsqueda
    }
  });

  // Esta función se ejecutará cuando el formulario se envíe y pase las validaciones (si las hubiera).
  const onSubmit = (data) => {
    // 'data' contendrá un objeto con los valores del formulario, ej: { searchQuery: "valor del input" }
    const searchTerm = data.searchQuery.trim();
    if (searchTerm) {
      onSearch(searchTerm); // Llama a la prop onSearch con el término
    } else {
      onSearch('random'); // Si está vacío, vuelve a 'random'
    }
    reset(); // Opcional: Limpia el input después de la búsqueda
  };

  return (
    // Usa handleSubmit de react-hook-form para envolver tu función onSubmit
    <form className="search-bar" onSubmit={handleSubmit(onSubmit)}>
      <input
        type="text"
        placeholder="Busca imágenes..."
        // Usa la función 'register' para registrar este input en React Hook Form
        // 'searchQuery' será el nombre de este campo en el objeto 'data'
        {...register('searchQuery')}
      />
      <button type="submit">Buscar</button>
    </form>
  );
}

export default SearchBar;