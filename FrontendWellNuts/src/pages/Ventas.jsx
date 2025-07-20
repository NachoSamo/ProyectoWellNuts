import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getVentas, eliminarVenta, actualizarEstadoPagado } from "../services/ventasService";
import { getDetallesPorVenta } from "../services/detalleVentasService";
import FormularioVenta from '../components/forms/FormularioVenta';
import ConfirmModal from '../components/ConfirmModal'; 
import '../styles/glass.css';

const Ventas = () => {
  const { user } = useAuth();
  const [ventas, setVentas] = useState([]);
  const [ventasFiltradas, setVentasFiltradas] = useState([]);
  const [detallesVisibles, setDetallesVisibles] = useState({});
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [ordenAscendente, setOrdenAscendente] = useState(false);
  const [filtroPagado, setFiltroPagado] = useState("todos");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemParaEliminar, setItemParaEliminar] = useState(null);

  const cargarVentas = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await getVentas();
      setVentas(response.data);
    } catch (err) {
      console.error('Error al cargar ventas:', err);
      setError('No se pudieron cargar las ventas.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarVentas();
  }, [cargarVentas]);

  useEffect(() => {
    let filtradas = [...ventas];
    if (busqueda.trim()) {
      filtradas = filtradas.filter(v => v.cliente?.toLowerCase().includes(busqueda.toLowerCase()));
    }
    if (filtroPagado === "si") {
      filtradas = filtradas.filter(v => v.pagado);
    } else if (filtroPagado === "no") {
      filtradas = filtradas.filter(v => !v.pagado);
    }
    filtradas.sort((a, b) => {
      const fechaA = new Date(a.fecha);
      const fechaB = new Date(b.fecha);
      return ordenAscendente ? fechaA - fechaB : fechaB - fechaA;
    });
    setVentasFiltradas(filtradas);
  }, [ventas, busqueda, ordenAscendente, filtroPagado]);

  const abrirModalConfirmacion = (id) => {
    setItemParaEliminar(id);
    setShowConfirmModal(true);
  };

  const handleEliminar = async () => {
    if (itemParaEliminar) {
      try {
        await eliminarVenta(itemParaEliminar);
        cargarVentas();
      } catch (err) {
        console.error("Error al eliminar venta:", err);
        alert("No se pudo eliminar la venta.");
      } finally {
        setShowConfirmModal(false);
        setItemParaEliminar(null);
      }
    }
  };

  const toggleDetalles = async (id_venta) => {
    if (detallesVisibles[id_venta]) {
      setDetallesVisibles(prev => ({ ...prev, [id_venta]: null }));
    } else {
      try {
        const response = await getDetallesPorVenta(id_venta);
        setDetallesVisibles(prev => ({ ...prev, [id_venta]: response.data }));
      } catch (err) {
        console.error('Error al obtener detalles:', err);
        alert("No se pudieron cargar los detalles de la venta.");
      }
    }
  };

  const handleChangeEstadoPagado = async (venta) => {
    if (user?.rol !== 'admin') return;
    try {
      await actualizarEstadoPagado(venta.id_venta, !venta.pagado);
      setVentas(prevVentas => prevVentas.map(v =>
        v.id_venta === venta.id_venta ? { ...v, pagado: !v.pagado } : v
      ));
    } catch (error) {
      console.error("Error al actualizar estado de pago:", error);
      alert("No se pudo cambiar el estado de pago.");
    }
  };

  const textoFiltroPagado = () => {
    if (filtroPagado === 'si') return 'Pagadas';
    if (filtroPagado === 'no') return 'No Pagadas';
    return 'Todas';
  };

  const handleSuccessForm = () => {
    setMostrandoFormulario(false);
    cargarVentas();
  };

  if (isLoading) {
    return <div className="container"><div className="glass-container text-center"><p className="text-white">Cargando ventas...</p></div></div>;
  }

  if (error) {
    return <div className="container"><div className="glass-container text-center"><p className="error-msg">{error}</p></div></div>;
  }

  return (
    <div className="container">
      <div className="glass-container">
        {mostrandoFormulario && user?.rol === 'admin' ? (
          <FormularioVenta onCancel={() => setMostrandoFormulario(false)} onSuccess={handleSuccessForm} />
        ) : (
          <>
            <div className="title-glass d-flex align-items-center justify-content-between mb-4">
              <h2>Ventas</h2>
              <img src="/stonks.png" alt="Ventas" style={{ width: '107px', height: '107px' }} />
            </div>
            <div className="d-flex flex-wrap align-items-center mb-3 gap-2">
              <input className="search-input" placeholder="Buscar por cliente..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
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
                  <th style={{ cursor: 'pointer' }} onClick={() => setOrdenAscendente(prev => !prev)}>Fecha {ordenAscendente ? '▲' : '▼'}</th>
                  <th>Total</th>
                  <th style={{ cursor: 'pointer' }} onClick={() => setFiltroPagado(prev => prev === 'todos' ? 'si' : prev === 'si' ? 'no' : 'todos')}>Pagado ({textoFiltroPagado()})</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ventasFiltradas.length > 0 ? ventasFiltradas.map(v => (
                  <React.Fragment key={v.id_venta}>
                    <tr>
                      <td>{v.cliente}</td>
                      <td>{new Date(v.fecha).toLocaleDateString()}</td>
                      <td>${parseInt(v.precio_total)}</td>
                      <td>
                        <button
                          className={`btn btn-sm ${v.pagado ? 'btn-success' : 'btn-danger'}`}
                          style={{ cursor: user?.rol === 'admin' ? 'pointer' : 'default', minWidth: '90px', borderRadius: '20px' }}
                          onClick={() => handleChangeEstadoPagado(v)}
                          disabled={user?.rol !== 'admin'}
                        >
                          {v.pagado ? 'Sí' : 'No'}
                        </button>
                      </td>
                      <td>
                        <button className="btn-action me-2" onClick={() => toggleDetalles(v.id_venta)}>
                          {detallesVisibles[v.id_venta] ? 'Ocultar' : 'Ver Detalle'}
                        </button>
                        {user?.rol === 'admin' && (
                          <button className="btn-action btn-delete" onClick={() => abrirModalConfirmacion(v.id_venta)}>Eliminar</button>
                        )}
                      </td>
                    </tr>
                    {detallesVisibles[v.id_venta] && (
                      <tr className="detalle-venta-row">
                        <td colSpan="5" style={{ padding: '0.5rem', backgroundColor: 'rgba(36, 41, 56, 0.8)' }}>
                          <div className="p-3">
                            <h6 className="text-white mb-2">Detalles de la Venta</h6>
                            <table className="table-glass table-sm">
                              <thead>
                                <tr>
                                  <th>Producto</th>
                                  <th>Cantidad</th>
                                  <th>Precio Unitario</th>
                                  <th>Subtotal</th>
                                </tr>
                              </thead>
                              <tbody>
                                {detallesVisibles[v.id_venta].map(d => (
                                  <tr key={d.id_detalle}>
                                    <td>{`${d.nombre_variedad} - ${d.nombre_producto} (${d.tamaño_gramos}u)`}</td>
                                    <td>{d.cantidad}</td>
                                    <td>${d.precio_unitario}</td>
                                    <td>${(d.cantidad * d.precio_unitario)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )) : (
                  <tr>
                    <td colSpan="5" className="text-center p-4">No se encontraron ventas con los filtros actuales.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </div>
      <ConfirmModal
        show={showConfirmModal}
        onConfirm={handleEliminar}
        onCancel={() => setShowConfirmModal(false)}
        title="Eliminar Venta"
        message="¿Estás seguro de que quieres eliminar esta venta? Esta acción es irreversible."
      />
    </div>
  );
};

export default Ventas;