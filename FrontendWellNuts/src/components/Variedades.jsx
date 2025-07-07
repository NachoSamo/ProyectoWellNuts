import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  getVariedades,
  crearVariedad,
  modificarVariedad,
  eliminarVariedad
} from '../services/variedadProductoService';

const Variedades = ({ onVolver }) => {
  const [variedades, setVariedades] = useState([]);
  const [modoFormulario, setModoFormulario] = useState(null);
  const [variedadEditando, setVariedadEditando] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    cargarVariedades();
  }, []);

  const cargarVariedades = () => {
    getVariedades()
      .then(res => setVariedades(res.data))
      .catch(err => console.error(err));
  };

  const onSubmit = data => {
    if (modoFormulario === 'crear') {
      crearVariedad(data)
        .then(() => {
          cargarVariedades();
          cancelarFormulario();
        });
    } else if (modoFormulario === 'editar') {
      modificarVariedad(variedadEditando.id_variedad, data)
        .then(() => {
          cargarVariedades();
          cancelarFormulario();
        });
    }
  };

  const editar = variedad => {
    setModoFormulario('editar');
    setVariedadEditando(variedad);
    reset(variedad);
  };

  const eliminar = id => {
    if (confirm('¿Eliminar esta variedad?')) {
      eliminarVariedad(id).then(() => cargarVariedades());
    }
  };

  const cancelarFormulario = () => {
    setModoFormulario(null);
    setVariedadEditando(null);
    reset();
  };

  return (
    <div className="container mt-4">
      {modoFormulario ? (
        <>
          <div className='form-glass-container'>
            <h2>{modoFormulario === 'crear' ? 'Agregar Variedad' : 'Editar Variedad'}</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-row mb-3">
                <label className="form-label">Nombre de variedad</label>
                <input
                  className="search-input"
                  {...register('nombre_variedad', {
                    required: 'Campo requerido',
                    maxLength: { value: 50, message: 'Máximo 50 caracteres' },
                    minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                  })}
                />
                {errors.nombre_variedad && (
                  <p className="text-danger">{errors.nombre_variedad.message}</p>
                )}
              </div>
              <div className="form-row mb-3">
                <label className="form-label">Stock</label>
                <input
                  type="number"
                  className="search-input"
                  {...register('stock_gramos', {
                    required: 'Campo requerido',
                    min: { value: 0, message: 'El stock debe ser positivo' }
                  })}
                />
                {errors.stock_gramos && (
                  <p className="text-danger">{errors.stock_gramos.message}</p>
                )}
              </div>
              <button type="submit" className="btn btn-primary me-2">Guardar</button>
              <button type="button" className="btn btn-secondary" onClick={cancelarFormulario}>Cancelar</button>
            </form>
          </div>
        </>
      ) : (
        <>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h2>Variedades de Productos</h2>
            <button className="btn btn-secondary" onClick={onVolver}>Volver a Productos</button>
          </div>
          <button className="btn btn-success mb-3" onClick={() => setModoFormulario('crear')}>Agregar Variedad</button>
          <table className="table-glass">
            <thead className="table-dark">
              <tr>
                <th>Nombre</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {variedades.map(v => (
                <tr key={v.id_variedad}>
                  <td>{v.nombre_variedad}</td>
                  <td>{v.stock_gramos}</td>
                  <td>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => editar(v)}>Editar</button>
                    <button className="btn btn-danger btn-sm" onClick={() => eliminar(v.id_variedad)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Variedades;
