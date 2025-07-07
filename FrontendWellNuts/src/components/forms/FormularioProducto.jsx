
import React from 'react';
import { useForm } from 'react-hook-form';
/**
 * Componente para el formulario de creación o edición de productos.
 * Recibe props para manejar el estado del formulario y las acciones.
 * @param {object} props - Propiedades del componente.
 * @param {string} props.modoFormulario - Indica si el formulario está en modo 'crear' o 'editar'.
 * @param {Array<object>} props.variedades - Lista de variedades disponibles para el select.
 * @param {function} props.onSubmit - Función que se ejecuta al enviar el formulario.
 * @param {function} props.onCancel - Función que se ejecuta al cancelar el formulario.
 * @param {object} props.register - Función de `react-hook-form` para registrar los inputs.
 * @param {function} props.handleSubmit - Función de `react-hook-form` para manejar el envío del formulario.
 * @param {object} props.errors - Objeto de `react-hook-form` que contiene los errores de validación.
 */
const FormularioProducto = ({
  modoFormulario,
  variedades,
  onSubmit,
  onCancel,
  register,
  handleSubmit,
  errors,
}) => {
  return (
    <>
      <div className='form-glass-container'>
        {/* Título del formulario que cambia según el modo */}
        <h2 className="title-glass">
          {modoFormulario === 'crear' ? 'Agregar Producto' : 'Editar Producto'}
        </h2>
        {/* Formulario principal */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Campo Nombre del Producto */}
          <div className="form-row mb-3">
            <label className="form-label">Nombre</label>
            <input
              className="search-input"
              {...register('nombre_producto', {
                required: 'Campo requerido',
                maxLength: { value: 100, message: 'Máx. 100 caracteres' }
              })}
            />
            {errors.nombre_producto && <p className="text-danger">{errors.nombre_producto.message}</p>}
          </div>

          {/* Campo Precio Proveedor */}
          <div className="form-row mb-3">
            <label className="form-label">Precio proveedor</label>
            <input
              type="number"
              className="search-input"
              {...register('precio_proveedor', {
                required: 'Campo requerido',
                min: { value: 0.01, message: 'Debe ser positivo' }
              })}
            />
            {errors.precio_proveedor && <p className="text-danger">{errors.precio_proveedor.message}</p>}
          </div>

          {/* Campo Precio Actual */}
          <div className="form-row mb-3">
            <label className="form-label">Precio actual</label>
            <input
              type="number"
              className="search-input"
              {...register('precio_actual', {
                required: 'Campo requerido',
                min: { value: 0.01, message: 'Debe ser positivo' }
              })}
            />
            {errors.precio_actual && <p className="text-danger">{errors.precio_actual.message}</p>}
          </div>

          {/* Campo Tamaño en Gramos */}
          <div className="form-row mb-3">
            <label className="form-label">Tamaño</label>
            <input
              type="number"
              className="search-input"
              {...register('tamaño_gramos', {
                required: 'Campo requerido',
                min: { value: 1, message: 'Debe ser positivo' }
              })}
            />
            {errors.tamaño_gramos && <p className="text-danger">{errors.tamaño_gramos.message}</p>}
          </div>

          {/* Campo Variedad (Dropdown) */}
          <div className="form-row mb-3">
            <label className="form-label">Variedad</label>
            <select
              className="search-input"
              {...register('id_variedad', { required: 'Campo requerido' })}
            >
              <option value="">Seleccione una variedad</option>
              {variedades.map(v => (
                <option key={v.id_variedad} value={v.id_variedad}>
                  {v.nombre_variedad}
                </option>
              ))}
            </select>
            {errors.id_variedad && <p className="text-danger">{errors.id_variedad.message}</p>}
          </div>
          {/* Botones de acción del formulario */}
          <button type="submit" className="btn btn-primary me-2">Guardar</button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
        </form>
      </div>
    </>
  );
};

export default FormularioProducto;
