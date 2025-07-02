import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  getProductos,
  crearProducto,
  modificarProducto,
  eliminarProducto
} from '../services/productosService';
import { getVariedades } from '../services/variedadProductoService';
import Variedades from '../components/Variedades';
import '../styles/glass.css';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [variedades, setVariedades] = useState([]);
  const [modoFormulario, setModoFormulario] = useState(null);
  const [productoEditando, setProductoEditando] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [mostrarVariedades, setMostrarVariedades] = useState(false);
  const [variedadesCargadas, setVariedadesCargadas] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    cargarProductos();
    cargarVariedades();
  }, []);

  const cargarProductos = () => {
    getProductos()
      .then(res => setProductos(res.data))
      .catch(err => console.error(err));
  };

  const cargarVariedades = () => {
    getVariedades()
      .then(res => {
        setVariedades(res.data);
        setVariedadesCargadas(true);
      })
      .catch(err => console.error(err));
  };

  const onSubmit = data => {
    if (modoFormulario === 'crear') {
      crearProducto(data)
        .then(() => {
          cargarProductos();
          cancelarFormulario();
        });
    } else if (modoFormulario === 'editar') {
      modificarProducto(productoEditando.id_producto, data)
        .then(() => {
          cargarProductos();
          cancelarFormulario();
        });
    }
  };

  const editarProducto = producto => {
    setModoFormulario('editar');
    setProductoEditando(producto);
    reset({
      ...producto,
      id_variedad: producto.id_variedad.toString()
    });
  };

  const eliminarProductoHandler = id => {
    if (confirm('¿Eliminar producto?')) {
      eliminarProducto(id).then(() => cargarProductos());
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
    <div className="container">
      <div className="glass-container">
        {mostrarVariedades ? (
          <Variedades
            onVolver={() => {
              setMostrarVariedades(false);
              cargarVariedades();
            }}
          />
        ) : modoFormulario ? (
          variedadesCargadas ? (
            <>
              <h2 className="title-glass">
                {modoFormulario === 'crear' ? 'Agregar Producto' : 'Editar Producto'}
              </h2>
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
                  <label className="form-label">Tamaño</label>
                  <input type="number" className="form-control" {...register('tamaño_gramos', { required: 'Campo requerido', min: { value: 1, message: 'Debe ser positivo' } })} />
                  {errors.tamaño_gramos && <p className="text-danger">{errors.tamaño_gramos.message}</p>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Variedad</label>
                  <select className="form-select" {...register('id_variedad', { required: 'Campo requerido' })}>
                    <option value="">Seleccione una variedad</option>
                    {variedades.map(v => (
                      <option key={v.id_variedad} value={v.id_variedad}>
                        {v.nombre_variedad}
                      </option>
                    ))}
                  </select>
                  {errors.id_variedad && <p className="text-danger">{errors.id_variedad.message}</p>}
                </div>
                <button type="submit" className="btn btn-primary me-2">Guardar</button>
                <button type="button" className="btn btn-secondary" onClick={cancelarFormulario}>Cancelar</button>
              </form>
            </>
          ) : (
            <p className="text-white">Cargando variedades...</p>
          )
        ) : (
          <>
            <div className="title-glass d-flex align-items-center justify-content-between mb-4">
              <h2 className="title-glass">Productos</h2>
              <img src="/Product.png" alt="Producto" style={{ width: '107px', height: '107px' }} />
            </div>

            <div className="d-flex align-items-center mb-3 gap-2">
              <input
                className="search-input"
                placeholder="Buscar producto"
                value={filtro}
                onChange={e => setFiltro(e.target.value)}
              />
              <button className="btn-create" onClick={() => {
                setModoFormulario('crear');
                cargarVariedades();
              }}>
                Agregar Producto
              </button>
              <button className="btn btn-info" onClick={() => setMostrarVariedades(true)}>Variedades</button>
            </div>

            <table className="table-glass">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Precio proveedor</th>
                  <th>Precio actual</th>
                  <th>Tamaño</th>
                  <th>Variedad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosFiltrados.map(prod => (
                  <tr key={prod.id_producto}>
                    <td>{prod.nombre_producto}</td>
                    <td>${prod.precio_proveedor.toFixed(0)}</td>
                    <td>${prod.precio_actual.toFixed(0)}</td>
                    <td>{prod.tamaño_gramos}</td>
                    <td>{prod.nombre_variedad}</td>
                    <td>
                      <button className="btn-action btn-edit me-2" onClick={() => editarProducto(prod)}>Editar</button>
                      <button className="btn-action btn-delete" onClick={() => eliminarProductoHandler(prod.id_producto)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default Productos;
