const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController')

router.get('/', usuariosController.getUsuarios)

router.post('/cadastro', usuariosController.postUsuarios)


router.post('/login', usuariosController.login)

module.exports = router;