const {poolPromise, sql} = require('../data/database');

// Obtener todos los clientes
exports.getClientes = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Clientes');
        res.json(result.recordset); // recordset contiene los datos obtenidos de la consulta
    } catch (error) {
        console.error('❌ Error al obtener clientes:', error);
        res.status(500).send('Error en servidor');
    }
};

// Obtener cliente por ID
exports.getClienteById = async (req, res) => {
    const { id_cliente } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id_cliente', sql.Int, id_cliente)
            .query(`
                SELECT * 
                FROM Clientes 
                WHERE id_cliente = @id_cliente
            `);

        if (result.recordset.length === 0) {
            return res.status(404).send('Cliente no encontrado');
        }

        res.json(result.recordset[0]);
    } catch (error) {
        console.error('❌ Error al obtener cliente por ID:', error);
        res.status(500).send('Error en servidor');
    }
}

// Eliminar cliente
exports.eliminarCliente = async (req, res) => {
    const { id_cliente } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id_cliente', sql.Int, id_cliente)
            .query(`DELETE FROM Clientes 
                WHERE id_cliente = @id_cliente
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send('Cliente no encontrado');
        }

        res.send('Cliente eliminado correctamente');
    } catch (error) {
        console.error('❌ Error al eliminar cliente:', error);
        res.status(500).send('Error en servidor');
    }
}

// Modificar cliente
exports.modificarCliente = async (req, res) => {
    const { id_cliente } = req.params;
    const { nombre, apellido, email, telefono } = req.body;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id_cliente', sql.Int, id_cliente)
            .input('nombre', sql.NVarChar(50), nombre)
            .input('apellido', sql.NVarChar(50), apellido)
            .input('telefono', sql.NVarChar(20), telefono)
            .query(`
                UPDATE Clientes 
                SET 
                    nombre = @nombre,
                    apellido = @apellido,
                    telefono = @telefono
                WHERE id_cliente = @id_cliente
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send('Cliente no encontrado');
        }

        res.send('Cliente modificado correctamente');
    } catch (error) {
        console.error('❌ Error al modificar cliente:', error);
        res.status(500).send('Error en servidor');
    }
}

//nuevo cliente
exports.createCliente = async (req, res) => {
    const { nombre, apellido, email, telefono } = req.body;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('nombre', sql.NVarChar(50), nombre)
            .input('apellido', sql.NVarChar(50), apellido)
            .input('telefono', sql.NVarChar(20), telefono)
            .query(`
                INSERT INTO Clientes (nombre, apellido, telefono) 
                VALUES (@nombre, @apellido, @telefono)
            `);

        res.status(201).send('Cliente creado correctamente');
    } catch (error) {
        console.error('❌ Error al crear cliente:', error);
        res.status(500).send('Error en servidor');
    }
}