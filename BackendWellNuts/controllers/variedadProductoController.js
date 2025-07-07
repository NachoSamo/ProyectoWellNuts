const { poolPromise, sql } = require('../data/database');

exports.getVariedades = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM VariedadProducto');
    res.json(result.recordset);
  } catch (error) {
    console.error('❌ Error al obtener variedades:', error);
    res.status(500).send('Error en el servidor');
  }
};

exports.getVariedadById = async (req, res) => {
  const { id_variedad } = req.params;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id_variedad', sql.Int, id_variedad)
      .query('SELECT * FROM VariedadProducto WHERE id_variedad = @id_variedad');
    
    if (result.recordset.length === 0) {
      return res.status(404).send('Variedad no encontrada');
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('❌ Error al obtener variedad:', error);
    res.status(500).send('Error en el servidor');
  }
};

exports.createVariedad = async (req, res) => {
  const { nombre_variedad, stock_gramos } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('nombre_variedad', sql.NVarChar, nombre_variedad)
      .input('stock_gramos', sql.Int, stock_gramos)
      .query('INSERT INTO VariedadProducto (nombre_variedad, stock_gramos) VALUES (@nombre_variedad, @stock_gramos)');
    
    res.status(201).send('Variedad creada correctamente');
  } catch (error) {
    console.error('❌ Error al crear variedad:', error);
    res.status(500).send('Error en el servidor');
  }
};

exports.modificarVariedad = async (req, res) => {
  const { id_variedad } = req.params;
  const { nombre_variedad, stock_gramos } = req.body;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id_variedad', sql.Int, id_variedad)
      .input('nombre_variedad', sql.NVarChar, nombre_variedad)
      .input('stock_gramos', sql.Int, stock_gramos)
      .query(`
        UPDATE VariedadProducto
        SET nombre_variedad = @nombre_variedad, stock_gramos = @stock_gramos
        WHERE id_variedad = @id_variedad
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send('Variedad no encontrada');
    }

    res.send('Variedad modificada correctamente');
  } catch (error) {
    console.error('❌ Error al modificar variedad:', error);
    res.status(500).send('Error en el servidor');
  }
};

exports.eliminarVariedad = async (req, res) => {
  const { id_variedad } = req.params;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id_variedad', sql.Int, id_variedad)
      .query('DELETE FROM VariedadProducto WHERE id_variedad = @id_variedad');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send('Variedad no encontrada');
    }

    res.send('Variedad eliminada correctamente');
  } catch (error) {
    console.error('❌ Error al eliminar variedad:', error);
    res.status(500).send('Error en el servidor');
  }
};

exports.getStockPorVariedad = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT 
        nombre_variedad, 
        stock_gramos 
      FROM VariedadProducto
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Error al obtener stock por variedad:", error);
    res.status(500).send("Error al obtener stock por variedad");
  }
};