const sql = require('mssql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { poolPromise } = require('../data/database');

exports.register = async (req, res) => {
    const { nombre_usuario, contraseña, nombre, apellido, email } = req.body;

    if (!nombre_usuario || !contraseña || !nombre || !apellido || !email) {
        return res.status(400).json({ msg: 'Por favor, complete todos los campos requeridos.' });
    }

    try {
        const pool = await poolPromise;

        const salt = await bcrypt.genSalt(10);
        const contraseña_hash = await bcrypt.hash(contraseña, salt);
        const rol = 'usuario'; 

        await pool.request()
            .input('nombre_usuario', sql.VarChar(50), nombre_usuario)
            .input('contraseña_hash', sql.VarChar(255), contraseña_hash)
            .input('rol', sql.VarChar(20), rol)
            .input('nombre', sql.VarChar(50), nombre)
            .input('apellido', sql.VarChar(50), apellido)
            .input('email', sql.VarChar(100), email)
            .query(`
                INSERT INTO dbo.Usuarios (nombre_usuario, contraseña_hash, rol, nombre, apellido, email) 
                VALUES (@nombre_usuario, @contraseña_hash, @rol, @nombre, @apellido, @email)
            `);

        res.status(201).json({ msg: 'Usuario registrado exitosamente.' });

    } catch (error) {
        console.error(error);
        // Error para email o nombre de usuario duplicado
        if (error.number === 2627 || error.number === 2601) {
            return res.status(400).json({ msg: 'El nombre de usuario o el email ya existen.' });
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
            { expiresIn: '1h' },
            (error, token) => {
                if (error) throw error;
                res.json({ token });
            }  
        );

        //payload sirve para identificar al usuario en el token JWT 
        // y el rol para verificar permisos en el middleware de autenticación
        // .sign crea el token con el payload y la clave secreta del env
        // expiresIn define la duración del token esto determinara la cantidad de tiempo que el usuario estará autenticado si ponemos algo como 1h el token durara 1 hora 
        // y te pedirá que inicies sesión nuevamente después de ese tiempo 

    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor al iniciar sesión.');
    }
};