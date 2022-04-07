const express = require('express');
const connection = require('../mysql');
const router = express.Router();
const multer = require('multer');


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/')
    },
    filename: function(req,file, cb){
        cb(null, new Date().toISOString() + file.originalname)
    }
  
})

const fileFilter = (req, file, cb) =>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
       cb(null, true)
    }else{
     cb(null, false)
    }
}

const upload = multer({ 
    storage: storage, 
limits:{
    fileSize: 1024 * 1024 * 5
},
fileFilter: fileFilter

})


router.get('/',(req, res, next) =>{

   const produtos = connection.query('SELECT * FROM produtos', (error, results, fields) => {
        if(error){
            res.status(500).send({
                error: error,
                response: null
            });
        }
        const response = {
            quantidade: results.length,
            produtos: results.map(prod =>{
                return {
                    id_produto: prod.id_produto,
                    nome: prod.nome,
                    preco: prod.preco,
                    imagem: prod.imagem,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna todos os produtos',
                        url: 'http://localhost:3000/produtos/' + prod.id_produto
                    }
                }
            })
        }
       return res.status(200).send(response)
        
        // connected!
      })
  
})

router.post('/',upload.single('imagem'), (req, res, next) => {
    const produto = {
        nome: req.body.name,
        preco: req.body.preco
    }
    console.log(req.file)
        connection.query(
            'INSERT INTO produtos (nome, preco, imagem) VALUES (?, ?, ?)', [req.body.nome, req.body.preco, req.file.path], (error, results, fields) => {
                if(error){
                    res.status(500).send({
                        error: error,
                        response: null
                    });
                }
                const response = {
                    messagem: "Produtos cadastrado com sucesso",
                    produtoscriados: {
                     id_produto: results.id_produto,
                    nome: req.body.nome,
                    preco: req.body.preco,
                    imagem: req.file.path,
                    request: {
                        tipo: 'POST',
                        descricao: 'Cadastro de produto',
                        url: 'http://localhost:3000/produtos/'
                    }}
                }
              return  res.status(201).send(response)
            }
        )
    
    
})

router.get('/:id_produto', (req, res, next) =>{
    const produtos = connection.query('SELECT * FROM produtos WHERE id_produto = ?;',[req.params.id_produto], (error, results, fields) => {
        if(error){
            res.status(500).send({
                error: error,
                response: null
            });
        }
        console.log(results.length)
        if(results.length == 0){
           return res.status(404).send({
               mensagem: 'Não foi encontrado produto com este ID'
           })
        }
        const response = {
            produto: {
            id_produto: results[0].id_produto,
            nome: results[0].nome,
            preco: results[0].preco,
            imagem: results[0].imagem,
            request: {
                tipo: 'GET',
                descricao: 'Buscar produtos por id',
                url: 'http://localhost:3000/produtos/'
            }}
        }
      return  res.status(200).send(response)
        
        // connected!
      })
    //  console.log(produtos)
  
})

router.patch('/', (req,res, next) =>{
    connection.query(
        `UPDATE produtos SET nome = ?, preco = ? imagem = ? WHERE id_produto = ?`, [req.body.nome, req.body.preco, req.file.path, req.body.id_produto], (error, results, fields) => {
            if(error){
                res.status(500).send({
                    error: error,
                    response: null
                });
            }
            const response = {
                messagem: "Produto actualizado com sucesso",
                produtoscriados: {
                 id_produto: req.id_produto,
                nome: req.body.nome,
                preco: req.body.preco,
                imagem: req.file.path,
                request: {
                    tipo: 'PUTCH',
                    descricao: 'Cadastro de produto',
                    url: 'http://localhost:3000/produtos/' + req.body.id_produto
                }}
            }
            res.status(202).send(response)
        }
    )
})

  router.delete('/',(req, res, next) =>{
    connection.query(
        `DELETE FROM produtos WHERE id_produto = ?`, [req.body.id_produto], (error, results, fields) => {
            if(error){
                res.status(500).send({
                    error: error,
                    response: null
                });
            }
            const response = {
                messagem: "Produtos removido com sucesso",
                equest: {
                    tipo: 'DELETE',
                    descricao: 'rota de apagar  produto',
                    url: 'http://localhost:3000/produtos/'
                }
            }
            res.status(200).send(response);
        }
    )
  })

module.exports = router;