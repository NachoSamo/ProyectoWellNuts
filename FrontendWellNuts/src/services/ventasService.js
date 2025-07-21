import api from './api';

const getVentas = () => api.get('/ventas');
// Se cambia el endpoint para obtener todas las ventas por cliente, que se utilizará para el gráfico de pastel y para calcular el top histórico.
const getTotalVentasPorCliente = () => api.get('/ventas/ranking/clientes');
const getTopClienteMes = () => api.get('/ventas/ranking/cliente-mes');
const getVentaById = (id) => api.get(`/ventas/${id}`);
const crearVenta = (data) => api.post('/ventas', data);
const modificarVenta = (id, data) => api.put(`/ventas/${id}`, data);
const eliminarVenta = (id) => api.delete(`/ventas/${id}`);
const cambiarEstadoPagado = (id, pagado) => api.put(`/ventas/${id}`, { pagado });
const crearVentaConDetalles = (data) => api.post('/ventas/completa', data);
const actualizarEstadoPagado = (id_venta) => api.patch(`/ventas/${id_venta}/pagado`);
const getVentasMensuales = () => api.get('/ventas/mensual');

export {
  getVentas,
  getVentaById,
  crearVenta,
  modificarVenta,
  eliminarVenta,
  cambiarEstadoPagado,
  crearVentaConDetalles,
  actualizarEstadoPagado,
  getVentasMensuales,
  // getTopClienteHistorico no se exporta directamente ya que se calculará en el frontend
  getTopClienteMes,
  getTotalVentasPorCliente 
};