import apiClient from './api'; // Renombré 'api' a 'apiClient' para ser más claro, ajusta si es necesario

const getMiPerfil = async () => {
  // Desestructuramos para obtener 'data' directamente de la respuesta
  const { data } = await apiClient.get('/usuarios/perfil');
  return data; // Devolvemos solo los datos del perfil
};

// Actualizar perfil (usa FormData por la foto)
const updateMiPerfil = async (formData) => {
  const { data } = await apiClient.put('/usuarios/perfil', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

// Cambiar contraseña
const updatePassword = async (passwords) => {
  const { data } = await apiClient.put('/usuarios/password', passwords);
  return data;
};

export {
  getMiPerfil,
  updateMiPerfil,
  updatePassword,
};