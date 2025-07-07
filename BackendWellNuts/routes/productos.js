const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');

router.get('/rentabilidad', productosController.getRentabilidadProductos);

router.get('/', productosController.getProductos);

router.get('/:id_producto', productosController.getProductoById);

router.delete('/:id_producto', productosController.eliminarProducto);

router.put('/:id_producto', productosController.modificarProducto);

router.post('/', productosController.createProducto);

module.exports = router;
