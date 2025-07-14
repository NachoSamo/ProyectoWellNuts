const express = require('express');
const router = express.Router();
const ventasController = require('../controllers/ventasController');
const { protegerRuta, esAdmin } = require('../Middlewares/authMiddleware');

router.get('/mensual',protegerRuta ,ventasController.getVentasMensuales);
router.get('/',protegerRuta, ventasController.getVentas);
router.get('/ranking/clientes',protegerRuta, ventasController.getVentasPorCliente);
router.get('/ranking/cliente-mes',protegerRuta, ventasController.getMejorClienteDelMes);
router.get('/:id',protegerRuta, ventasController.getVentaById);
router.delete('/:id',[protegerRuta, esAdmin], ventasController.eliminarVenta);
router.post('/completa',[protegerRuta, esAdmin], ventasController.crearVentaConDetalles);
router.patch('/:id_venta/pagado',[protegerRuta, esAdmin], ventasController.actualizarEstadoPagado);


module.exports = router;
