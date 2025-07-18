// En: src/components/perfil/FormModificarUsuario.jsx (CORREGIDO)

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

const FormModificarUsuario = ({ user, onSave, onCancel }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [fotoPreview, setFotoPreview] = useState(null);
    const backendUrl = 'http://localhost:3000';

    useEffect(() => {
        if (user) {
            reset(user);
            setFotoPreview(user.foto_perfil_url ? `${backendUrl}${user.foto_perfil_url}` : `${backendUrl}/uploads/default-profile.png`);
        }
    }, [user, reset]);

    const handleFotoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFotoPreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    const onSubmit = (data) => {
        onSave(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="title-glass">Editar Perfil</h2>
            </div>

            <div className="text-center my-4">
                <img src={fotoPreview} alt="Perfil" style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }} />
            </div>

            {/* Layout en dos columnas para mejor distribución */}
            <div className="row">
                <div className="col-12 mb-3">
                    <label className="form-label">Cambiar Foto de Perfil</label>
                    <input type="file" accept="image/*" className="search-input w-100" {...register('foto_perfil')} onChange={handleFotoChange} />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Nombre</label>
                    <input className="search-input w-100" {...register('nombre', { required: "El nombre es obligatorio" })} />
                    {errors.nombre && <p className="error-msg">{errors.nombre.message}</p>}
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Apellido</label>
                    <input className="search-input w-100" {...register('apellido', { required: "El apellido es obligatorio" })} />
                    {errors.apellido && <p className="error-msg">{errors.apellido.message}</p>}
                </div>
                <div className="col-12 mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="search-input w-100" {...register('email', { required: "El email es obligatorio" })} />
                    {errors.email && <p className="error-msg">{errors.email.message}</p>}
                </div>
                <div className='col-12 d-flex justify-content-end'>
                    <button type="submit" className="btn-action btn-profile me-2">Guardar Cambios</button>
                    <button type="button" onClick={onCancel} className="btn-action btn-profile">Cancelar</button>
                </div>
            </div>
        </form>
    );
};

export default FormModificarUsuario;