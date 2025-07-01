import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [modoFormulario, setModoFormulario] = useState(null); // 'crear' o 'editar'
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
    if (modoFormulario === 'crear') {
      api.post('/clientes', data)
        .then(() => {
          cargarClientes();
          cancelarFormulario();
        });
    } else if (modoFormulario === 'editar') {
      api.put(`/clientes/${clienteEditando.id_cliente}`, data)
        .then(() => {
          cargarClientes();
          cancelarFormulario();
        });
    }
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
    <div className="container mt-4">
      {modoFormulario ? (
        <>
          <h2>{modoFormulario === 'crear' ? 'Agregar Cliente' : 'Editar Cliente'}</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input type="text" className="form-control" {...register('nombre', { required: 'Nombre requerido', maxLength: { value: 50, message: 'Máx. 50 caracteres' } })} />
              {errors.nombre && <p className="text-danger">{errors.nombre.message}</p>}
            </div>
            <div className="mb-3">
              <label className="form-label">Apellido</label>
              <input type="text" className="form-control" {...register('apellido', { required: 'Apellido requerido', maxLength: { value: 50, message: 'Máx. 50 caracteres' } })} />
              {errors.apellido && <p className="text-danger">{errors.apellido.message}</p>}
            </div>
            <div className="mb-3">
              <label className="form-label">Teléfono</label>
              <input type="text" className="form-control" {...register('telefono', { maxLength: { value: 20, message: 'Máx. 20 caracteres' } })} />
              {errors.telefono && <p className="text-danger">{errors.telefono.message}</p>}
            </div>
            <button type="submit" className="btn btn-primary me-2">Guardar</button>
            <button type="button" className="btn btn-secondary" onClick={cancelarFormulario}>Cancelar</button>
          </form>
        </>
      ) : (
        <>
          <div className="d-flex align-items-center mb-3">
            <h2>Clientes</h2>
            <img src='/profile.png' style={{ width: '107px', height: '107px' }} />
          </div>
          <div className="d-flex align-items-center mb-3">
            <input
              className="form-control w-25 me-2"
              placeholder="Buscar cliente"
              value={filtro}
              onChange={e => setFiltro(e.target.value)}
            />
            <button className="btn btn-success" onClick={() => setModoFormulario('crear')}>Agregar Cliente</button>
          </div>
          <table className="table table-bordered">
            <thead className="table-dark">
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
                    <button className="btn btn-warning btn-sm me-2" onClick={() => editarCliente(cliente)}>Editar</button>
                    <button className="btn btn-danger btn-sm" onClick={() => eliminarCliente(cliente.id_cliente)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )
      }
    </div >
  );
};

export default Clientes;