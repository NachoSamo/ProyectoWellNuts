import React, { useEffect, useState } from 'react';
import { getVentas, eliminarVenta, actualizarEstadoPagado } from "../services/ventasService";
import { getDetallesPorVenta } from "../services/detalleVentasService";
import FormularioVenta from '../components/forms/FormularioVenta';
import '../styles/glass.css';

const Ventas = () => {
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
        setVentasFiltradas(res.data);
      })
      .catch(err => console.error('Error al cargar ventas:', err));
  };

  const filtrarVentas = () => {
    let filtradas = [...ventas];

    if (busqueda.trim()) {
      filtradas = filtradas.filter(v =>
        v.cliente.toLowerCase().includes(busqueda.toLowerCase())
      );
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
  };

  const eliminar = (id) => {
    if (confirm('¿Deseas eliminar esta venta?')) {
      eliminarVenta(id).then(() => cargarVentas());
    }
  };

  const toggleDetalles = (id_venta) => {
    if (detallesVisibles[id_venta]) {
      setDetallesVisibles(prev => ({ ...prev, [id_venta]: null }));
    } else {
      getDetallesPorVenta(id_venta)
        .then(res => {
          setDetallesVisibles(prev => ({ ...prev, [id_venta]: res.data }));
        })
        .catch(err => console.error('Error al obtener detalles:', err));
    }
  };

  const cambiarEstadoPagado = async (venta) => {
    try {
      await actualizarEstadoPagado(venta.id_venta, !venta.pagado);
      cargarVentas();
    } catch (error) {
      console.error("Error al actualizar estado de pago:", error);
    }
  };

  const toggleFiltroPagado = () => {
    setFiltroPagado(prev =>
      prev === "todos" ? "si" : prev === "si" ? "no" : "todos"
    );
  };

  const textoFiltroPagado = filtroPagado === "todos"
    ? "Todos"
    : filtroPagado === "si"
      ? "Sí"
      : "No";

  return (
    <div className="container">
      <div className="glass-container">
        {!mostrandoFormulario ? (
          <>
            <div className="title-glass d-flex align-items-center justify-content-between mb-4">
              <h2>Ventas</h2>
              <img src="/stonks.png" alt="Ventas" style={{ width: '107px', height: '107px' }} />
            </div>

            <div className="d-flex align-items-center mb-3 gap-2">
              <input
                className="search-input"
                placeholder="Buscar por cliente..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <button className="btn-create" onClick={() => setMostrandoFormulario(true)}>
                Nueva Venta
              </button>
            </div>

            <table className="table-glass">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th style={{ cursor: 'pointer' }} onClick={() => setOrdenAscendente(prev => !prev)}>
                    Fecha {ordenAscendente ? '↑' : '↓'}
                  </th>
                  <th>Total</th>
                  <th style={{ cursor: 'pointer' }} onClick={toggleFiltroPagado}>
                    Pagado: {textoFiltroPagado}
                  </th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ventasFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">No se encuentran resultados</td>
                  </tr>
                ) : (
                  ventasFiltradas.map(v => (
                    <React.Fragment key={v.id_venta}>
                      <tr>
                        <td>{v.cliente}</td>
                        <td>{new Date(v.fecha).toLocaleDateString()}</td>
                        <td>${parseInt(v.precio_total)}</td>
                        <td>
                          <button
                            className={`btn btn-sm ${v.pagado ? 'btn-success' : 'btn-danger'}`}
                            onClick={() => cambiarEstadoPagado(v)}
                          >
                            {v.pagado ? 'Sí' : 'No'}
                          </button>
                        </td>
                        <td>
                          <button className="btn-action btn-primary me-2" onClick={() => toggleDetalles(v.id_venta)}>
                            {detallesVisibles[v.id_venta] ? 'Ocultar Detalles' : 'Ver Detalle'}
                          </button>
                          <button className="btn-action btn-delete" onClick={() => eliminar(v.id_venta)}>Eliminar</button>
                        </td>
                      </tr>
                      {detallesVisibles[v.id_venta] && (
                        <tr>
                          <td colSpan="5">
                            <table className="table-glass">
                              <thead>
                                <tr>
                                  <th>Producto</th>
                                  <th>Cantidad</th>
                                  <th>Precio Unitario</th>
                                </tr>
                              </thead>
                              <tbody>
                                {detallesVisibles[v.id_venta].map(d => (
                                  <tr key={d.id_detalle}>
                                    <td>{d.nombre_producto}</td>
                                    <td>{d.cantidad}</td>
                                    <td>${d.precio_unitario.toFixed(2)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </>
        ) : (
          <FormularioVenta
            onCancel={() => setMostrandoFormulario(false)}
            onSuccess={() => {
              cargarVentas();
              setMostrandoFormulario(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Ventas;
