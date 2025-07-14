const sql = require('mssql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. LA PRIMERA CORRECCIÓN: Desestructura para obtener 'poolPromise' directamente.
const { poolPromise } = require('../data/database');

// Función para registrar un nuevo usuario
exports.register = async (req, res) => {
    const { nombre_usuario, contraseña } = req.body;

    if (!nombre_usuario || !contraseña) {
        return res.status(400).json({ msg: 'Por favor, ingrese un nombre de usuario y una contraseña.' });
    }

    try {
        // 2. LA CORRECCIÓN CLAVE: Espera a que la promesa del pool se resuelva.
        const pool = await poolPromise;

        const salt = await bcrypt.genSalt(10);
        const contraseña_hash = await bcrypt.hash(contraseña, salt);
        const rol = 'usuario';

        // Ahora 'pool' es el objeto de conexión correcto y .request() funcionará.
        await pool.request()
            .input('nombre_usuario', sql.VarChar(50), nombre_usuario)
            .input('contraseña_hash', sql.VarChar(255), contraseña_hash)
            .input('rol', sql.VarChar(20), rol)
            .query('INSERT INTO dbo.Usuarios (nombre_usuario, contraseña_hash, rol) VALUES (@nombre_usuario, @contraseña_hash, @rol)');

        res.status(201).json({ msg: 'Usuario registrado exitosamente.' });

    } catch (error) {
        console.error(error);
        if (error.number === 2627 || error.number === 2601) {
            return res.status(400).json({ msg: 'El nombre de usuario ya existe.' });
        }
        res.status(500).send('Error en el servidor al registrar.');
    }
};

// Función para iniciar sesión
exports.login = async (req, res) => {
    const { nombre_usuario, contraseña } = req.body;

    if (!nombre_usuario || !contraseña) {
        return res.status(400).json({ msg: 'Por favor, ingrese sus credenciales.' });
    }

    try {
        // 2. LA MISMA CORRECCIÓN CLAVE AQUÍ:
        const pool = await poolPromise;

        const result = await pool.request()
            .input('nombre_usuario', sql.VarChar(50), nombre_usuario)
            .query('SELECT * FROM dbo.Usuarios WHERE nombre_usuario = @nombre_usuario');

        const usuario = result.recordset[0];

        if (!usuario) {
            return res.status(400).json({ msg: 'Credenciales inválidas.' });
        }

        const isMatch = await bcrypt.compare(contraseña, usuario.contraseña_hash);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciales inválidas.' });
        }

        const payload = {
            usuario: {
                id: usuario.id_usuario,
                rol: usuario.rol
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '8h' },
            (error, token) => {
                if (error) throw error;
                res.json({ token });
            }
        );

    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor al iniciar sesión.');
    }
};