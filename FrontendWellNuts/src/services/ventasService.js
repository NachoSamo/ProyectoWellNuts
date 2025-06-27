import api from './api';

const getVentas = () => api.get('/ventas');
const getVentaById = (id) => api.get(`/ventas/${id}`);
const crearVenta = (venta) => api.post('/ventas', venta);
const modificarVenta = (id, venta) => api.put(`/ventas/${id}`, venta);
const eliminarVenta = (id) => api.delete(`/ventas/${id}`);

export {
  getVentas,
  getVentaById,
  crearVenta,
  modificarVenta,
  eliminarVenta,
};
