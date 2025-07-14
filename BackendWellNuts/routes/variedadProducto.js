const express = require('express');
const router = express.Router();
const variedadController = require('../controllers/variedadProductoController');
const { protegerRuta, esAdmin } = require('../Middlewares/authMiddleware');

router.get('/stock',protegerRuta ,variedadController.getStockPorVariedad);
router.get('/',protegerRuta, variedadController.getVariedades);
router.get('/:id_variedad',protegerRuta, variedadController.getVariedadById);
router.post('/',[protegerRuta, esAdmin] ,variedadController.createVariedad);
router.put('/:id_variedad',[protegerRuta, esAdmin], variedadController.modificarVariedad);
router.delete('/:id_variedad',[protegerRuta, esAdmin], variedadController.eliminarVariedad);

module.exports = router;
