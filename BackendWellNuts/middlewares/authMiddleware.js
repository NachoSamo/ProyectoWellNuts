const jwt = require('jsonwebtoken');

exports.protegerRuta = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'No hay token, permiso no válido. Formato esperado: Bearer <token>' });
    }

    const token = authHeader.split(' ')[1]; // obtenemos el token del encabezado Authorization

    // aqui verificamos el token de autenticación haciendo uso de jwt.verify quien recibe el token y la clave secreta comparando con la que se firmó el token
    // si es correcto se decodifica
    //  y se guarda en req.usuario esto hace que el usuario autenticado pueda ser accedido en las siguientes rutas
    // la idea es que en el .json que llega haya un token que contenga un campo usuario 
    // que es el que se guarda en req.usuario
    // si el token no es válido se captura el error y se envía un mensaje de error
    // si es válido se llama a next() para continuar con la siguiente función de middleware o
    // la ruta final que maneja la petición
    // si el token es válido, se decodifica y se guarda en req.usuario
    //que es el req.usuario? 
    // req.usuario es un objeto que contiene la información del usuario autenticado,
    // como su ID, nombre, correo electrónico, y cualquier otro dato que se haya incluido en este caso el rol
    try { 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded.usuario; 
        next();
    } catch (error) {
        res.status(401).json({ msg: 'Token no es válido.' });
    }
};

//osea las dos cosas que hay que verificar en protegerRuta son:
//1. que el token exista y sea del tipo Bearer
//2. que el token sea válido y se pueda decodificar


//si el req.usuario tiene un rol de admin, se llama a next() para continuar con la siguiente función de middleware o la ruta final que maneja la petición
//si no, se envía un mensaje de error con un código de estado 403 ya que el usuario no tiene permisos de admin para acceder a esa ruta
exports.esAdmin = (req, res, next) => {
    if (req.usuario && req.usuario.rol === 'admin') {
        next();
    } else {
        res.status(403).json({ msg: 'Acceso denegado. Se requiere rol de administrador.' });
    }
};

//en esAdmin, se verifica si el usuario autenticado tiene un rol de administrador
//si es así, se llama a next() para continuar con la siguiente función de middleware o
//la ruta final que maneja la petición
//si no, se envía un mensaje de error 
