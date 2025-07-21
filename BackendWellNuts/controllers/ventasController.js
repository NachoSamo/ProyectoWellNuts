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
    console.error('Error al obtener ventas:', error);
    res.status(500).send('Error en servidor');
  }
};


exports.getVentaById = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Ventas WHERE id_venta = @id');

    if (!result.recordset.length) return res.status(404).send('No encontrada');
    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500).send('Error en servidor');
  }
};

exports.eliminarVenta = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    //usamos transacciones para asegurar la integridad de los datos ya que una venta puede tener varios detalles
    //si eliminamos la venta, debemos eliminar también sus detalles
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    await new sql.Request(transaction)
      .input('id', sql.Int, id)
      .query('DELETE FROM DetalleVenta WHERE id_venta = @id');

    await new sql.Request(transaction)
      .input('id', sql.Int, id)
      .query('DELETE FROM Ventas WHERE id_venta = @id');

    await transaction.commit();
    res.send('Venta eliminada correctamente');
  } catch (error) {
    console.error('Error al eliminar venta:', error);
    res.status(500).send('Error al eliminar venta');
  }
};

function calcularTotal(detalles) {
  return detalles.reduce((sum, d) => {
    const cantidad = Number(d.cantidad);
    const precio = Number(d.precio_unitario);
    return sum + (cantidad * precio);
  }, 0);
}

exports.crearVentaConDetalles = async (req, res) => {
  const { fecha, id_cliente, pagado, detalles } = req.body;
  if (!detalles || detalles.length === 0) {
    return res.status(400).send('La venta debe tener al menos un detalle');
  }

  try {
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    const total = calcularTotal(detalles);

    for (const detalle of detalles) {
      const producto = await new sql.Request(transaction)
        .input('id_producto', sql.Int, detalle.id_producto)
        .query(`SELECT id_variedad, tamaño_gramos FROM Productos WHERE id_producto = @id_producto`);

      if (!producto.recordset.length) {
        throw new Error(`Producto con ID ${detalle.id_producto} no encontrado`);
      }

      const { id_variedad, tamaño_gramos } = producto.recordset[0];
      const gramosRequeridos = detalle.cantidad * tamaño_gramos;

      const stockVariedad = await new sql.Request(transaction)
        .input('id_variedad', sql.Int, id_variedad)
        .query(`SELECT stock_gramos FROM VariedadProducto WHERE id_variedad = @id_variedad`);

      const stockDisponible = stockVariedad.recordset[0].stock_gramos;
      if (stockDisponible < gramosRequeridos) {
        await transaction.rollback();
        return res.status(400).send(`Stock insuficiente para el producto con ID ${detalle.id_producto}`);
      }
    }

    const ventaResult = await new sql.Request(transaction)
      .input('fecha', sql.DateTime, fecha)
      .input('id_cliente', sql.Int, id_cliente)
      .input('pagado', sql.Bit, pagado)
      .input('precio_total', sql.Decimal(10, 2), total)
      .query(`
        INSERT INTO Ventas (fecha, id_cliente, pagado, precio_total)
        VALUES (@fecha, @id_cliente, @pagado, @precio_total);
        SELECT SCOPE_IDENTITY() AS id_venta;
      `);

    const id_venta = ventaResult.recordset[0].id_venta;

    for (const detalle of detalles) {
      const { id_producto, cantidad, precio_unitario } = detalle;

      await new sql.Request(transaction)
        .input('id_venta', sql.Int, id_venta)
        .input('id_producto', sql.Int, id_producto)
        .input('cantidad', sql.Int, cantidad)
        .input('precio_unitario', sql.Decimal(10, 2), precio_unitario)
        .query(`
          INSERT INTO DetalleVenta (id_venta, id_producto, cantidad, precio_unitario)
          VALUES (@id_venta, @id_producto, @cantidad, @precio_unitario);
        `);

      const producto = await new sql.Request(transaction)
        .input('id_producto', sql.Int, id_producto)
        .query(`SELECT id_variedad, tamaño_gramos FROM Productos WHERE id_producto = @id_producto`);

      const { id_variedad, tamaño_gramos } = producto.recordset[0];
      const gramosTotales = cantidad * tamaño_gramos;

      await new sql.Request(transaction)
        .input('id_variedad', sql.Int, id_variedad)
        .input('gramos', sql.Int, gramosTotales)
        .query(`
          UPDATE VariedadProducto
          SET stock_gramos = stock_gramos - @gramos
          WHERE id_variedad = @id_variedad
        `);
    }

    await transaction.commit();
    res.status(201).json({ mensaje: 'Venta creada con éxito', id_venta });

  } catch (error) {
    console.error('Error al crear venta con detalles:', error);
    res.status(500).send('Error al crear venta con detalles');
  }
};

exports.actualizarEstadoPagado = async (req, res) => {
  const { id_venta } = req.params;

  try {
    const pool = await poolPromise;
    const consulta = await pool.request()
      .input('id_venta', sql.Int, id_venta)
      .query('SELECT pagado FROM Ventas WHERE id_venta = @id_venta');

    const venta = consulta.recordset[0];
    if (!venta) return res.status(404).send('Venta no encontrada');

    const nuevoEstado = !venta.pagado; // invertimos el estado anterior 

    await pool.request()
      .input('id_venta', sql.Int, id_venta)
      .input('pagado', sql.Bit, nuevoEstado)
      .query('UPDATE Ventas SET pagado = @pagado WHERE id_venta = @id_venta');

    res.send({ mensaje: 'Estado de pago actualizado', pagado: nuevoEstado });
  } catch (error) {
    console.error("Error al actualizar estado pagado:", error.message);
    res.status(500).send("Error al actualizar estado pagado");
  }
};

exports.getDetallesPorVenta = async (req, res) => {
  const { id_venta } = req.params;
  const pool = await poolPromise;
  try {
    const result = await pool.request()
      .input('id_venta', sql.Int, id_venta)
      .query(`
        SELECT 
          DV.id_detalle, 
          DV.cantidad, 
          DV.precio_unitario, 
          P.nombre_producto,
          VP.nombre_variedad,
          P.tamaño_gramos
        FROM DetalleVenta DV
        JOIN Productos P ON DV.id_producto = P.id_producto
        JOIN VariedadProducto VP ON P.id_variedad = VP.id_variedad
        WHERE DV.id_venta = @id_venta;
      `);
    res.json(result.recordset.map(d => ({
      ...d,
      nombre_producto: `${d.nombre_variedad} - ${d.nombre_producto}`,
    })));
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener detalles por venta');
  }
};

exports.getVentasMensuales = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT 
        CONVERT(varchar(7), fecha, 120) AS mes,
        SUM(precio_total) AS total
      FROM Ventas
      WHERE fecha IS NOT NULL
      GROUP BY CONVERT(varchar(7), fecha, 120)
      ORDER BY mes
    `);
    //CONVERT (varchar(7), fecha, 120) obtiene el año y mes en formato YYYY-MM
    //SUM(precio_total) suma el total de ventas por mes

    res.json(result.recordset);
  } catch (error) {
    console.error('ERROR en getVentasMensuales:', error); 
    res.status(500).json({ 
      error: 'Error en servidor',
    });
  }
};

// Obtener el total de ventas por cliente
exports.getVentasPorCliente = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT 
        C.id_cliente,
        C.nombre + ' ' + C.apellido AS cliente,
        SUM(V.precio_total) AS total_ventas
      FROM Ventas V
      JOIN Clientes C ON V.id_cliente = C.id_cliente
      GROUP BY C.id_cliente, C.nombre, C.apellido
      ORDER BY total_ventas DESC;
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener ventas por cliente:', error);
    res.status(500).send('Error en servidor');
  }
};

// Obtener el cliente que más compró en el mes actual
exports.getMejorClienteDelMes = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT TOP 1 
        C.id_cliente,
        C.nombre + ' ' + C.apellido AS cliente,
        SUM(V.precio_total) AS total_mes
      FROM Ventas V
      INNER JOIN Clientes C ON V.id_cliente = C.id_cliente
      WHERE MONTH(V.fecha) = MONTH(GETDATE()) AND YEAR(V.fecha) = YEAR(GETDATE())
      GROUP BY C.id_cliente, C.nombre, C.apellido
      ORDER BY total_mes DESC;
    `);

    res.json(result.recordset[0] || {});
  } catch (error) {
    console.error('Error al obtener mejor cliente del mes:', error);
    res.status(500).send('Error en servidor');
  }
};

