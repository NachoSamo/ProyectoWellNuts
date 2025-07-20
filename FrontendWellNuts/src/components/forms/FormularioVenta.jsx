
import React, { useEffect, useState } from 'react';
import apiClient from '../../services/api';

const FormularioVenta = ({ onCancel, onSuccess }) => {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [idCliente, setIdCliente] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [pagado, setPagado] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [detalles, setDetalles] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError('');
        const resClientes = await apiClient.get('/clientes');
        const resProductos = await apiClient.get('/productos');
        setClientes(resClientes.data);
        setProductos(resProductos.data);
      } catch (err) {
        console.error("Error al cargar datos para el formulario:", err);
        setError('No se pudieron cargar los clientes o productos.');
      }
    };
    fetchData();
  }, []);

  const agregarDetalle = () => {
    if (!productoSeleccionado || cantidad <= 0) {
      alert("Debe seleccionar un producto y una cantidad válida.");
      return;
    }

    const producto = productos.find(p => p.id_producto === parseInt(productoSeleccionado));
    if (!producto) return;

    const stockDisponible = Math.floor(producto.stock_disponible) || 0;
    if (cantidad > stockDisponible) {
      alert(`No hay suficiente stock. Máximo disponible: ${stockDisponible}`);
      return;
    }

    const nuevoDetalle = {
      id_producto: producto.id_producto,
      nombre_producto: `${producto.nombre_variedad} - ${producto.nombre_producto} (${producto.tamaño_gramos}u)`, // Nombre completo
      cantidad: Number(cantidad),
      precio_unitario: producto.precio_actual
    };

    setDetalles(prev => [...prev, nuevoDetalle]);
    setProductoSeleccionado('');
    setCantidad(1);
  };

  const eliminarDetalle = (index) => {
    setDetalles(prev => prev.filter((_, i) => i !== index));
  };

  const guardarVenta = async () => {
    if (!idCliente || !fecha || detalles.length === 0) {
      alert("Debe completar el cliente, la fecha y agregar al menos un producto.");
      return;
    }
    
    try {
      const data = {
        fecha,
        id_cliente: parseInt(idCliente),
        pagado,
        detalles: detalles.map(({ nombre_producto, ...resto }) => resto) // Quitamos el nombre completo antes de enviar
      };
      await apiClient.post('/ventas/completa', data);
      onSuccess();
    } catch (error) {
      console.error('Error al guardar venta:', error);
      alert(error.response?.data?.msg || 'Error al guardar la venta');
    }
  };

  return (
    <div className="venta-form-card">
      <h4 className="title-glass mb-4 text-center">Registrar Venta</h4>
      {error && <p className="error-msg text-center mb-3">{error}</p>}
      
      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <label className="form-label">Cliente</label>
          {/* CORRECCIÓN: Usar form-select y w-100 */}
          <select className="form-select w-100" value={idCliente} onChange={e => setIdCliente(e.target.value)}>
            <option value="">Seleccione un cliente</option>
            {clientes.map(c => (
              <option key={c.id_cliente} value={c.id_cliente}>{c.nombre} {c.apellido}</option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Fecha</label>
          {/* CORRECCIÓN: Usar form-control y w-100 */}
          <input type="date" className="form-control w-100" value={fecha} onChange={e => setFecha(e.target.value)} />
        </div>
      </div>

      <div className="form-check mb-4 d-flex align-items-center">
        <input type="checkbox" className="form-check-input" id="pagadoCheck" checked={pagado} onChange={e => setPagado(e.target.checked)} />
        <label className="form-check-label ms-2" htmlFor="pagadoCheck">Marcar como Pagado</label>
      </div>
      
      <hr style={{borderColor: 'rgba(255, 255, 255, 0.1)', margin: '2rem 0'}} />
      
      <h5 className="title-glass mb-3" style={{fontSize: '1.2rem'}}>Agregar Productos</h5>
      <div className="row g-2 align-items-end mb-3">
        <div className="col-md-6">
          <label className="form-label">Producto</label>
          {/* CORRECCIÓN: Usar form-select y w-100 */}
          <select className="form-select w-100" value={productoSeleccionado} onChange={e => setProductoSeleccionado(e.target.value)}>
            <option value="">Seleccione un producto</option>
            {productos.map(p => {
              const stock = Math.floor(p.stock_disponible) || 0;
              return (
                <option key={p.id_producto} value={p.id_producto} disabled={stock < 1}>
                  {`${p.nombre_variedad} - ${p.nombre_producto} (${p.tamaño_gramos}u)`} ({stock} disp.)
                </option>
              );
            })}
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Cantidad</label>
          {/* CORRECCIÓN: Usar form-control y w-100 */}
          <input type="number" min="1" className="form-control w-100" placeholder="Cant." value={cantidad} onChange={e => setCantidad(Number(e.target.value))} />
        </div>
        <div className="col-md-3">
          {/* CORRECCIÓN: Usar btn-create para consistencia */}
          <button className="btn-create w-100" onClick={agregarDetalle}>Agregar</button>
        </div>
      </div>

      <div className="details-list-container my-4">
        {detalles.map((d, i) => (
          <div key={i} className="detail-item">
            <span>{d.nombre_producto} - {d.cantidad} x ${d.precio_unitario.toFixed(2)}</span>
            <button className="btn-action btn-delete btn-sm" onClick={() => eliminarDetalle(i)}>×</button>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <button className="btn-action btn-delete" onClick={onCancel}>Cancelar</button>
        <button className="btn-create" onClick={guardarVenta}>Guardar Venta</button>
      </div>

      {/* Estilos específicos para este formulario para no tocar glass.css */}
      <style>{`
        .details-list-container {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        .detail-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: rgba(255, 255, 255, 0.05);
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            color: #e2e8f0;
        }
        .detail-item .btn-sm {
            padding: 2px 8px;
            font-size: 1rem;
            line-height: 1;
        }
      `}</style>
    </div>
  );
};

export default FormularioVenta;