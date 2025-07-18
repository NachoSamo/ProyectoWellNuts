const express = require('express');
const router = express.Router();
const detalleVentaController = require('../controllers/detalleVentaController');
const { protegerRuta, esAdmin } = require('../Middlewares/authMiddleware');

router.get('/',protegerRuta,detalleVentaController.getDetalleVentas);
router.get('/por-venta', protegerRuta, detalleVentaController.getDetallePorVenta);
router.get('/por-venta/:id_venta', protegerRuta,detalleVentaController.getDetallePorVenta);


module.exports = router;
