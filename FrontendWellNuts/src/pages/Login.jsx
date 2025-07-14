// En: src/pages/Login.jsx

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { register as registerService } from '../services/authService';
import '../styles/Login.css'; 

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { register: registerForm, handleSubmit: handleRegisterSubmit, formState: { errors: registerErrors } } = useForm();

  const [isLoginView, setIsLoginView] = useState(true);
  const [serverError, setServerError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const onLoginSubmit = async (data) => {
    try {
      setServerError('');
      await login(data);
    } catch (error) {
      setServerError(error.response?.data?.msg || 'Error al iniciar sesión.');
    }
  };

  const onRegisterSubmit = async (data) => {
    try {
      setServerError('');
      setRegisterSuccess('');
      await registerService({ nombre_usuario: data.nombre_usuario_reg, contraseña: data.contraseña_reg });
      setRegisterSuccess('¡Usuario registrado con éxito! Ahora puedes iniciar sesión.');
      setIsLoginView(true);
    } catch (error) {
      setServerError(error.response?.data?.msg || 'Error al registrar el usuario.');
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setServerError('');
    setRegisterSuccess('');
  };

  return (
    <div className="login-page-wrapper">
      <div className="glass-container login-form-container">
        {isLoginView ? (
          <>
            <h2 className="title-glass mb-4">Iniciar Sesión</h2>
            <form onSubmit={handleSubmit(onLoginSubmit)}>
              <div className="mb-3">
                <label className="form-label">Usuario</label>
                <input
                  className="search-input w-100"
                  {...register('nombre_usuario', { required: 'El nombre de usuario es obligatorio' })}
                />
                {errors.nombre_usuario && <p className="error-msg">{errors.nombre_usuario.message}</p>}
              </div>
              <div className="mb-4">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  className="search-input w-100"
                  {...register('contraseña', { required: 'La contraseña es obligatoria' })}
                />
                {errors.contraseña && <p className="error-msg">{errors.contraseña.message}</p>}
              </div>

              {serverError && <p className="error-msg text-center mb-3">{serverError}</p>}
              {registerSuccess && <p className="success-msg text-center mb-3">{registerSuccess}</p>}

              <button type="submit" className="btn-create w-100">Ingresar</button>
            </form>
            <p className="mt-4 text-center toggle-text">
              ¿No tienes cuenta? <span onClick={toggleView} className="toggle-link">Regístrate aquí</span>
            </p>
          </>
        ) : (
          <>
            <h2 className="title-glass mb-4">Registrarse</h2>
            <form onSubmit={handleRegisterSubmit(onRegisterSubmit)}>
              <div className="mb-3">
                <label className="form-label">Usuario</label>
                <input
                  className="search-input w-100"
                  {...registerForm('nombre_usuario_reg', { required: 'El nombre de usuario es obligatorio' })}
                />
                {registerErrors.nombre_usuario_reg && <p className="error-msg">{registerErrors.nombre_usuario_reg.message}</p>}
              </div>
              <div className="mb-4">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  className="search-input w-100"
                  {...registerForm('contraseña_reg', { required: 'La contraseña es obligatoria', minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' } })}
                />
                {registerErrors.contraseña_reg && <p className="error-msg">{registerErrors.contraseña_reg.message}</p>}
              </div>

              {serverError && <p className="error-msg text-center mb-3">{serverError}</p>}

              <button type="submit" className="btn-create w-100">Registrar</button>
            </form>
            <p className="mt-4 text-center toggle-text">
              ¿Ya tienes una cuenta? <span onClick={toggleView} className="toggle-link">Inicia sesión</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;