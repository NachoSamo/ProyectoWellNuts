const { poolPromise, sql } = require('../data/database');

exports.getProductos = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Productos');
        res.json(result.recordset); 
    } catch (error) {
        console.error('❌ Error al obtener productos:', error);
        res.status(500).send('Error en servidor');
    }
    }

exports.getProductoById = async (req, res) => {
    const { id_producto } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id_producto', sql.Int, id_producto)
            .query(`
                SELECT * 
                FROM Productos 
                WHERE id_producto = @id_producto
            `);

        if (result.recordset.length === 0) {
            return res.status(404).send('Producto no encontrado');
        }

        res.json(result.recordset[0]);
    } catch (error) {
        console.error('❌ Error al obtener producto por ID:', error);
        res.status(500).send('Error en servidor');
    }
}

exports.eliminarProducto = async (req, res) => {
    const { id_producto } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id_producto', sql.Int, id_producto)
            .query(`DELETE FROM Productos 
                WHERE id_producto = @id_producto
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send('Producto no encontrado');
        }

        res.send('Producto eliminado correctamente');
    } catch (error) {
        console.error('❌ Error al eliminar producto:', error);
        res.status(500).send('Error en servidor');
    }
}

exports.modificarProducto = async (req, res) => {
    const { id_producto } = req.params;
    const { nombre_producto, precio_proveedor, stock_gramos, precio_actual } = req.body;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id_producto', sql.Int, id_producto)
            .input('nombre_producto', sql.NVarChar, nombre_producto)
            .input('precio_proveedor', sql.Decimal(10, 2), precio_proveedor)
            .input('stock_gramos', sql.Int, stock_gramos)
            .input('precio_actual', sql.Decimal(10, 2), precio_actual)
            .query(`
                UPDATE Productos 
                SET 
                    nombre_producto = @nombre_producto,
                    precio_proveedor = @precio_proveedor,
                    stock_gramos = @stock_gramos,
                    precio_actual = @precio_actual
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
}

exports.createProducto = async (req, res) => {
    const { nombre_producto, precio_proveedor, stock_gramos, precio_actual } = req.body;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('nombre_producto', sql.NVarChar, nombre_producto)
            .input('precio_proveedor', sql.Decimal(10, 2), precio_proveedor)
            .input('stock_gramos', sql.Int, stock_gramos)
            .input('precio_actual', sql.Decimal(10, 2), precio_actual)
            .query(`
                INSERT INTO Productos (nombre_producto, precio_proveedor, stock_gramos, precio_actual) 
                VALUES (@nombre_producto, @precio_proveedor, @stock_gramos, @precio_actual)
            `);

        res.status(201).send('Producto creado correctamente');
    } catch (error) {
        console.error('❌ Error al crear producto:', error);
        res.status(500).send('Error en servidor');
    }
}