import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import FormularioClientes from '../components/forms/FormularioCliente';
import ConfirmModal from '../components/ConfirmModal'; 
import '../styles/glass.css';

const Clientes = () => {
  const { user } = useAuth();
  const [clientes, setClientes] = useState([]);
  const [modoFormulario, setModoFormulario] = useState(null);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [filtro, setFiltro] = useState('');

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemParaEliminar, setItemParaEliminar] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const cargarClientes = useCallback(() => {
    api.get('/clientes')
      .then(res => setClientes(res.data))
      .catch(err => console.error('Error al cargar clientes:', err));
  }, []);

  useEffect(() => {
    cargarClientes();
  }, [cargarClientes]);

  const onSubmit = data => {
    const metodo = modoFormulario === 'crear'
      ? api.post('/clientes', data)
      : api.put(`/clientes/${clienteEditando.id_cliente}`, data);

    metodo.then(() => {
      cargarClientes();
      cancelarFormulario();
    }).catch(err => console.error('Error al guardar cliente:', err));
  };

  const editarCliente = cliente => {
    setModoFormulario('editar');
    setClienteEditando(cliente);
    reset(cliente);
  };

  const abrirModalConfirmacion = (id) => {
    setItemParaEliminar(id);
    setShowConfirmModal(true);
  };

  const eliminarClienteHandler = () => {
    if (itemParaEliminar) {
      api.delete(`/clientes/${itemParaEliminar}`)
        .then(() => {
          cargarClientes();
        }).catch(err => {
          console.error('Error al eliminar cliente:', err);
          alert('No se pudo eliminar el cliente.');
        }).finally(() => {
          setShowConfirmModal(false);
          setItemParaEliminar(null);
        });
    }
  };

  const cancelarFormulario = () => {
    setModoFormulario(null);
    setClienteEditando(null);
    reset();
  };

  const clientesFiltrados = clientes.filter(c =>
    c.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    c.apellido.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="container">
      <div className="glass-container">
        {modoFormulario && user?.rol === 'admin' ? (
          <FormularioClientes {...{ modoFormulario, onSubmit, onCancel: cancelarFormulario, register, handleSubmit, errors }} />
        ) : (
          <>
            <div className="title-glass d-flex align-items-center justify-content-between mb-4">
              <h2>Clientes</h2>
              <img src="/profile.png" alt="perfil" style={{ width: '107px', height: '107px' }} />
            </div>
            <div className="d-flex align-items-center mb-3 gap-2">
              <input className="search-input" placeholder="Buscar cliente" value={filtro} onChange={e => setFiltro(e.target.value)} />
              {user?.rol === 'admin' && (
                <button className="btn-create" onClick={() => setModoFormulario('crear')}>
                  Agregar Cliente
                </button>
              )}
            </div>
            <table className="table-glass">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Teléfono</th>
                  {user?.rol === 'admin' && <th>Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {clientesFiltrados.map(cliente => (
                  <tr key={cliente.id_cliente}>
                    <td>{cliente.nombre}</td>
                    <td>{cliente.apellido}</td>
                    <td>{cliente.telefono}</td>
                    {user?.rol === 'admin' && (
                      <td>
                        <button className="btn-action btn-edit me-2" onClick={() => editarCliente(cliente)}>Editar</button>
                        <button className="btn-action btn-delete" onClick={() => abrirModalConfirmacion(cliente.id_cliente)}>Eliminar</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
      <ConfirmModal
        show={showConfirmModal}
        onConfirm={eliminarClienteHandler}
        onCancel={() => setShowConfirmModal(false)}
        title="Eliminar Cliente"
        message="¿Estás seguro de que quieres eliminar este cliente? Esta acción también eliminará sus ventas asociadas."
      />
    </div>
  );
};

export default Clientes;