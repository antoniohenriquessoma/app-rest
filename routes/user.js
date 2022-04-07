const express = require('express');
const router = express.Router();
const connection = require('../mysql');
const bcrypt = require('bcrypt');


router.get('/',(req, res, next) =>{
   
})

router.post('/',(req, res, next) => { 
    connection.query(
        'INSERT INTO pedidos (id_produtos, quantidade) VALUES (?, ?)', [req.body.id_produtos, req.body.quantidade], (error, results, fields) => {
            if(error){
                res.status(500).send({
                    error: error,
                    response: null
                });
            }
            const response = {
                messagem: "Produtos cadastrado com sucesso",
                pedidocriados: {
                 id_produtos: results.id_produtos,
                quantidade: req.body.quantidade,
                request: {
                    tipo: 'POST',
                    descricao: 'Pedido inserido com sucesso',
                    url: 'http://localhost:3000/pedidos/'
                }}
            }
          return  res.status(201).send(response)
        }
    )
  
    //console.log(pedidos)

})




module.exports = router;