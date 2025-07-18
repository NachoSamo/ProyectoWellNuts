const { poolPromise, sql } = require('../data/database');

exports.getDetalleVentas = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM DetalleVentas');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener detalle ventas:', error);
    res.status(500).send('Error en servidor');
  }
};

exports.getDetallePorVenta = async (req, res) => {
  const { id_venta } = req.params;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id_venta', sql.Int, id_venta)
      .query(`
        SELECT 
          DV.id_detalle, 
          DV.id_venta, 
          DV.id_producto, 
          DV.cantidad, 
          DV.precio_unitario, 
          P.nombre_producto,
          P.tamaño_gramos,
          VP.nombre_variedad
        FROM DetalleVenta DV
        JOIN Productos P ON DV.id_producto = P.id_producto
        JOIN VariedadProducto VP ON P.id_variedad = VP.id_variedad
        WHERE DV.id_venta = @id_venta
      `);
    res.json(result.recordset);
  } catch (error) {
    console.error('❌ Error al obtener detalles por venta:', error.message);
    res.status(500).send('Error al obtener detalles por venta');
  }
};


