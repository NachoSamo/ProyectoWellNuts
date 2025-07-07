import api from './api';

const obtenerRentabilidadProductos = async () => {
  const res = await api.get('/productos/rentabilidad');
  return res.data; 
};

const getProductos = () => api.get('/productos');
const getProductoById = (id) => api.get(`/productos/${id}`);
const crearProducto = (producto) => api.post('/productos', producto);
const modificarProducto = (id, producto) => api.put(`/productos/${id}`, producto);
const eliminarProducto = (id) => api.delete(`/productos/${id}`);

export {
  getProductos,
  getProductoById,
  crearProducto,
  modificarProducto,
  eliminarProducto,
  obtenerRentabilidadProductos
};
