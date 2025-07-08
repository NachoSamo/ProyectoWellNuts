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
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Estado para mostrar el modal de confirmación
  const [VariedadIdToDelete, setVariedadIdToDelete] = useState(null); 



  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  /**
   * Maneja la eliminación de un producto después de la confirmación.
   */
  const eliminarVariedadHandler = () => {
    if (VariedadIdToDelete) {
      eliminarVariedad(VariedadIdToDelete)
        .then(() => {
          cargarVariedades(); // Recargar productos después de la eliminación
          setShowConfirmModal(false); // Cerrar el modal
          setVariedadIdToDelete(null); // Limpiar el ID
        })
        .catch(err => {
          console.error('Error al eliminar producto:', err);
          setShowConfirmModal(false); // Cerrar el modal incluso si hay error
          setVariedadIdToDelete(null);
        });
    }
  };


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
    setVariedadIdToDelete(id);
    setShowConfirmModal(true);
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
          {/* Modal de confirmación para eliminar producto */}
          {showConfirmModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <p>¿Estás seguro de que quieres eliminar este producto?</p>
                <div className="modal-actions">
                  <button className="btn btn-danger me-2" onClick={eliminarVariedadHandler}>Eliminar</button>
                  <button className="btn btn-secondary" onClick={() => setShowConfirmModal(false)}>Cancelar</button>
                </div>
              </div>
            </div>
          )}
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

        </>
      )}
    </div>
  );
};

export default Variedades;
