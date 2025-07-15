import api from './api';

// Obtener perfil del usuario autenticado
const getMiPerfil = () => api.get('/usuarios/perfil');

// Actualizar perfil (usa FormData por la foto)
const updateMiPerfil = (formData) =>
  api.put('/usuarios/perfil', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// Cambiar contraseña
const updatePassword = (passwords) => api.put('/usuarios/password', passwords);

export {
  getMiPerfil,
  updateMiPerfil,
  updatePassword,
};
