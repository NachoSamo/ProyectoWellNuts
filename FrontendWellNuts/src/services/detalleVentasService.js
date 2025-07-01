import api from './api';

const getDetalleVentas = () => api.get('/detalleVentas');
const getDetalleVentaById = (id) => api.get(`/detalleVentas/${id}`);
const crearDetalleVenta = (data) => api.post('/detalleVentas', data);
const modificarDetalleVenta = (id, data) => api.put(`/detalleVentas/${id}`, data);
const eliminarDetalleVenta = (id) => api.delete(`/detalleVentas/${id}`);
const getDetallesPorVenta = (id_venta) => api.get(`/detalleVentas/por-venta/${id_venta}`);


export {
  getDetalleVentas,
  getDetalleVentaById,
  crearDetalleVenta,
  modificarDetalleVenta,
  eliminarDetalleVenta,
  getDetallesPorVenta,
};
