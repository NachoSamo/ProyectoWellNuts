import React from 'react';

const ConfirmModal = ({ show, onConfirm, onCancel, title, message }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h4 className="modal-title">{title || 'Confirmar Acción'}</h4>
        <p className="modal-message">{message || '¿Estás seguro de que quieres continuar?'}</p>
        <div className="modal-actions">
          <button className="btn-action btn-delete me-2" onClick={onConfirm}>
            Confirmar
          </button>
          <button className="btn-action btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
      {/* Añadimos estilos más completos directamente aquí para que sea autocontenido */}
      <style>{`
        .modal-overlay {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.75);
            display: flex; justify-content: center; align-items: center;
            z-index: 1050;
        }
        .modal-content {
            background: #242938;
            color: #e2e8f0;
            padding: 2rem;
            border-radius: 1rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
            text-align: center;
            width: 90%;
            max-width: 400px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        }
        .modal-title {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
        }
        .modal-message {
            font-size: 1.1rem;
            margin-bottom: 2rem;
        }
        .modal-actions {
            display: flex;
            justify-content: center;
            gap: 1rem;
        }
        .modal-actions .btn-action {
            padding: 0.6rem 1.2rem;
            font-size: 1rem;
        }
        .btn-secondary { background-color: #4a5568; color: white; }
        .btn-secondary:hover { background-color: #2d3748; }
      `}</style>
    </div>
  );
};

export default ConfirmModal;