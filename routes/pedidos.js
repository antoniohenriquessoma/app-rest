const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidoController');


router.get('/', pedidosController.getPedidos);
router.post('/', pedidosController.postPedidos)
router.get('/:id_pedidos', pedidosController.ByIdPedidos)
router.delete('/', pedidosController.deletePedidos)

module.exports = router;