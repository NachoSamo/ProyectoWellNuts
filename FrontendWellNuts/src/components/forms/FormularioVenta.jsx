import React, { useEffect, useState } from 'react';
// 1. LA CORRECCIÓN CLAVE: Importamos nuestra instancia de Axios configurada
import apiClient from '../../services/api'; // Asegúrate de que la ruta sea correcta

const FormularioVenta = ({ onCancel, onSuccess }) => {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [idCliente, setIdCliente] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]); // Fecha por defecto: hoy
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
        setError('No se pudieron cargar los clientes o productos. Verifique su sesión.');
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
      nombre_producto: producto.nombre_producto,
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
        detalles
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
      <h4 className="mb-4 text-center">Registrar Venta</h4>
      {error && <p className="error-msg text-center">{error}</p>}
      
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">Cliente</label>
          <select className="form-select" value={idCliente} onChange={e => setIdCliente(e.target.value)}>
            <option value="">Seleccione un cliente</option>
            {clientes.map(c => (
              <option key={c.id_cliente} value={c.id_cliente}>{c.nombre} {c.apellido}</option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Fecha</label>
          <input type="date" className="form-control" value={fecha} onChange={e => setFecha(e.target.value)} />
        </div>
      </div>

      <div className="form-check mb-4">
        <input type="checkbox" className="form-check-input" id="pagadoCheck" checked={pagado} onChange={e => setPagado(e.target.checked)} />
        <label className="form-check-label ms-2" htmlFor="pagadoCheck">Marcar como Pagado</label>
      </div>
      <hr style={{borderColor: 'rgba(255,255,255,0.1)'}} />
      <h5 className="mb-3">Agregar Productos</h5>
      <div className="row g-2 align-items-end mb-3">
        <div className="col-md-6">
          <label className="form-label">Producto</label>
          <select className="form-select" value={productoSeleccionado} onChange={e => setProductoSeleccionado(e.target.value)}>
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
          <input type="number" min="1" className="form-control" placeholder="Cant." value={cantidad} onChange={e => setCantidad(Number(e.target.value))} />
        </div>
        <div className="col-md-3">
          <button className="btn btn-success w-100" onClick={agregarDetalle}>Agregar</button>
        </div>
      </div>

      <ul className="list-group mb-4">
        {detalles.map((d, i) => (
          <li key={i} className="list-group-item d-flex justify-content-between align-items-center" style={{backgroundColor: 'rgba(255,255,255,0.05)', border: 'none'}}>
            <span>{d.nombre_producto} - {d.cantidad} x ${d.precio_unitario.toFixed(2)}</span>
            <button className="btn-action btn-delete btn-sm" onClick={() => eliminarDetalle(i)}>X</button>
          </li>
        ))}
      </ul>

      <div className="d-flex justify-content-end gap-2">
        <button className="btn-action btn-delete" onClick={onCancel}>Cancelar</button>
        <button className="btn-create" onClick={guardarVenta}>Guardar Venta</button>
      </div>
    </div>
  );
};

export default FormularioVenta;