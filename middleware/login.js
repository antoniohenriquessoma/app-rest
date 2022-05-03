const jwt = require('jsonwebtoken');
const JWT_KEY = "secret";


exports.login = (req, res, next) => {

    try {
        const token = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(token, JWT_KEY);  
        req.usuario = decode;
        next()
    } catch (error) {
        return res.status(401).send({
            messagem: 'Usuario nao esta logado'
        });
    }

    
}

exports.noLogin = (req, res, next) => {

    try {
        const token = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(token, JWT_KEY);  
        req.usuario = decode;
        next()
    } catch (error) {
        next()
    }

    
}