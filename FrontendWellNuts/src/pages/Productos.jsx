import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [modoFormulario, setModoFormulario] = useState(null);
  const [productoEditando, setProductoEditando] = useState(null);
  const [filtro, setFiltro] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = () => {
    api.get('/productos')
      .then(res => setProductos(res.data))
      .catch(err => console.error(err));
  };

  const onSubmit = data => {
    if (modoFormulario === 'crear') {
      api.post('/productos', data)
        .then(() => {
          cargarProductos();
          cancelarFormulario();
        });
    } else if (modoFormulario === 'editar') {
      api.put(`/productos/${productoEditando.id_producto}`, data)
        .then(() => {
          cargarProductos();
          cancelarFormulario();
        });
    }
  };

  const editarProducto = producto => {
    setModoFormulario('editar');
    setProductoEditando(producto);
    reset(producto);
  };

  const eliminarProducto = id => {
    if (confirm('¿Eliminar producto?')) {
      api.delete(`/productos/${id}`).then(() => cargarProductos());
    }
  };

  const cancelarFormulario = () => {
    setModoFormulario(null);
    setProductoEditando(null);
    reset();
  };

  const productosFiltrados = productos.filter(p =>
    p.nombre_producto.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="container mt-4">
      {modoFormulario ? (
        <>
          <h2>{modoFormulario === 'crear' ? 'Agregar Producto' : 'Editar Producto'}</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input className="form-control" {...register('nombre_producto', { required: 'Campo requerido', maxLength: { value: 100, message: 'Máx. 100 caracteres' } })} />
              {errors.nombre_producto && <p className="text-danger">{errors.nombre_producto.message}</p>}
            </div>
            <div className="mb-3">
              <label className="form-label">Precio proveedor</label>
              <input type="number" step="0.01" className="form-control" {...register('precio_proveedor', { required: 'Campo requerido', min: { value: 0.01, message: 'Debe ser positivo' } })} />
              {errors.precio_proveedor && <p className="text-danger">{errors.precio_proveedor.message}</p>}
            </div>
            <div className="mb-3">
              <label className="form-label">Precio actual</label>
              <input type="number" step="0.01" className="form-control" {...register('precio_actual', { required: 'Campo requerido', min: { value: 0.01, message: 'Debe ser positivo' } })} />
              {errors.precio_actual && <p className="text-danger">{errors.precio_actual.message}</p>}
            </div>
            <div className="mb-3">
              <label className="form-label">Stock (gramos)</label>
              <input type="number" className="form-control" {...register('stock_gramos', { required: 'Campo requerido', min: { value: 1, message: 'Debe ser positivo' } })} />
              {errors.stock_gramos && <p className="text-danger">{errors.stock_gramos.message}</p>}
            </div>
            <button type="submit" className="btn btn-primary me-2">Guardar</button>
            <button type="button" className="btn btn-secondary" onClick={cancelarFormulario}>Cancelar</button>
          </form>
        </>
      ) : (
        <>
          <div className="d-flex align-items-center mb-3">
            <h2>Productos</h2>
            <img src='public/Product.png' style={{ width: '107px', height: '107px' }} />
          </div>
          <div className="d-flex align-items-center mb-3">
            <input
              className="form-control w-25 me-2"
              placeholder="Buscar producto"
              value={filtro}
              onChange={e => setFiltro(e.target.value)}
            />
            <button className="btn btn-success" onClick={() => setModoFormulario('crear')}>Agregar Producto</button>
          </div>
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Nombre</th>
                <th>Precio proveedor</th>
                <th>Precio actual</th>
                <th>Stock (g)</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map(prod => (
                <tr key={prod.id_producto}>
                  <td>{prod.nombre_producto}</td>
                  <td>${prod.precio_proveedor.toFixed(0)}</td>
                  <td>${prod.precio_actual.toFixed(0)}</td>
                  <td>{prod.stock_gramos}</td>
                  <td>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => editarProducto(prod)}>Editar</button>
                    <button className="btn btn-danger btn-sm" onClick={() => eliminarProducto(prod.id_producto)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Productos;
