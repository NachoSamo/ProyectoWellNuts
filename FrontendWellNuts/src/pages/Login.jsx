import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { register as registerService } from '../services/authService';
import '../styles/Login.css';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const {
    register: registerForm,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
    getValues
  } = useForm();

  const [isLoginView, setIsLoginView] = useState(true);
  const [serverError, setServerError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const [showPasswordRegister, setShowPasswordRegister] = useState(false);

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
      setServerError(error?.response?.data?.msg || 'Error al iniciar sesión.');
    }
  };

  const onRegisterSubmit = async (data) => {
    try {
      setServerError('');
      setRegisterSuccess('');
      await registerService(data);
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
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
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

              <div className="mb-4 position-relative">
                <label className="form-label">Contraseña</label>
                <input
                  type={showPasswordLogin ? 'text' : 'password'}
                  className="search-input w-100"
                  {...register('contraseña', { required: 'La contraseña es obligatoria' })}
                  style={{ paddingRight: '40px' }}
                />
                <button
                  type="button"
                  className="material-icons"
                  onClick={() => setShowPasswordLogin(prev => !prev)}
                  tabIndex={-1}
                  style={{
                    position: 'absolute',
                    top: '50%',                  
                    right: '10px',                  
                    transform: 'translateY(-50%) translateY(15px)', 
                    background: 'none',           
                    border: 'none',               
                    cursor: 'pointer',              
                    lineHeight: '1',                
                    display: 'flex',                
                    alignItems: 'center',           
                    justifyContent: 'center' 
                  }}
                >
                  {showPasswordLogin ? 'visibility_off' : 'visibility'}
                </button>
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
                <label className="form-label">Nombre</label>
                <input
                  className="search-input w-100"
                  {...registerForm('nombre',
                    {
                      required: 'El nombre es obligatorio',
                      pattern: { value: /^[A-Za-z\s]+$/, message: "Solo letras y espacios" },
                      minLength: { value: 2, message: "Mínimo 2 caracteres" }
                    })}
                />
                {registerErrors.nombre && <p className="error-msg">{registerErrors.nombre.message}</p>}
              </div>

              <div className="mb-3">
                <label className="form-label">Apellido</label>
                <input
                  className="search-input w-100"
                  {...registerForm('apellido',
                    {
                      required: 'El apellido es obligatorio',
                      pattern: { value: /^[A-Za-z\s]+$/, message: "Solo letras y espacios" },
                      minLength: { value: 2, message: "Mínimo 2 caracteres" }
                    })}
                />
                {registerErrors.apellido && <p className="error-msg">{registerErrors.apellido.message}</p>}
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="search-input w-100"
                  {...registerForm('email', {
                    required: 'El email es obligatorio',
                    pattern: { value: /^\S+@\S+$/i, message: "Email no válido" }
                  })}
                />
                {registerErrors.email && <p className="error-msg">{registerErrors.email.message}</p>}
              </div>

              <div className="mb-3">
                <label className="form-label">Usuario</label>
                <input
                  className="search-input w-100"
                  {...registerForm('nombre_usuario', { required: 'El nombre de usuario es obligatorio' })}
                />
                {registerErrors.nombre_usuario && <p className="error-msg">{registerErrors.nombre_usuario.message}</p>}
              </div>

              <div className="mb-4 position-relative">
                <label className="form-label">Contraseña</label>
                <input
                  type={showPasswordRegister ? 'text' : 'password'}
                  className="search-input w-100"
                  {...registerForm('contraseña',
                    {
                      required: 'La contraseña es obligatoria',
                      minLength: { value: 6, message: 'Mínimo 6 caracteres' },
                      pattern: {
                        value: /^(?=.*[A-Z])(?=.*\d).+$/,
                        message: 'Debe contener al menos una letra mayúscula y un número'
                      }
                    })}
                />
                <button
                  type="button"
                  className="material-icons"
                  onClick={() => setShowPasswordRegister(prev => !prev)}
                  tabIndex={-1}
                  style={{
                    position: 'absolute',
                    top: '50%',                  
                    right: '10px',                  
                    transform: 'translateY(-50%) translateY(15px)', 
                    background: 'none',           
                    border: 'none',               
                    cursor: 'pointer',              
                    lineHeight: '1',                
                    display: 'flex',                
                    alignItems: 'center',           
                    justifyContent: 'center' 
                  }}
                >
                  {showPasswordRegister ? 'visibility_off' : 'visibility'}
                </button>
                {registerErrors.contraseña && <p className="error-msg">{registerErrors.contraseña.message}</p>}
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
    </div >
  );
};

export default Login;
