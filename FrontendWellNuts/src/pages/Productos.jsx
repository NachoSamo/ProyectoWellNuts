// src/components/Productos.jsx
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
import FormularioProducto from '../components/forms/FormularioProducto'; // Importar el nuevo componente del formulario
import '../styles/glass.css';

const Productos = () => {
  // Estados para la gestión de productos, variedades y UI
  const [productos, setProductos] = useState([]);
  const [variedades, setVariedades] = useState([]);
  const [modoFormulario, setModoFormulario] = useState(null); // 'crear', 'editar' o null
  const [productoEditando, setProductoEditando] = useState(null); // Producto actualmente en edición
  const [filtro, setFiltro] = useState(''); // Filtro para la tabla de productos
  const [mostrarVariedades, setMostrarVariedades] = useState(false); // Controla la visibilidad del componente Variedades
  const [variedadesCargadas, setVariedadesCargadas] = useState(false); // Indica si las variedades ya se cargaron
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Estado para mostrar el modal de confirmación
  const [productIdToDelete, setProductIdToDelete] = useState(null); // ID del producto a eliminar

  // Inicialización de react-hook-form para el manejo del formulario
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Efecto para cargar productos y variedades al montar el componente
  useEffect(() => {
    cargarProductos();
    cargarVariedades();
  }, []);

  /**
   * Carga la lista de productos desde el servicio.
   */
  const cargarProductos = () => {
    getProductos()
      .then(res => setProductos(res.data))
      .catch(err => console.error('Error al cargar productos:', err));
  };

  /**
   * Carga la lista de variedades desde el servicio.
   */
  const cargarVariedades = () => {
    getVariedades()
      .then(res => {
        setVariedades(res.data);
        setVariedadesCargadas(true);
      })
      .catch(err => console.error('Error al cargar variedades:', err));
  };

  /**
   * Maneja el envío del formulario, ya sea para crear o modificar un producto.
   * @param {object} data - Datos del formulario.
   */
  const onSubmit = data => {
    if (modoFormulario === 'crear') {
      crearProducto(data)
        .then(() => {
          cargarProductos(); // Recargar productos después de la creación
          cancelarFormulario(); // Resetear el formulario
        })
        .catch(err => console.error('Error al crear producto:', err));
    } else if (modoFormulario === 'editar') {
      modificarProducto(productoEditando.id_producto, data)
        .then(() => {
          cargarProductos(); // Recargar productos después de la modificación
          cancelarFormulario(); // Resetear el formulario
        })
        .catch(err => console.error('Error al modificar producto:', err));
    }
  };

  /**
   * Prepara el formulario para editar un producto existente.
   * @param {object} producto - El producto a editar.
   */
  const editarProducto = producto => {
    setModoFormulario('editar');
    setProductoEditando(producto);
    // Resetear el formulario con los datos del producto a editar
    reset({
      ...producto,
      id_variedad: producto.id_variedad.toString() // Asegurar que id_variedad sea string para el select
    });
  };

  /**
   * Abre el modal de confirmación para eliminar un producto.
   * @param {number} id - ID del producto a eliminar.
   */
  const confirmarEliminarProducto = (id) => {
    setProductIdToDelete(id);
    setShowConfirmModal(true);
  };

  /**
   * Maneja la eliminación de un producto después de la confirmación.
   */
  const eliminarProductoHandler = () => {
    if (productIdToDelete) {
      eliminarProducto(productIdToDelete)
        .then(() => {
          cargarProductos(); // Recargar productos después de la eliminación
          setShowConfirmModal(false); // Cerrar el modal
          setProductIdToDelete(null); // Limpiar el ID
        })
        .catch(err => {
          console.error('Error al eliminar producto:', err);
          setShowConfirmModal(false); // Cerrar el modal incluso si hay error
          setProductIdToDelete(null);
        });
    }
  };

  /**
   * Cancela el modo formulario y resetea el estado.
   */
  const cancelarFormulario = () => {
    setModoFormulario(null);
    setProductoEditando(null);
    reset(); // Limpiar los campos del formulario
  };

  /**
   * Filtra los productos basándose en el texto de búsqueda.
   */
  const productosFiltrados = productos.filter(p =>
    p.nombre_producto.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="container">
      <div className="glass-container">
        {/* Renderizado condicional según el estado de la UI */}
        {mostrarVariedades ? (
          // Si se debe mostrar el componente Variedades
          <Variedades
            onVolver={() => {
              setMostrarVariedades(false);
              cargarVariedades(); // Recargar variedades al volver
            }}
          />
        ) : modoFormulario ? (
          // Si se está en modo formulario (crear o editar)
          variedadesCargadas ? (
            // Si las variedades ya están cargadas, mostrar el FormularioProducto
            <FormularioProducto
              modoFormulario={modoFormulario}
              variedades={variedades}
              onSubmit={onSubmit}
              onCancel={cancelarFormulario}
              register={register}
              handleSubmit={handleSubmit}
              errors={errors}
            />
          ) : (
            // Mensaje de carga si las variedades aún no están listas
            <p className="text-white">Cargando variedades...</p>
          )
        ) : (
          // Si no se está en modo formulario ni mostrando variedades, mostrar la tabla de productos
          <>
            {/* Encabezado de la sección de productos */}
            <div className="title-glass d-flex align-items-center justify-content-between mb-4">
              <h2 className="title-glass">Productos</h2>
              {/* Imagen decorativa */}
              <img src="/Product.png" alt="Producto" style={{ width: '107px', height: '107px' }} />
            </div>

            {/* Controles de búsqueda y botones de acción */}
            <div className="d-flex align-items-center mb-3 gap-2">
              {/* Campo de búsqueda */}
              <input
                className="search-input"
                placeholder="Buscar producto"
                value={filtro}
                onChange={e => setFiltro(e.target.value)}
              />
              {/* Botón para agregar producto */}
              <button
                className="btn-create"
                onClick={() => {
                  setModoFormulario('crear'); // Cambiar a modo crear
                  cargarVariedades(); // Asegurarse de que las variedades estén cargadas
                }}
              >
                Agregar Producto
              </button>
              {/* Botón para ir a la gestión de variedades */}
              <button className="btn btn-info" onClick={() => setMostrarVariedades(true)}>Variedades</button>
            </div>

            {/* Tabla de productos */}
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
                {/* Mapear los productos filtrados para mostrar en la tabla */}
                {productosFiltrados.map(prod => (
                  <tr key={prod.id_producto}>
                    <td>{prod.nombre_producto}</td>
                    <td>${prod.precio_proveedor.toFixed(0)}</td>
                    <td>${prod.precio_actual.toFixed(0)}</td>
                    <td>{prod.tamaño_gramos}</td>
                    <td>{prod.nombre_variedad}</td>
                    <td>
                      {/* Botones de acción para cada producto */}
                      <button className="btn-action btn-edit me-2" onClick={() => editarProducto(prod)}>Editar</button>
                      <button className="btn-action btn-delete" onClick={() => confirmarEliminarProducto(prod.id_producto)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* Modal de confirmación para eliminar producto */}
        {showConfirmModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <p>¿Estás seguro de que quieres eliminar este producto?</p>
              <div className="modal-actions">
                <button className="btn btn-danger me-2" onClick={eliminarProductoHandler}>Eliminar</button>
                <button className="btn btn-secondary" onClick={() => setShowConfirmModal(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        )}

        {/* Estilos CSS para el modal de confirmación */}
        <style>
          {`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }

          .modal-content {
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            color: black; /* Asegura que el texto sea visible */
          }

          .modal-actions {
            margin-top: 15px;
          }
          `}
        </style>
      </div>
    </div>
  );
};

export default Productos;
