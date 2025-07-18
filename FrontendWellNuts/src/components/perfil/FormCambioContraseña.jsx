import React from 'react';
import { useForm } from 'react-hook-form';

const FormCambioContraseña = ({ onSave, onCancel }) => {
    const { register, handleSubmit, formState: { errors }, getValues } = useForm();

    return (
        <form onSubmit={handleSubmit(onSave)}>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="title-glass">Cambiar Contraseña</h2>
            </div>

            <div className="mt-4">
                <div className="mb-3">
                    <label className="form-label">Contraseña Actual</label>
                    <input 
                        type="password" 
                        className="search-input w-100" 
                        {...register('contraseña_actual', { required: "La contraseña actual es obligatoria" })} 
                    />
                    {errors.contraseña_actual && <p className="error-msg">{errors.contraseña_actual.message}</p>}
                </div>
                <div className="mb-3">
                    <label className="form-label">Nueva Contraseña</label>
                    <input
                        type="password"
                        className="search-input w-100"
                        {...register('nueva_contraseña', {
                            required: "La nueva contraseña es obligatoria",
                            minLength: { value: 6, message: "Mínimo 6 caracteres" },
                            pattern: {
                                value: /^(?=.*[A-Z])(?=.*\d).+$/,
                                message: "Debe contener al menos una mayúscula y un número"
                            }
                        })}
                    />
                    {errors.nueva_contraseña && <p className="error-msg">{errors.nueva_contraseña.message}</p>}
                </div>
                <div className="mb-3">
                    <label className="form-label">Confirmar Nueva Contraseña</label>
                    <input 
                        type="password" 
                        className="search-input w-100" 
                        {...register('confirmar_contraseña', { 
                            required: "Confirma la nueva contraseña", 
                            validate: value => value === getValues('nueva_contraseña') || "Las contraseñas no coinciden" 
                        })} 
                    />
                    {errors.confirmar_contraseña && <p className="error-msg">{errors.confirmar_contraseña.message}</p>}
                </div>
                 <div className='col-12 d-flex justify-content-end'>
                    <button type="submit" className="btn-action btn-profile me-2">Cambiar contraseña</button>
                    <button type="button" onClick={onCancel} className="btn-action btn-profile">Cancelar</button>
                </div>
            </div>
        </form>
    );
};

export default FormCambioContraseña;