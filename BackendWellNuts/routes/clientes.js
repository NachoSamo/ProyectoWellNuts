const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController');

router.get('/', clientesController.getClientes);

router.get('/:id_cliente', clientesController.getClienteById);

router.delete('/:id_cliente', clientesController.eliminarCliente);

router.put('/:id_cliente', clientesController.modificarCliente);

router.post('/', clientesController.createCliente);

module.exports = router;
