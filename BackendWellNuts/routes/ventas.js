const express = require('express');
const router = express.Router();
const ventasController = require('../controllers/ventasController');

router.get('/', ventasController.getVentas);

router.get('/:id', ventasController.getVentaById);

router.delete('/:id', ventasController.eliminarVenta);

router.put('/:id', ventasController.modificarVenta);

router.post('/', ventasController.createVenta); 

module.exports = router;
