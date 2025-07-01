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
          VP.nombre_variedad
        FROM DetalleVenta DV
        JOIN Productos P ON DV.id_producto = P.id_producto
        JOIN VariedadProducto VP ON P.id_variedad = VP.id_variedad
        WHERE DV.id_venta = @id_venta
      `);

    const detalles = result.recordset.map(d => ({
      ...d,
      nombre_producto: `${d.nombre_variedad} - ${d.nombre_producto}`
    }));

    res.json(detalles);
  } catch (error) {
    console.error('❌ Error al obtener detalles por venta:', error.message);
    res.status(500).send('Error al obtener detalles por venta');
  }
};

exports.getDetalleVentaById = (req, res) => {
  res.status(501).send('No implementado');
};

exports.createDetalleVenta = (req, res) => {
  res.status(501).send('No implementado');
};

exports.modificarDetalleVenta = (req, res) => {
  res.status(501).send('No implementado');
};

exports.eliminarDetalleVenta = (req, res) => {
  res.status(501).send('No implementado');
};
