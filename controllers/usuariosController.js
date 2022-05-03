const connection = require('../mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_KEY = "secret";



exports.getUsuarios = (req, res, next) =>{
  
    connection.query('SELECT * FROM usuarios', (error, results, fields) =>{
        if(error){
            res.status(500).send({
                error: error,
                response: null
            });
        }
        const response = {
            usuarios: results.length,
            user: results.map(prod =>{
                return {
                    id_usuario: prod.id_usuario,
                    email: prod.email,
                    //senha: prod.senha,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna todos os produtos',
                        url: 'http://localhost:3000/usuarios/'
                    }
                }
            })
        }
       return res.status(200).send(response) 
    })
}



exports.postUsuarios = (req, res, next) => { 


    bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
        if(errBcrypt){
            return res.status(500).send({
                error: errBcrypt
            })
        }
        connection.query('SELECT * FROM usuarios WHERE email = ?',[req.body.email], (error, results) =>{
            if(results.length > 0){
                res.status(409).send({
                    messagem: 'Esse email já foi cadastrado'
                })
            }else{
                connection.query(
                    'INSERT INTO usuarios (email, senha) VALUES (?, ?)', [req.body.email, hash], (error, results, fields) => {
                        if(error){
                            res.status(500).send({
                                error: error,
                                response: null
                            });
                        }
                        const response = {
                            messagem: "Produtos cadastrado com sucesso",
                            User: {
                             email: results.email,
                            request: {
                                tipo: 'POST',
                                descricao: 'Usuario cadastrado com sucesso',
                                url: 'http://localhost:3000/usuarios/'
                            }}
                        }
                      return  res.status(201).send(response)
                    }
                )
            }

        })
     

    })
    //console.log(pedidos)

}

exports.login = (req, res, next) =>{
    connection.query(`SELECT * FROM usuarios WHERE email = ?`, [req.body.email], (error, results, fields) =>{
        if(error){
            res.status(500).send({
                error: error,
                response: null
            });
        }else if(results.length < 1){
          return res.status(401).send({
              mensagem: 'Verifica o email e a senha'
          })
        }else{
           bcrypt.compare(req.body.senha, results[0].senha, (err, result) =>{
               if(err){
                return res.status(401).send({
                    mensagem: 'ERROR: |'
                })
               }else if(result){
                   //console.log(results);
                   const token = jwt.sign({
                       id_usuario: results[0].id_usuario,
                       email: results[0].email
                   },
                   JWT_KEY,{
                       expiresIn: "1h"
                   }
                   )
                return res.status(200).send({
                    mensagem: 'Login efectuado com sucesso',
                    token: token
                })
               }else{
                return res.status(401).send({
                    mensagem: 'Falha na autenticação'
                })
               }
           
           })
        }
         
    })
}