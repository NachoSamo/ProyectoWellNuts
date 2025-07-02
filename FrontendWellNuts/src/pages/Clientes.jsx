import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import '../styles/glass.css'; // Asegurate de que este sea el nombre del nuevo CSS unificado

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [modoFormulario, setModoFormulario] = useState(null);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [filtro, setFiltro] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = () => {
    api.get('/clientes')
      .then(res => setClientes(res.data))
      .catch(err => console.error(err));
  };

  const onSubmit = data => {
    const metodo = modoFormulario === 'crear'
      ? api.post('/clientes', data)
      : api.put(`/clientes/${clienteEditando.id_cliente}`, data);

    metodo.then(() => {
      cargarClientes();
      cancelarFormulario();
    });
  };

  const editarCliente = cliente => {
    setModoFormulario('editar');
    setClienteEditando(cliente);
    reset(cliente);
  };

  const eliminarCliente = id => {
    if (confirm('¿Seguro que deseas eliminar este cliente?')) {
      api.delete(`/clientes/${id}`)
        .then(() => cargarClientes());
    }
  };

  const cancelarFormulario = () => {
    setModoFormulario(null);
    setClienteEditando(null);
    reset();
  };

  const clientesFiltrados = clientes.filter(p =>
    p.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="container">
      <div className="glass-container">
        {modoFormulario ? (
          <>
            <h2>{modoFormulario === 'crear' ? 'Agregar Cliente' : 'Editar Cliente'}</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input type="text" className="form-control" {...register('nombre', { required: 'Nombre requerido', maxLength: 50 })} />
                {errors.nombre && <p className="text-danger">{errors.nombre.message}</p>}
              </div>
              <div className="mb-3">
                <label className="form-label">Apellido</label>
                <input type="text" className="form-control" {...register('apellido', { required: 'Apellido requerido', maxLength: 50 })} />
                {errors.apellido && <p className="text-danger">{errors.apellido.message}</p>}
              </div>
              <div className="mb-3">
                <label className="form-label">Teléfono</label>
                <input type="text" className="form-control" {...register('telefono', { maxLength: 20 })} />
                {errors.telefono && <p className="text-danger">{errors.telefono.message}</p>}
              </div>
              <button type="submit" className="btn btn-primary me-2">Guardar</button>
              <button type="button" className="btn btn-secondary" onClick={cancelarFormulario}>Cancelar</button>
            </form>
          </>
        ) : (
          <>
            <div className="title-glass d-flex align-items-center justify-content-between mb-4">
              <h2>Clientes</h2>
              <img src="/profile.png" alt="perfil" style={{ width: '107px', height: '107px' }} />
            </div>

            <div className="d-flex align-items-center mb-3 gap-2">
              <input
                className="search-input"
                placeholder="Buscar cliente"
                value={filtro}
                onChange={e => setFiltro(e.target.value)}
              />
              <button className="btn-create" onClick={() => setModoFormulario('crear')}>
                Agregar Cliente
              </button>
            </div>

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
                {clientesFiltrados.map(cliente => (
                  <tr key={cliente.id_cliente}>
                    <td>{cliente.nombre}</td>
                    <td>{cliente.apellido}</td>
                    <td>{cliente.telefono}</td>
                    <td>
                      <button className="btn-action btn-edit me-2" onClick={() => editarCliente(cliente)}>Editar</button>
                      <button className="btn-action btn-delete" onClick={() => eliminarCliente(cliente.id_cliente)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default Clientes;
