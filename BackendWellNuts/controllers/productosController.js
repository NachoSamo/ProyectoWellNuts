const { poolPromise, sql } = require('../data/database');

exports.getProductos = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT 
        P.*, 
        V.nombre_variedad,
        V.stock_gramos,
        (V.stock_gramos / P.tamaño_gramos) AS stock_disponible
      FROM Productos P
      JOIN VariedadProducto V ON P.id_variedad = V.id_variedad
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
    res.status(500).send('Error en servidor');
  }
};

exports.getProductoById = async (req, res) => {
  const { id_producto } = req.params;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id_producto', sql.Int, id_producto)
      .query(`
        SELECT P.*, V.nombre_variedad
        FROM Productos P
        JOIN VariedadProducto V ON P.id_variedad = V.id_variedad
        WHERE P.id_producto = @id_producto
      `);

    if (result.recordset.length === 0) {
      return res.status(404).send('Producto no encontrado');
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('❌ Error al obtener producto por ID:', error);
    res.status(500).send('Error en servidor');
  }
};

exports.createProducto = async (req, res) => {
  const { nombre_producto, precio_proveedor, precio_actual, tamaño_gramos, id_variedad } = req.body;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('nombre_producto', sql.NVarChar, nombre_producto)
      .input('precio_proveedor', sql.Decimal(10, 2), precio_proveedor)
      .input('precio_actual', sql.Decimal(10, 2), precio_actual)
      .input('tamaño_gramos', sql.Int, tamaño_gramos)
      .input('id_variedad', sql.Int, id_variedad)
      .query(`
        INSERT INTO Productos (nombre_producto, precio_proveedor, precio_actual, tamaño_gramos, id_variedad)
        VALUES (@nombre_producto, @precio_proveedor, @precio_actual, @tamaño_gramos, @id_variedad)
      `);

    res.status(201).send('Producto creado correctamente');
  } catch (error) {
    console.error('❌ Error al crear producto:', error);
    res.status(500).send('Error en servidor');
  }
};

exports.modificarProducto = async (req, res) => {
  const { id_producto } = req.params;
  const { nombre_producto, precio_proveedor, precio_actual, tamaño_gramos, id_variedad } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id_producto', sql.Int, id_producto)
      .input('nombre_producto', sql.NVarChar, nombre_producto)
      .input('precio_proveedor', sql.Decimal(10, 2), precio_proveedor)
      .input('precio_actual', sql.Decimal(10, 2), precio_actual)
      .input('tamaño_gramos', sql.Int, tamaño_gramos)
      .input('id_variedad', sql.Int, id_variedad)
      .query(`
        UPDATE Productos
        SET 
          nombre_producto = @nombre_producto,
          precio_proveedor = @precio_proveedor,
          precio_actual = @precio_actual,
          tamaño_gramos = @tamaño_gramos,
          id_variedad = @id_variedad
        WHERE id_producto = @id_producto
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send('Producto no encontrado');
    }

    res.send('Producto modificado correctamente');
  } catch (error) {
    console.error('❌ Error al modificar producto:', error);
    res.status(500).send('Error en servidor');
  }
};

exports.eliminarProducto = async (req, res) => {
  const { id_producto } = req.params;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id_producto', sql.Int, id_producto)
      .query('DELETE FROM Productos WHERE id_producto = @id_producto');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send('Producto no encontrado');
    }

    res.send('Producto eliminado correctamente');
  } catch (error) {
    console.error('❌ Error al eliminar producto:', error);
    res.status(500).send('Error en servidor');
  }
};
