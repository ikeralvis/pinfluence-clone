// src/pages/RegisterPage.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './AuthPage.css'; // Usaremos un CSS compartido para AuthPage

function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth(); // Usamos login para "registrar" y loguear al mismo tiempo
  const navigate = useNavigate();

  const onSubmit = (data) => {
    // En una app real, aquí enviarías los datos a tu backend para crear el usuario.
    // Por ahora, simplemente "registramos" y logueamos al usuario con la función login simulada.
    const success = login(data.username, data.password);
    if (success) {
      alert(`Usuario ${data.username} registrado y logueado con éxito (simulado)!`);
      navigate('/'); // Redirige al inicio
    } else {
      alert('Error al registrar. Intenta de nuevo.');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
        <h2>Registrarse</h2>
        <div className="form-group">
          <label htmlFor="username">Usuario:</label>
          <input
            type="text"
            id="username"
            {...register('username', { required: 'El usuario es requerido' })}
          />
          {errors.username && <p className="error-message">{errors.username.message}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            {...register('password', { required: 'La contraseña es requerida', minLength: { value: 6, message: 'Mínimo 6 caracteres' } })}
          />
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </div>
        <button type="submit" className="auth-button">Registrarse</button>
        <p className="auth-link-text">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;