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

  return (
    <div>
      <h4>Registrar Venta</h4>
      <div className="mb-3">
        <label>Cliente</label>
        <select className="form-select" value={id_cliente} onChange={e => setIdCliente(e.target.value)}>
          <option value="">Seleccione</option>
          {clientes.map(c => (
            <option key={c.id_cliente} value={c.id_cliente}>{c.nombre} {c.apellido}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label>Fecha</label>
        <input type="date" className="form-control" value={fecha} onChange={e => setFecha(e.target.value)} />
      </div>

      <div className="mb-3 form-check">
        <input type="checkbox" className="form-check-input" checked={pagado} onChange={e => setPagado(e.target.checked)} />
        <label className="form-check-label">Pagado</label>
      </div>

      <hr />

      <h5>Agregar Productos</h5>
      <div className="row mb-2">
        <div className="col">
          <select
            className="form-select"
            value={productoSeleccionado || ''}
            onChange={e => setProductoSeleccionado(e.target.value)}
          >
            <option value="">Seleccione</option>
            {productos.map(p => (
              <option 
                key={p.id_producto} 
                value={p.id_producto} 
                disabled={Math.floor(p.stock_disponible) < 1}
              >
                {p.nombre_producto} - {p.nombre_variedad} - ${p.precio_actual} ({Math.floor(p.stock_disponible)} disp.)
              </option>
            ))}
          </select>
        </div>
        <div className="col">
          <input type="number" className="form-control" value={cantidad} onChange={e => setCantidad(Number(e.target.value))} />
        </div>
        <div className="col">
          <button className="btn btn-success" onClick={agregarDetalle}>Agregar</button>
        </div>
      </div>

      <ul className="list-group mb-3">
        {detalles.map((d, i) => (
          <li key={i} className="list-group-item">
            {d.nombre_producto} - Cantidad: {d.cantidad} - Precio unitario: ${d.precio_unitario}
          </li>
        ))}
      </ul>

      <button className="btn btn-primary me-2" onClick={guardarVenta}>Guardar Venta</button>
      <button className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
    </div>
  );
};

export default FormularioVenta;
