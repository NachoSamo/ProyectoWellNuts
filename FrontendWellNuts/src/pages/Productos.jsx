import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { getProductos, crearProducto, modificarProducto, eliminarProducto } from '../services/productosService';
import { getVariedades } from '../services/variedadProductoService';
import Variedades from '../components/Variedades';
import FormularioProducto from '../components/forms/FormularioProducto';
import ConfirmModal from '../components/ConfirmModal'; 
import '../styles/glass.css';

const Productos = () => {
  const { user } = useAuth();
  const [productos, setProductos] = useState([]);
  const [variedades, setVariedades] = useState([]);
  const [modoFormulario, setModoFormulario] = useState(null);
  const [productoEditando, setProductoEditando] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [mostrarVariedades, setMostrarVariedades] = useState(false);
  const [variedadesCargadas, setVariedadesCargadas] = useState(false);

  // Estados para el modal de confirmación
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemParaEliminar, setItemParaEliminar] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const cargarProductos = useCallback(() => {
    getProductos()
      .then(res => setProductos(res.data))
      .catch(err => console.error('Error al cargar productos:', err));
  }, []);

  const cargarVariedades = useCallback(() => {
    getVariedades()
      .then(res => {
        setVariedades(res.data);
        setVariedadesCargadas(true);
      })
      .catch(err => console.error('Error al cargar variedades:', err));
  }, []);

  useEffect(() => {
    cargarProductos();
    if (user?.rol === 'admin') {
      cargarVariedades();
    }
  }, [user, cargarProductos, cargarVariedades]);

  const onSubmit = data => {
    const action = modoFormulario === 'crear'
      ? crearProducto(data)
      : modificarProducto(productoEditando.id_producto, data);

    action.then(() => {
      cargarProductos();
      cancelarFormulario();
    }).catch(err => console.error(`Error al ${modoFormulario} producto:`, err));
  };

  const editarProducto = producto => {
    setModoFormulario('editar');
    setProductoEditando(producto);
    reset({ ...producto, id_variedad: producto.id_variedad.toString() });
  };

  const abrirModalConfirmacion = (id) => {
    setItemParaEliminar(id);
    setShowConfirmModal(true);
  };

  const eliminarProductoHandler = () => {
    if (itemParaEliminar) {
      eliminarProducto(itemParaEliminar)
        .then(() => {
          cargarProductos();
        })
        .catch(err => {
          console.error('Error al eliminar producto:', err);
          alert('No se pudo eliminar el producto.');
        })
        .finally(() => {
          setShowConfirmModal(false);
          setItemParaEliminar(null);
        });
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
        {mostrarVariedades && user?.rol === 'admin' ? (
          <Variedades onVolver={() => { setMostrarVariedades(false); cargarVariedades(); }} />
        ) : modoFormulario && user?.rol === 'admin' ? (
          variedadesCargadas ? (
            <FormularioProducto {...{ modoFormulario, variedades, onSubmit, onCancel: cancelarFormulario, register, handleSubmit, errors }} />
          ) : (<p className="text-white">Cargando variedades...</p>)
        ) : (
          <>
            <div className="title-glass d-flex align-items-center justify-content-between mb-4">
              <h2 className="title-glass">Productos</h2>
              <img src="/Product.png" alt="Producto" style={{ width: '107px', height: '107px' }} />
            </div>
            <div className="d-flex align-items-center mb-3 gap-2">
              <input className="search-input" placeholder="Buscar producto" value={filtro} onChange={e => setFiltro(e.target.value)} />
              {user?.rol === 'admin' && (
                <>
                  <button className="btn-create" onClick={() => { setModoFormulario('crear'); cargarVariedades(); }}>
                    Agregar Producto
                  </button>
                  <button className="btn btn-info" onClick={() => setMostrarVariedades(true)}>Variedades</button>
                </>
              )}
            </div>
            <table className="table-glass">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Precio proveedor</th>
                  <th>Precio actual</th>
                  <th>Tamaño</th>
                  <th>Variedad</th>
                  {user?.rol === 'admin' && <th>Acciones</th>}
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
                    {user?.rol === 'admin' && (
                      <td>
                        <button className="btn-action btn-edit me-2" onClick={() => editarProducto(prod)}>Editar</button>
                        <button className="btn-action btn-delete" onClick={() => abrirModalConfirmacion(prod.id_producto)}>Eliminar</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
      <ConfirmModal
        show={showConfirmModal}
        onConfirm={eliminarProductoHandler}
        onCancel={() => setShowConfirmModal(false)}
        title="Eliminar Producto"
        message="¿Estás seguro de que quieres eliminar este producto? Esta acción es irreversible."
      />
    </div>
  );
};

export default Productos;