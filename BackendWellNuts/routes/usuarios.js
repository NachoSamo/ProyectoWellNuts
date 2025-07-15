const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protegerRuta } = require('../Middlewares/authMiddleware');
const usuarioController = require('../controllers/usuarioController');

// Configuración de Multer para la subida de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Asegúrate de que exista una carpeta 'uploads' en la raíz de tu backend
    },
    filename: (req, file, cb) => {
        // Genera un nombre de archivo único para evitar colisiones
        cb(null, `user-${req.usuario.id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });
router.get('/perfil', protegerRuta, usuarioController.obtenerMiPerfil);
router.put('/perfil', [protegerRuta, upload.single('foto_perfil')], usuarioController.actualizarMiPerfil);
router.put('/password', protegerRuta, usuarioController.actualizarContraseña);

module.exports = router;