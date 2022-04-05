const mysql = require('mysql')


var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database: 'ecommerce'
  });
   
  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    console.log('Servidor rodando');
  });

  module.exports = connection;