import React from 'react';


const VistaPerfil = ({ user, onEditProfile, onEditPassword }) => {
  const backendUrl = 'http://localhost:6002'; // Tu puerto de backend

  if (!user) {
    return <h2 className="title-glass">Cargando perfil...</h2>;
  }

  const profileImageUrl = user.foto_perfil_url 
    ? `${backendUrl}${user.foto_perfil_url}` 
    : `${backendUrl}/uploads/default-profile.png`; // El nombre de tu imagen por defecto

  // Función para capitalizar la primera letra (ej. "admin" -> "Admin")
  const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="title-glass">Mi Perfil</h2>
        <div>
          <button onClick={onEditProfile} className="btn-action btn-profile me-2">Editar Perfil</button>
          <button onClick={onEditPassword} className="btn-action btn-profile">Cambiar Contraseña</button>
        </div>
      </div>
      
      <div className="mt-4 row align-items-center">
        {/* === Columna de la Foto y Nombre de Usuario === */}
        <div className="col-md-4 text-center">
          <img 
            src={profileImageUrl}
            alt="Perfil" 
            style={{ 
              width: '150px', 
              height: '150px', 
              borderRadius: '50%', 
              objectFit: 'cover', 
              border: '3px solid rgba(255, 255, 255, 0.2)' 
            }} 
          />
          {/* Nombre de usuario debajo de la foto */}
          <p className="mt-3" style={{ fontSize: '1.2rem', fontWeight: '600', color: '#fff' }}>
            {user.nombre_usuario || 'N/A'}
          </p>
        </div>
        
        {/* === Columna de los Datos del Perfil === */}
        <div className="col-md-8">
          <div className="mb-4">
            <label className="form-label">Nombre Completo</label>
            <p className="form-control-static">
              {user.nombre && user.apellido ? `${user.nombre} ${user.apellido}` : 'Dato no disponible'}
            </p>
          </div>
          <div className="mb-4">
            <label className="form-label">Email</label>
            <p className="form-control-static">{user.email || 'Dato no disponible'}</p>
          </div>
          <div className="mb-3">
            <label className="form-label">Rol</label>
            <p className="form-control-static">
              <span className={user.rol === 'admin' ? 'role-admin' : 'role-user'}>
                {capitalize(user.rol) || 'N/A'}
              </span>
            </p>
          </div>
        </div>
      </div>
      
      <style>{`
        .form-label {
          color: #94a3b8;
          font-size: 0.9rem;
          text-transform: uppercase; /* Para un look más profesional */
          letter-spacing: 0.5px;
        }
        .form-control-static { 
          color: #e2e8f0; 
          font-size: 1.1rem; 
          padding: 0.5rem 1rem; 
          background-color: rgba(0,0,0,0.25); 
          border-radius: 8px; 
          margin-top: 0.25rem;
          min-height: 44px;
          display: flex;
          align-items: center;
        }
        .role-admin {
          color: #15fa4eff; /* Amarillo/Dorado para admin */
          font-weight: 600;
        }
        .role-user {
          color: #2277e0ff; /* Color estándar para usuario */
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default VistaPerfil;