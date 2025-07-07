const express = require('express');
const router = express.Router();
const ventasController = require('../controllers/ventasController');

router.get('/mensual', ventasController.getVentasMensuales);
router.get('/', ventasController.getVentas);
router.get('/ranking/clientes', ventasController.getVentasPorCliente);
router.get('/ranking/cliente-mes', ventasController.getMejorClienteDelMes);
router.get('/:id', ventasController.getVentaById);
router.delete('/:id', ventasController.eliminarVenta);
router.post('/completa', ventasController.crearVentaConDetalles);
router.patch('/:id_venta/pagado', ventasController.actualizarEstadoPagado);


module.exports = router;
