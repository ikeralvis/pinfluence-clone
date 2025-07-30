// src/pages/LoginPage.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './AuthPage.css'; // Usaremos un CSS compartido para AuthPage

function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    const success = login(data.username, data.password);
    if (success) {
      navigate('/'); // Redirige al inicio si el login es exitoso
    } else {
      alert('Credenciales incorrectas. Intenta con cualquier nombre de usuario y contraseña.');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
        <h2>Iniciar Sesión</h2>
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
            {...register('password', { required: 'La contraseña es requerida' })}
          />
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </div>
        <button type="submit" className="auth-button">Iniciar Sesión</button>
        <p className="auth-link-text">
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;