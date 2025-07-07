const express = require('express');
const router = express.Router();
const variedadController = require('../controllers/variedadProductoController');

router.get('/stock', variedadController.getStockPorVariedad);
router.get('/', variedadController.getVariedades);
router.get('/:id_variedad', variedadController.getVariedadById);
router.post('/', variedadController.createVariedad);
router.put('/:id_variedad', variedadController.modificarVariedad);
router.delete('/:id_variedad', variedadController.eliminarVariedad);

module.exports = router;
