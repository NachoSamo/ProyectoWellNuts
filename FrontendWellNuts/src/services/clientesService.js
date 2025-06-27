import api from './api';

const getClientes = () => api.get('/clientes');
const getClienteById = (id) => api.get(`/clientes/${id}`);
const crearCliente = (cliente) => api.post('/clientes', cliente);
const modificarCliente = (id, cliente) => api.put(`/clientes/${id}`, cliente);
const eliminarCliente = (id) => api.delete(`/clientes/${id}`);

export {
  getClientes,
  getClienteById,
  crearCliente,
  modificarCliente,
  eliminarCliente,
};
