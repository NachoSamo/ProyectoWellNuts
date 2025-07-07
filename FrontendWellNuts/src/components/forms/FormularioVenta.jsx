import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FormularioVenta = ({ onCancel, onSuccess }) => {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [id_cliente, setIdCliente] = useState('');
  const [fecha, setFecha] = useState('');
  const [pagado, setPagado] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [detalles, setDetalles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const resClientes = await axios.get('http://localhost:3000/api/clientes');
      const resProductos = await axios.get('http://localhost:3000/api/productos');
      setClientes(resClientes.data);
      setProductos(resProductos.data);
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

    const maxDisponible = Math.floor(producto.stock_disponible);
    if (cantidad > maxDisponible) {
      alert(`No hay suficiente stock. Máximo disponible: ${maxDisponible}`);
      return;
    }

    const nuevoDetalle = {
      id_producto: producto.id_producto,
      nombre_producto: producto.nombre_producto,
      cantidad: Number(cantidad),
      precio_unitario: producto.precio_actual
    };

    setDetalles(prev => [...prev, nuevoDetalle]);
    setProductoSeleccionado(null);
    setCantidad(1);
  };

  const guardarVenta = async () => {
    try {
      const data = {
        fecha,
        id_cliente: parseInt(id_cliente),
        pagado,
        detalles
      };
      await axios.post('http://localhost:3000/api/ventas/completa', data);
      onSuccess();
    } catch (error) {
      alert(error.response?.data || 'Error al guardar venta');
    }
  };

  // Calcular el último día del mes actual en formato yyyy-mm-dd
  const today = new Date();
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const maxFecha = lastDayOfMonth.toISOString().split('T')[0];

  return (
    <div className="venta-form-card">
  <h4 className="mb-4 text-center">Registrar Venta</h4>

  <div className="row mb-3">
    <div className="col-md-6">
      <label>Cliente</label>
      <select className="search-input w-100" value={id_cliente} onChange={e => setIdCliente(e.target.value)}>
        <option value="">Seleccione</option>
        {clientes.map(c => (
          <option key={c.id_cliente} value={c.id_cliente}>{c.nombre} {c.apellido}</option>
        ))}
      </select>
    </div>
    <div className="col-md-6">
      <label>Fecha</label>
      <input
        type="date"
        className="search-input w-100"
        value={fecha}
        onChange={e => setFecha(e.target.value)}
        max={maxFecha}
      />
    </div>
  </div>

  <div className="form-check mb-4">
    <input
      type="checkbox"
      className="form-check-input"
      id="pagadoCheck"
      checked={pagado}
      onChange={e => setPagado(e.target.checked)}
    />
    <label className="form-check-label ms-2" htmlFor="pagadoCheck">Pagado</label>
  </div>

  <hr />

  <h5 className="mb-3">Agregar Productos</h5>
  <div className="row mb-3">
    <div className="col-md-6 mb-2">
      <select
        className="search-input w-100"
        value={productoSeleccionado || ''}
        onChange={e => setProductoSeleccionado(e.target.value)}
      >
        <option value="">Seleccione producto</option>
        {productos.map(p => (
          <option key={p.id_producto} value={p.id_producto} disabled={Math.floor(p.stock_disponible) < 1}>
            {p.nombre_producto} - {p.nombre_variedad} - {p.tamaño_gramos}u - ${p.precio_actual} ({Math.floor(p.stock_disponible)} disp.)
          </option>
        ))}
      </select>
    </div>
    <div className="col-md-3 mb-2">
      <input
        type="number"
        className="search-input w-100"
        placeholder="Cantidad"
        value={cantidad}
        onChange={e => setCantidad(Number(e.target.value))}
      />
    </div>
    <div className="col-md-3 mb-2 d-grid">
      <button className="btn btn-success" onClick={agregarDetalle}>Agregar</button>
    </div>
  </div>

  <ul className="list-group mb-4">
    {detalles.map((d, i) => (
      <li key={i} className="list-group-item bg-dark text-white border-0 rounded mb-1">
        {d.nombre_producto} - Cantidad: {d.cantidad} - Precio: ${d.precio_unitario}
      </li>
    ))}
  </ul>

  <div className="d-flex justify-content-end gap-3">
    <button className="btn btn-primary" onClick={guardarVenta}>Guardar Venta</button>
    <button className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
  </div>
</div>
  );
};

export default FormularioVenta;
