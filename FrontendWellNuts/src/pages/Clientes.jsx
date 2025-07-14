import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext'; // 1. Importar hook
import api from '../services/api';
import FormularioClientes from '../components/forms/FormularioCliente';
import '../styles/glass.css';

const Clientes = () => {
  const { user } = useAuth(); // 2. Obtener usuario
  const [clientes, setClientes] = useState([]);
  const [modoFormulario, setModoFormulario] = useState(null);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [clientIdToDelete, setClientIdToDelete] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = () => {
    api.get('/clientes')
      .then(res => setClientes(res.data))
      .catch(err => console.error('Error al cargar clientes:', err));
  };

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

  const confirmarEliminarCliente = (id) => {
    setClientIdToDelete(id);
    setShowConfirmModal(true);
  };

  const eliminarClienteHandler = () => {
    if (clientIdToDelete) {
      api.delete(`/clientes/${clientIdToDelete}`)
        .then(() => {
          cargarClientes();
          setShowConfirmModal(false);
          setClientIdToDelete(null);
        }).catch(err => {
          console.error('Error al eliminar cliente:', err);
          setShowConfirmModal(false);
          setClientIdToDelete(null);
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
              {/* 3. Botón solo para administradores */}
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
                    {/* 4. Acciones solo para administradores */}
                    {user?.rol === 'admin' && (
                      <td>
                        <button className="btn-action btn-edit me-2" onClick={() => editarCliente(cliente)}>Editar</button>
                        <button className="btn-action btn-delete" onClick={() => confirmarEliminarCliente(cliente.id_cliente)}>Eliminar</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        {showConfirmModal && user?.rol === 'admin' && (
          <div className="modal-overlay">
            <div className="modal-content">
              <p>¿Estás seguro de que quieres eliminar este cliente?</p>
              <div className="modal-actions">
                <button className="btn btn-danger me-2" onClick={eliminarClienteHandler}>Eliminar</button>
                <button className="btn btn-secondary" onClick={() => setShowConfirmModal(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clientes;