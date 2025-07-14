const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');
const { protegerRuta, esAdmin } = require('../Middlewares/authMiddleware');

router.get('/rentabilidad',protegerRuta ,productosController.getRentabilidadProductos);

router.get('/',protegerRuta ,productosController.getProductos);

router.get('/:id_producto',protegerRuta ,productosController.getProductoById);

router.delete('/:id_producto',[protegerRuta, esAdmin] ,productosController.eliminarProducto);

router.put('/:id_producto',[protegerRuta, esAdmin] ,productosController.modificarProducto);

router.post('/',[protegerRuta, esAdmin] ,productosController.createProducto);

module.exports = router;
