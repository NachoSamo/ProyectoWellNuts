// src/pages/Clientes.jsx
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import FormularioClientes from '../components/forms/FormularioCliente'; // Importar el nuevo componente del formulario
import '../styles/glass.css'; // Asegurate de que este sea el nombre del nuevo CSS unificado

const Clientes = () => {
  // Estados para la gestión de clientes y UI
  const [clientes, setClientes] = useState([]);
  const [modoFormulario, setModoFormulario] = useState(null); // 'crear', 'editar' o null
  const [clienteEditando, setClienteEditando] = useState(null); // Cliente actualmente en edición
  const [filtro, setFiltro] = useState(''); // Filtro para la tabla de clientes
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Estado para mostrar el modal de confirmación
  const [clientIdToDelete, setClientIdToDelete] = useState(null); // ID del cliente a eliminar

  // Inicialización de react-hook-form para el manejo del formulario
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Efecto para cargar clientes al montar el componente
  useEffect(() => {
    cargarClientes();
  }, []);

  /**
   * Carga la lista de clientes desde el servicio.
   */
  const cargarClientes = () => {
    api.get('/clientes')
      .then(res => setClientes(res.data))
      .catch(err => console.error('Error al cargar clientes:', err));
  };

  /**
   * Maneja el envío del formulario, ya sea para crear o modificar un cliente.
   * @param {object} data - Datos del formulario.
   */
  const onSubmit = data => {
    const metodo = modoFormulario === 'crear'
      ? api.post('/clientes', data)
      : api.put(`/clientes/${clienteEditando.id_cliente}`, data);

    metodo
      .then(() => {
        cargarClientes(); // Recargar clientes después de la operación
        cancelarFormulario(); // Resetear el formulario
      })
      .catch(err => console.error('Error al guardar cliente:', err));
  };

  /**
   * Prepara el formulario para editar un cliente existente.
   * @param {object} cliente - El cliente a editar.
   */
  const editarCliente = cliente => {
    setModoFormulario('editar');
    setClienteEditando(cliente);
    reset(cliente); // Resetear el formulario con los datos del cliente a editar
  };

  /**
   * Abre el modal de confirmación para eliminar un cliente.
   * @param {number} id - ID del cliente a eliminar.
   */
  const confirmarEliminarCliente = (id) => {
    setClientIdToDelete(id);
    setShowConfirmModal(true);
  };

  /**
   * Maneja la eliminación de un cliente después de la confirmación.
   */
  const eliminarClienteHandler = () => {
    if (clientIdToDelete) {
      api.delete(`/clientes/${clientIdToDelete}`)
        .then(() => {
          cargarClientes(); // Recargar clientes después de la eliminación
          setShowConfirmModal(false); // Cerrar el modal
          setClientIdToDelete(null); // Limpiar el ID
        })
        .catch(err => {
          console.error('Error al eliminar cliente:', err);
          setShowConfirmModal(false); // Cerrar el modal incluso si hay error
          setClientIdToDelete(null);
        });
    }
  };

  /**
   * Cancela el modo formulario y resetea el estado.
   */
  const cancelarFormulario = () => {
    setModoFormulario(null);
    setClienteEditando(null);
    reset(); // Limpiar los campos del formulario
  };

  /**
   * Filtra los clientes basándose en el texto de búsqueda.
   */
  const clientesFiltrados = clientes.filter(c =>
    c.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    c.apellido.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="container">
      <div className="glass-container">
        {/* Renderizado condicional según el estado de la UI */}
        {modoFormulario ? (
          // Si se está en modo formulario (crear o editar), mostrar el FormularioClientes
          <FormularioClientes
            modoFormulario={modoFormulario}
            onSubmit={onSubmit}
            onCancel={cancelarFormulario}
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
          />
        ) : (
          // Si no se está en modo formulario, mostrar la tabla de clientes
          <>
            {/* Encabezado de la sección de clientes */}
            <div className="title-glass d-flex align-items-center justify-content-between mb-4">
              <h2>Clientes</h2>
              {/* Imagen decorativa */}
              <img src="/profile.png" alt="perfil" style={{ width: '107px', height: '107px' }} />
            </div>

            {/* Controles de búsqueda y botones de acción */}
            <div className="d-flex align-items-center mb-3 gap-2">
              {/* Campo de búsqueda */}
              <input
                className="search-input"
                placeholder="Buscar cliente"
                value={filtro}
                onChange={e => setFiltro(e.target.value)}
              />
              {/* Botón para agregar cliente */}
              <button className="btn-create" onClick={() => setModoFormulario('crear')}>
                Agregar Cliente
              </button>
            </div>

            {/* Tabla de clientes */}
            <table className="table-glass">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Teléfono</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {/* Mapear los clientes filtrados para mostrar en la tabla */}
                {clientesFiltrados.map(cliente => (
                  <tr key={cliente.id_cliente}>
                    <td>{cliente.nombre}</td>
                    <td>{cliente.apellido}</td>
                    <td>{cliente.telefono}</td>
                    <td>
                      {/* Botones de acción para cada cliente */}
                      <button className="btn-action btn-edit me-2" onClick={() => editarCliente(cliente)}>Editar</button>
                      <button className="btn-action btn-delete" onClick={() => confirmarEliminarCliente(cliente.id_cliente)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* Modal de confirmación para eliminar cliente */}
        {showConfirmModal && (
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

        {/* Estilos CSS para el modal de confirmación (pueden ir en un archivo CSS global si se usan en varios lugares) */}
        <style>
          {`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }

          .modal-content {
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            color: black; /* Asegura que el texto sea visible */
          }

          .modal-actions {
            margin-top: 15px;
          }
          `}
        </style>
      </div>
    </div>
  );
};

export default Clientes;
