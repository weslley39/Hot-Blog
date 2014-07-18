var express = require('express')
  , app = express() // Web framework para cuidar das Rotas
  , cons = require('consolidate') // Biblioteca de Templating para o Express
  , MongoClient = require('mongodb').MongoClient // Driver para conectar com o MongoDB
  , routes = require('./routes'); // As Rotas para a aplicacao

MongoClient.connect('mongodb://localhost:27017/blog', function(err, db) {
    "use strict";
    if(err) throw err;
    var pub = __dirname + '/public',
        view = __dirname + '/views';

    // Registrando as rotas
    app.engine('html', cons.swig);
    app.set('view engine', 'html');
    app.set('views', __dirname + '/views');

    //Setando o Favicon das paginas
    app.use(express.favicon(__dirname + '/public/favicon.ico'));

    // Express para popular 'req.cookies' para acessar os cookies
    app.use(express.cookieParser());

    // Express para popular 'req.body' para podermos acessar as variaveis de POST
    app.use(express.bodyParser());

    app.use(express.static(pub));

    // Rotas
    routes(app, db);

    app.listen(8080);
    console.log('The Magic Happens on port 8080');
});