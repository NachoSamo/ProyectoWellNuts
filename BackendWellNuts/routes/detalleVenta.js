const express = require('express');
const detalleVentaController = require('../controllers/detalleVentaController');

const router = express.Router();

router.get('/', detalleVentaController.getDetalleVentas);

router.get('/:id', detalleVentaController.getDetalleVentaById);

router.post('/', detalleVentaController.createDetalleVenta);

router.put('/:id', detalleVentaController.modificarDetalleVenta);

router.delete('/:id', detalleVentaController.eliminarDetalleVenta);

module.exports = router;