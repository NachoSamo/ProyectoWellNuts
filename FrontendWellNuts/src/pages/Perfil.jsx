import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { updateMiPerfil, updatePassword } from '../services/usuarioService';
import '../styles/glass.css';

const Perfil = () => {
    const { user, refreshUserData } = useAuth(); // Usamos el 'user' del contexto
    const [isEditing, setIsEditing] = useState(false);
    const [fotoPreview, setFotoPreview] = useState(null);
    const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

    const backendUrl = 'http://localhost:5000';

    // Formulario para datos del perfil
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    // Formulario separado para la contraseña
    const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPasswordForm, formState: { errors: passwordErrors } } = useForm();

    useEffect(() => {
        if (user) {
            reset(user); // Carga los datos del usuario en el formulario
            setFotoPreview(user.foto_perfil_url ? `${backendUrl}${user.foto_perfil_url}` : `${backendUrl}/uploads/default-profile.png`);
        }
    }, [user, reset]);

    const onProfileSubmit = async (data) => {
        const formData = new FormData();
        formData.append('nombre', data.nombre);
        formData.append('apellido', data.apellido);
        formData.append('email', data.email);
        if (data.foto_perfil[0]) {
            formData.append('foto_perfil', data.foto_perfil[0]);
        }

        try {
            const response = await updateMiPerfil(formData);
            setMensaje({ tipo: 'success', texto: response.msg });
            await refreshUserData(); // Refresca los datos en el contexto (¡y en la navbar!)
            setIsEditing(false); // Bloquea el formulario de nuevo
        } catch (error) {
            setMensaje({ tipo: 'error', texto: error.response?.data?.msg || 'Error al actualizar.' });
        }
    };

    const onPasswordSubmit = async (data) => {
        if (data.nueva_contraseña !== data.confirmar_contraseña) {
            setMensaje({ tipo: 'error', texto: 'Las nuevas contraseñas no coinciden.' });
            return;
        }
        try {
            const response = await updatePassword({ contraseña_actual: data.contraseña_actual, nueva_contraseña: data.nueva_contraseña });
            setMensaje({ tipo: 'success', texto: response.msg });
            resetPasswordForm();
        } catch (error) {
            setMensaje({ tipo: 'error', texto: error.response?.data?.msg || 'Error al cambiar contraseña.' });
        }
    };

    const handleFotoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFotoPreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    return (
        <div className="container">
            <div className="glass-container">
                <div className="d-flex justify-content-between align-items-center">
                    <h2 className="title-glass">Mi Perfil</h2>
                    {/* Botón dinámico */}
                    {isEditing ? (
                        <button onClick={handleSubmit(onProfileSubmit)} className="btn-create">Guardar Cambios</button>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="btn-action btn-edit">Editar Perfil</button>
                    )}
                </div>

                {/* Formulario de Datos Personales con fieldset */}
                <fieldset disabled={!isEditing} className="mt-4">
                    <form>
                        <div className="text-center mb-4">
                            <img src={fotoPreview} alt="Perfil" style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }} />
                        </div>
                        {isEditing && (
                            <div className="mb-3">
                                <label className="form-label">Cambiar Foto de Perfil</label>
                                <input type="file" className="form-control" {...register('foto_perfil')} onChange={handleFotoChange} />
                            </div>
                        )}
                        <div className="mb-3">
                            <label className="form-label">Nombre</label>
                            <input className="form-control" {...register('nombre', { required: "El nombre es obligatorio" })} />
                            {errors.nombre && <p className="error-msg">{errors.nombre.message}</p>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Apellido</label>
                            <input className="form-control" {...register('apellido', { required: "El apellido es obligatorio" })} />
                            {errors.apellido && <p className="error-msg">{errors.apellido.message}</p>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-control" {...register('email', { required: "El email es obligatorio" })} />
                            {errors.email && <p className="error-msg">{errors.email.message}</p>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Nombre de Usuario</label>
                            <input className="form-control" defaultValue={user?.nombre_usuario} disabled />
                        </div>
                    </form>
                </fieldset>

                <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '2.5rem 0' }} />

                {/* Formulario de Contraseña */}
                <h3 className="title-glass">Cambiar Contraseña</h3>
                <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="mt-4">
                    <div className="mb-3">
                        <label className="form-label">Contraseña Actual</label>
                        <input type="password" className="form-control" {...registerPassword('contraseña_actual', { required: "La contraseña actual es obligatoria" })} />
                        {passwordErrors.contraseña_actual && <p className="error-msg">{passwordErrors.contraseña_actual.message}</p>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Nueva Contraseña</label>
                        <input type="password" className="form-control" {...registerPassword('nueva_contraseña', { required: "La nueva contraseña es obligatoria", minLength: { value: 6, message: "Mínimo 6 caracteres" } })} />
                        {passwordErrors.nueva_contraseña && <p className="error-msg">{passwordErrors.nueva_contraseña.message}</p>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Confirmar Nueva Contraseña</label>
                        <input type="password" className="form-control" {...registerPassword('confirmar_contraseña', { required: "Confirma la nueva contraseña" })} />
                        {passwordErrors.confirmar_contraseña && <p className="error-msg">{passwordErrors.confirmar_contraseña.message}</p>}
                    </div>
                    <button type="submit" className="btn-create mt-2">Cambiar Contraseña</button>
                </form>

                {mensaje.texto && <div className={`mt-4 text-center ${mensaje.tipo === 'success' ? 'success-msg' : 'error-msg'}`}>{mensaje.texto}</div>}
            </div>
        </div>
    );
};

export default Perfil;