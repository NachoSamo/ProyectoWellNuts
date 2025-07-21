const sql = require('mssql');
const bcrypt = require('bcryptjs');
const { poolPromise } = require('../data/database');

// --- OBTENER PERFIL DEL USUARIO AUTENTICADO ---
exports.obtenerMiPerfil = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id_usuario', sql.Int, req.usuario.id) // req.usuario.id viene del middleware protegerRuta
            .query('SELECT id_usuario, nombre_usuario, rol, nombre, apellido, email, foto_perfil_url FROM dbo.Usuarios WHERE id_usuario = @id_usuario');

        if (result.recordset.length === 0) {
            return res.status(404).json({ msg: 'Usuario no encontrado.' });
        }

        res.json(result.recordset[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor.');
    }
};

// --- ACTUALIZAR PERFIL DEL USUARIO (DATOS PERSONALES Y FOTO) ---
exports.actualizarMiPerfil = async (req, res) => {
    const { nombre, apellido, email } = req.body;

    const foto_perfil_url = req.file ? `/uploads/${req.file.filename}` : req.body.foto_perfil_url;

    try {
        const pool = await poolPromise;
        const request = pool.request().input('id_usuario', sql.Int, req.usuario.id);

        let query = 'UPDATE dbo.Usuarios SET ';
        const fieldsToUpdate = [];

        if (nombre) { fieldsToUpdate.push('nombre = @nombre'); request.input('nombre', sql.VarChar, nombre); }
        if (apellido) { fieldsToUpdate.push('apellido = @apellido'); request.input('apellido', sql.VarChar, apellido); }
        if (email) { fieldsToUpdate.push('email = @email'); request.input('email', sql.VarChar, email); }
        if (foto_perfil_url) { fieldsToUpdate.push('foto_perfil_url = @foto_perfil_url'); request.input('foto_perfil_url', sql.VarChar, foto_perfil_url); }

        if (fieldsToUpdate.length === 0) {
            return res.status(400).json({ msg: 'No se proporcionaron datos para actualizar.' });
        }

        query += fieldsToUpdate.join(', ') + ' WHERE id_usuario = @id_usuario';

        await request.query(query);

        res.json({ msg: 'Perfil actualizado correctamente.' });
    } catch (error) {
        console.error(error);
        if (error.number === 2627) { // Error de clave única (email duplicado)
            return res.status(400).json({ msg: 'El email ya está en uso por otro usuario.' });
        }
        res.status(500).send('Error en el servidor.');
    }
};


// --- ACTUALIZAR CONTRASEÑA ---
exports.actualizarContraseña = async (req, res) => {
    const { contraseña_actual, nueva_contraseña } = req.body;

    if (!contraseña_actual || !nueva_contraseña) {
        return res.status(400).json({ msg: 'Por favor, complete todos los campos.' });
    }

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id_usuario', sql.Int, req.usuario.id)
            .query('SELECT contraseña_hash FROM dbo.Usuarios WHERE id_usuario = @id_usuario');

        const usuario = result.recordset[0];
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado.' });
        }

        const isMatch = await bcrypt.compare(contraseña_actual, usuario.contraseña_hash);
        if (!isMatch) {
            return res.status(400).json({ msg: 'La contraseña actual es incorrecta.' });
        }

        const salt = await bcrypt.genSalt(10);
        const nueva_contraseña_hash = await bcrypt.hash(nueva_contraseña, salt);

        await pool.request()
            .input('id_usuario', sql.Int, req.usuario.id)
            .input('nueva_contraseña_hash', sql.VarChar, nueva_contraseña_hash)
            .query('UPDATE dbo.Usuarios SET contraseña_hash = @nueva_contraseña_hash WHERE id_usuario = @id_usuario');

        res.json({ msg: 'Contraseña actualizada correctamente.' });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor.');
    }
};