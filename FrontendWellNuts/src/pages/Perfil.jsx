import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateMiPerfil, updatePassword } from '../services/usuarioService';
import '../styles/glass.css';

// Importamos los nuevos componentes modulares
import VistaPerfil from '../components/perfil/VistaPerfil';
import FormModificarUsuario from '../components/perfil/FormModificarUsuario';
import FormCambioContraseña from '../components/perfil/FormCambioContraseña';

const Perfil = () => {
  const { user, refreshUserData } = useAuth();
  const [view, setView] = useState('display'); // 'display', 'editProfile', 'editPassword'
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  // --- Handlers para las acciones ---

  const handleProfileSave = async (data) => {
    const formData = new FormData();
    formData.append('nombre', data.nombre);
    formData.append('apellido', data.apellido);
    formData.append('email', data.email);
    if (data.foto_perfil && data.foto_perfil[0]) {
      formData.append('foto_perfil', data.foto_perfil[0]);
    }

    try {
      const response = await updateMiPerfil(formData);
      setMensaje({ tipo: 'success', texto: response.msg });
      await refreshUserData();
      setView('display'); // Volvemos a la vista principal
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.response?.data?.msg || 'Error al actualizar.' });
    }
  };

  const handlePasswordSave = async (data) => {
    if (data.nueva_contraseña !== data.confirmar_contraseña) {
      setMensaje({ tipo: 'error', texto: 'Las nuevas contraseñas no coinciden.' });
      return;
    }
    try {
      const response = await updatePassword({ contraseña_actual: data.contraseña_actual, nueva_contraseña: data.nueva_contraseña });
      setMensaje({ tipo: 'success', texto: response.msg });
      setView('display'); // Volvemos a la vista principal
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.response?.data?.msg || 'Error al cambiar contraseña.' });
    }
  };

  const handleCancel = () => {
    setMensaje({ tipo: '', texto: '' }); // Limpia cualquier mensaje anterior
    setView('display');
  };

  // --- Renderizado Condicional ---

  const renderContent = () => {
    if (!user) {
      return <p>Cargando perfil...</p>;
    }

    switch (view) {
      case 'editProfile':
        return <FormModificarUsuario user={user} onSave={handleProfileSave} onCancel={handleCancel} />;
      case 'editPassword':
        return <FormCambioContraseña onSave={handlePasswordSave} onCancel={handleCancel} />;
      case 'display':
      default:
        return <VistaPerfil user={user} onEditProfile={() => setView('editProfile')} onEditPassword={() => setView('editPassword')} />;
    }
  };

  return (
    <div className="container">
      <div className="glass-container">
        {renderContent()}
        {mensaje.texto && (
          <div className={`mt-4 text-center ${mensaje.tipo === 'success' ? 'success-msg' : 'error-msg'}`}>
            {mensaje.texto}
          </div>
        )}
      </div>
    </div>
  );
};

export default Perfil;