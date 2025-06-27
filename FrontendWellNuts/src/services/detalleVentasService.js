import api from './api';

const getDetalleVentas = () => api.get('/detalleVentas');
const getDetalleVentaById = (id) => api.get(`/detalleVentas/${id}`);
const crearDetalleVenta = (detalle) => api.post('/detalleVentas', detalle);
const modificarDetalleVenta = (id, detalle) => api.put(`/detalleVentas/${id}`, detalle);
const eliminarDetalleVenta = (id) => api.delete(`/detalleVentas/${id}`);

export {
  getDetalleVentas,
  getDetalleVentaById,
  crearDetalleVenta,
  modificarDetalleVenta,
  eliminarDetalleVenta,
};
