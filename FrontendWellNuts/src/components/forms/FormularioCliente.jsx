// src/components/FormularioClientes.jsx
import React from 'react';
// No es necesario importar useForm aquí si las props ya lo traen,
// pero se incluye para claridad si se usaran internamente en el futuro.

/**
 * Componente para el formulario de creación o edición de clientes.
 * Recibe props para manejar el estado del formulario y las acciones.
 * @param {object} props - Propiedades del componente.
 * @param {string} props.modoFormulario - Indica si el formulario está en modo 'crear' o 'editar'.
 * @param {function} props.onSubmit - Función que se ejecuta al enviar el formulario.
 * @param {function} props.onCancel - Función que se ejecuta al cancelar el formulario.
 * @param {object} props.register - Función de `react-hook-form` para registrar los inputs.
 * @param {function} props.handleSubmit - Función de `react-hook-form` para manejar el envío del formulario.
 * @param {object} props.errors - Objeto de `react-hook-form` que contiene los errores de validación.
 */
const FormularioClientes = ({
  modoFormulario,
  onSubmit,
  onCancel,
  register,
  handleSubmit,
  errors,
}) => {
  return (
    <>
    <div className='form-glass-container'>
      <h2 className='title-glass'>{modoFormulario === 'crear' ? 'Agregar Cliente' : 'Editar Cliente'}</h2>
      {/* Formulario principal */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Campo Nombre */}
        <div style={{ marginTop: '2rem' }} className="d-flex align-items-center mb-3 gap-2">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            className="search-input"
            {...register('nombre', { required: 'Nombre requerido', maxLength: 50 })}
          />
          {/* Mostrar errores de validación si existen */}
          {errors.nombre && <p className="text-danger">{errors.nombre.message}</p>}
        </div>

        {/* Campo Apellido */}
        <div className="d-flex align-items-center mb-3 gap-2">
          <label className="form-label">Apellido</label>
          <input
            type="text"
            className="search-input"
            {...register('apellido', { required: 'Apellido requerido', maxLength: 50 })}
          />
          {errors.apellido && <p className="text-danger">{errors.apellido.message}</p>}
        </div>

        {/* Campo Teléfono */}
        <div className="d-flex align-items-center mb-4 gap-2">
          <label className="form-label">Teléfono</label>
          <input
            type="text"
            className="search-input"
            {...register('telefono', { maxLength: 20 })}
          />
          {errors.telefono && <p className="text-danger">{errors.telefono.message}</p>}
        </div>

        {/* Botones de acción del formulario */}
        <button type="submit" className="btn btn-primary me-2">Guardar</button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
      </form>
    </div>
    </>
  );
};

export default FormularioClientes;
