import api from './api';

const getVariedades = () => api.get('/variedadProducto');
const getVariedadById = (id) => api.get(`/variedadProducto/${id}`);
const crearVariedad = (data) => api.post('/variedadProducto', data);
const modificarVariedad = (id, data) => api.put(`/variedadProducto/${id}`, data);
const eliminarVariedad = (id) => api.delete(`/variedadProducto/${id}`);

export {
  getVariedades,
  getVariedadById,
  crearVariedad,
  modificarVariedad,
  eliminarVariedad,
};
