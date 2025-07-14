import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext'; // 1. Importar hook
import { getVentas, eliminarVenta, actualizarEstadoPagado } from "../services/ventasService";
import { getDetallesPorVenta } from "../services/detalleVentasService";
import FormularioVenta from '../components/forms/FormularioVenta';
import '../styles/glass.css';

const Ventas = () => {
  const { user } = useAuth(); // 2. Obtener usuario
  const [ventas, setVentas] = useState([]);
  const [ventasFiltradas, setVentasFiltradas] = useState([]);
  const [detallesVisibles, setDetallesVisibles] = useState({});
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [ordenAscendente, setOrdenAscendente] = useState(false);
  const [filtroPagado, setFiltroPagado] = useState("todos");

  useEffect(() => {
    cargarVentas();
  }, []);

  useEffect(() => {
    filtrarVentas();
  }, [ventas, busqueda, ordenAscendente, filtroPagado]);

  const cargarVentas = () => {
    getVentas()
      .then(res => {
        setVentas(res.data);
      })
      .catch(err => console.error('Error al cargar ventas:', err));
  };
  
  const filtrarVentas = () => {
    let filtradas = [...ventas];
    if (busqueda.trim()) {
      filtradas = filtradas.filter(v => v.cliente.toLowerCase().includes(busqueda.toLowerCase()));
    }
    if (filtroPagado === "si") filtradas = filtradas.filter(v => v.pagado);
    else if (filtroPagado === "no") filtradas = filtradas.filter(v => !v.pagado);
    filtradas.sort((a, b) => {
      const fechaA = new Date(a.fecha);
      const fechaB = new Date(b.fecha);
      return ordenAscendente ? fechaA - fechaB : fechaB - fechaA;
    });
    setVentasFiltradas(filtradas);
  };

  const eliminar = (id) => {
    if (window.confirm('¿Deseas eliminar esta venta?')) {
      eliminarVenta(id).then(() => cargarVentas());
    }
  };

  const toggleDetalles = (id_venta) => {
    if (detallesVisibles[id_venta]) {
      setDetallesVisibles(prev => ({ ...prev, [id_venta]: null }));
    } else {
      getDetallesPorVenta(id_venta)
        .then(res => setDetallesVisibles(prev => ({ ...prev, [id_venta]: res.data })))
        .catch(err => console.error('Error al obtener detalles:', err));
    }
  };

  const cambiarEstadoPagado = async (venta) => {
    if (user?.rol !== 'admin') return; // Solo admins pueden cambiar estado
    try {
      await actualizarEstadoPagado(venta.id_venta, !venta.pagado);
      cargarVentas();
    } catch (error) {
      console.error("Error al actualizar estado de pago:", error);
    }
  };

  return (
    <div className="container">
      <div className="glass-container">
        {mostrandoFormulario && user?.rol === 'admin' ? (
          <FormularioVenta onCancel={() => setMostrandoFormulario(false)} onSuccess={() => { cargarVentas(); setMostrandoFormulario(false); }} />
        ) : (
          <>
            <div className="title-glass d-flex align-items-center justify-content-between mb-4">
              <h2>Ventas</h2>
              <img src="/stonks.png" alt="Ventas" style={{ width: '107px', height: '107px' }} />
            </div>

            <div className="d-flex align-items-center mb-3 gap-2">
              <input className="search-input" placeholder="Buscar por cliente..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
              {/* 3. Botón solo para administradores */}
              {user?.rol === 'admin' && (
                <button className="btn-create" onClick={() => setMostrandoFormulario(true)}>
                  Nueva Venta
                </button>
              )}
            </div>

            <table className="table-glass">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th style={{ cursor: 'pointer' }} onClick={() => setOrdenAscendente(p => !p)}>Fecha {ordenAscendente ? '↑' : '↓'}</th>
                  <th>Total</th>
                  <th>Pagado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ventasFiltradas.map(v => (
                  <React.Fragment key={v.id_venta}>
                    <tr>
                      <td>{v.cliente}</td>
                      <td>{new Date(v.fecha).toLocaleDateString()}</td>
                      <td>${parseInt(v.precio_total)}</td>
                      <td>
                        {/* 4. Lógica de rol para el botón de pago */}
                        <button
                          className={`btn btn-sm ${v.pagado ? 'btn-success' : 'btn-danger'}`}
                          style={{ cursor: user?.rol === 'admin' ? 'pointer' : 'default', minWidth: '90px' }}
                          onClick={() => cambiarEstadoPagado(v)}
                          disabled={user?.rol !== 'admin'}
                        >
                          {v.pagado ? 'Sí' : 'No'}
                        </button>
                      </td>
                      <td>
                        <button className="btn-action me-2" onClick={() => toggleDetalles(v.id_venta)}>
                          {detallesVisibles[v.id_venta] ? 'Ocultar' : 'Ver Detalle'}
                        </button>
                        {/* 5. Botón de eliminar solo para administradores */}
                        {user?.rol === 'admin' && (
                          <button className="btn-action btn-delete" onClick={() => eliminar(v.id_venta)}>Eliminar</button>
                        )}
                      </td>
                    </tr>
                    {detallesVisibles[v.id_venta] && (
                      <tr>
                        <td colSpan="5">
                          {/* ... tabla de detalles ... */}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default Ventas;