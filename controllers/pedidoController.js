const connection = require('../mysql');

exports.getPedidos = (req, res, next) =>{
   
    const pedidos = connection.query(`SELECT pedidos.id_pedidos, produtos.id_produto, produtos.nome, produtos.preco, pedidos.quantidade FROM pedidos INNER JOIN produtos ON produtos.id_produto = pedidos.id_produtos;`, (error, results, fields) => {
        if(error){
            res.status(500).send({
                error: error,
                response: null
            });
            
        }
       
        const response = {
            pedidos: results.map(pedido =>{
                return {
                    id_pedido: pedido.id_pedidos,
                    quantidade: pedido.quantidade,
                    produto:{
                        id_produto: pedido.id_produtos,
                        nome: pedido.nome,
                        preco: pedido.preco
                    },
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna detalhe de um produto especifico',
                        url: 'http://localhost:3000/pedidos/' + pedido.id_pedidos
                    }
                }
            })
        }
       return res.status(200).send(response)
  })
}

exports.postPedidos = (req, res, next) => { 
    const pedidos = connection.query(
         'SELECT * FROM produtos WHERE id_produto = ?;', [req.body.id_produtos], (error, results, fields) =>{
             if(error){
                 res.status(500).send({
                     error: error,
                     response: null
                 });
             }
             console.log(results.length)
             if(results.length == 0){
                 return res.status(404).send({
                     mensagem: 'Produto com este ID'
                 })
              }
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
         }
     )
   
     //console.log(pedidos)
 
 }

 exports.ByIdPedidos = (req, res, next) =>{
    const pedidos = connection.query('SELECT * FROM pedidos WHERE id_pedidos = ?;',[req.params.id_pedidos], (error, results, fields) => {
        if(error){
            res.status(500).send({
                error: error,
                response: null
            });
        }
        if(results.length == 0){
           return res.status(404).send({
               mensagem: 'Não foi encontrado produto com este ID'
           })
        }
        const response = {
            pedidos: {
            id_pedidos: results[0].id_pedidos,
            id_produtos: results[0].id_produtos,
            quantidade: results[0].quantidade,
            request: {
                tipo: 'GET',
                descricao: 'Buscar pedidos por id',
                url: 'http://localhost:3000/pedidos/'
            }}
        }
      return  res.status(200).send(response)
        })
  
}

exports.deletePedidos = (req, res, next) =>{
    connection.query(
        `DELETE FROM pedidos WHERE id_pedidos = ?`, [req.body.id_pedidos], (error, results, fields) => {
            if(error){
                res.status(500).send({
                    error: error,
                    response: null
                });
            }
            const response = {
                messagem: "Pedido removido com sucesso",
                equest: {
                    tipo: 'DELETE',
                    descricao: 'rota de apagar  produto',
                    url: 'http://localhost:3000/pedidos/'
                }
            }
            res.status(200).send(response);
    })
  }
     //console.log(pedidos)
 
 