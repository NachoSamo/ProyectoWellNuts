import api from './api';


const getVentas = () => api.get('/ventas');
const getVentaById = (id) => api.get(`/ventas/${id}`);
const crearVenta = (data) => api.post('/ventas', data);
const modificarVenta = (id, data) => api.put(`/ventas/${id}`, data);
const eliminarVenta = (id) => api.delete(`/ventas/${id}`);
const cambiarEstadoPagado = (id, pagado) => api.put(`/ventas/${id}`, { pagado });
const crearVentaConDetalles = (data) => api.post('/ventas/completa', data);
const actualizarEstadoPagado = (id_venta) => api.patch(`/ventas/${id_venta}/pagado`);



export {
  getVentas,
  getVentaById,
  crearVenta,
  modificarVenta,
  eliminarVenta,
  cambiarEstadoPagado, 
  crearVentaConDetalles,
  actualizarEstadoPagado
};
