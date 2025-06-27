const { poolPromise, sql } = require('../data/database');

// Obtener todas las ventas con nombre del cliente
exports.getVentas = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT 
        V.id_venta,
        V.fecha,
        V.precio_total,
        V.pagado,
        C.nombre + ' ' + C.apellido AS cliente
      FROM Ventas V
      JOIN Clientes C ON V.id_cliente = C.id_cliente
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('❌ Error al obtener ventas:', error);
    res.status(500).send('Error en servidor');
  }
};

// Obtener una venta por ID (sin cambios)
exports.getVentaById = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`SELECT * FROM Ventas WHERE id_venta = @id`);

    if (result.recordset.length === 0) {
      return res.status(404).send('Venta no encontrada');
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('❌ Error al obtener venta por ID:', error);
    res.status(500).send('Error en servidor');
  }
};

// Eliminar una venta (sin cambios)
exports.eliminarVenta = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`DELETE FROM Ventas WHERE id_venta = @id`);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send('Venta no encontrada');
    }

    res.send('Venta eliminada correctamente');
  } catch (error) {
    console.error('❌ Error al eliminar venta:', error);
    res.status(500).send('Error en servidor');
  }
};

// Modificar una venta (sin cambios)
exports.modificarVenta = async (req, res) => {
  const { id } = req.params;
  const { fecha, precio_total, id_cliente, pagado } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('precio_total', sql.Decimal(10, 2), precio_total)
      .input('fecha', sql.DateTime, fecha)
      .input('id_cliente', sql.Int, id_cliente)
      .input('pagado', sql.Bit, pagado)
      .query(`
        UPDATE Ventas 
        SET fecha = @fecha, precio_total = @precio_total, id_cliente = @id_cliente, pagado = @pagado 
        WHERE id_venta = @id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send('Venta no encontrada');
    }

    res.send('Venta modificada correctamente');
  } catch (error) {
    console.error('❌ Error al modificar venta:', error);
    res.status(500).send('Error en servidor');
  }
};

// Crear nueva venta (sin cambios)
exports.createVenta = async (req, res) => {
  const { fecha, precio_total, id_cliente, pagado } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('fecha', sql.DateTime, fecha)
      .input('precio_total', sql.Decimal(10, 2), precio_total)
      .input('id_cliente', sql.Int, id_cliente)
      .input('pagado', sql.Bit, pagado)
      .query(`
        INSERT INTO Ventas (fecha, precio_total, id_cliente, pagado) 
        VALUES (@fecha, @precio_total, @id_cliente, @pagado);
        SELECT SCOPE_IDENTITY() AS id_venta;
      `);

    res.status(201).json({ id_venta: result.recordset[0].id_venta });
  } catch (error) {
    console.error('❌ Error al crear venta:', error);
    res.status(500).send('Error en servidor');
  }
};
