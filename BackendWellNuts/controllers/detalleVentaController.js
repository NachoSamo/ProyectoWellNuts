const {poolPromise, sql} = require('../data/database');

// Obtener todos los detalle ventas
exports.getDetalleVentas = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM DetalleVentas');
        res.json(result.recordset); // recordset contiene los datos obtenidos de la consulta
    } catch (error) {
        console.error('❌ Error al obtener detalle ventas:', error);
        res.status(500).send('Error en servidor');
    }
};

// Obtener detalle venta por id_detalle
exports.getDetalleVentaById = async (req, res) => {
    const { id_detalle } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id_detalle', sql.Int, id_detalle)
            .query(`
                SELECT * 
                FROM DetalleVentas 
                WHERE id_detalle = @id_detalle
            `);

        if (result.recordset.length === 0) {
            return res.status(404).send('Detalle venta no encontrado');
        }

        res.json(result.recordset[0]);
    } catch (error) {
        console.error('❌ Error al obtener detalle venta por ID:', error);
        res.status(500).send('Error en servidor');
    }
}

// Eliminar detalle venta
exports.eliminarDetalleVenta = async (req, res) => {
    const { id_detalle } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id_detalle', sql.Int, id_detalle)
            .query(`DELETE FROM DetalleVentas 
                WHERE id_detalle = @id_detalle
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send('Detalle venta no encontrado');
        }

        res.send('Detalle venta eliminado correctamente');
    } catch (error) {
        console.error('❌ Error al eliminar detalle venta:', error);
        res.status(500).send('Error en servidor');
    }
}

// Modificar detalle venta
exports.modificarDetalleVenta = async (req, res) => {
    const { id_detalle } = req.params;
    const { id_venta, id_producto, cantidad_gramos, precio_unitario } = req.body;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id_detalle', sql.Int, id_detalle)
            .input('id_venta', sql.Int, id_venta)
            .input('id_producto', sql.Int, id_producto)
            .input('cantidad_gramos', sql.Int, cantidad_gramos)
            .input('precio_unitario', sql.Decimal(10, 2), precio_unitario)
            .query(`
                UPDATE DetalleVentas 
                SET id_venta = @id_venta,
                    id_producto = @id_producto,
                    cantidad_gramos = @cantidad_gramos,
                    precio_unitario = @precio_unitario
                WHERE id_detalle = @id_detalle
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send('Detalle venta no encontrado');
        }

        res.send('Detalle venta modificado correctamente');
    } catch (error) {
        console.error('❌ Error al modificar detalle venta:', error);
        res.status(500).send('Error en servidor');
    }
}

//nuevo detalle venta
exports.createDetalleVenta = async (req, res) => {
    const { id_venta, id_producto, cantidad_gramos, precio_unitario } = req.body;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id_venta', sql.Int, id_venta)
            .input('id_producto', sql.Int, id_producto)
            .input('cantidad_gramos', sql.Int, cantidad_gramos)
            .query('UPDATE Productos SET stock_gramos = stock_gramos - @cantidad WHERE id_producto = @id_producto')
            .input('precio_unitario', sql.Decimal(10, 2), precio_unitario)
            .query(`
                INSERT INTO DetalleVentas (id_venta, id_producto, cantidad_gramos, precio_unitario) 
                VALUES (@id_venta, @id_producto, @cantidad_gramos, @precio_unitario)
            `);

        res.status(201).send('Detalle venta creado correctamente');
    } catch (error) {
        console.error('❌ Error al crear detalle venta:', error);
        res.status(500).send('Error en servidor');
    }
}

