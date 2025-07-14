const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController');
const { protegerRuta, esAdmin } = require('../Middlewares/authMiddleware');

router.get('/', protegerRuta ,clientesController.getClientes);

router.get('/:id_cliente',protegerRuta ,clientesController.getClienteById);

router.delete('/:id_cliente',[protegerRuta, esAdmin] ,clientesController.eliminarCliente);

router.put('/:id_cliente',[protegerRuta, esAdmin] ,clientesController.modificarCliente);

router.post('/',[protegerRuta, esAdmin] ,clientesController.createCliente);

module.exports = router;
