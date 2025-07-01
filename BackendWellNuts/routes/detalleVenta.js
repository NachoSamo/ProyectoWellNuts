const express = require('express');
const router = express.Router();
const detalleVentaController = require('../controllers/detalleVentaController');

router.get('/', detalleVentaController.getDetalleVentas);
router.get('/por-venta', detalleVentaController.getDetallePorVenta);
router.get('/:id', detalleVentaController.getDetalleVentaById);
router.get('/por-venta/:id_venta', detalleVentaController.getDetallePorVenta);
router.post('/', detalleVentaController.createDetalleVenta);
router.put('/:id', detalleVentaController.modificarDetalleVenta);
router.delete('/:id', detalleVentaController.eliminarDetalleVenta);


module.exports = router;
