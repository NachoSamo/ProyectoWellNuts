const express = require('express');
const router = express.Router();
const detalleVentaController = require('../controllers/detalleVentaController');
const { protegerRuta, esAdmin } = require('../Middlewares/authMiddleware');

router.get('/',protegerRuta,detalleVentaController.getDetalleVentas);
router.get('/por-venta', protegerRuta, detalleVentaController.getDetallePorVenta);
router.get('/:id',protegerRuta, detalleVentaController.getDetalleVentaById);
router.get('/por-venta/:id_venta', protegerRuta,detalleVentaController.getDetallePorVenta);
router.post('/', [protegerRuta, esAdmin],detalleVentaController.createDetalleVenta);
router.put('/:id', [protegerRuta, esAdmin],detalleVentaController.modificarDetalleVenta);
router.delete('/:id', [protegerRuta, esAdmin],detalleVentaController.eliminarDetalleVenta);


module.exports = router;
