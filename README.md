Hot Blog

#O que é o Hot Blog ?
Um simples Blog envolvendo [NodeJs](http://nodejs.org/) e [MongoDB](http://www.mongodb.org/) 

#Certo, e como funciona?
Como o blog esta desenvolvida com a poderosa ferramenta Nodejs, basta seguir o passo a passo

1. Instale o Git, NodeJs e MongoDB, caso ainda não tenha
2. Rode o comando
```bash
$ git clone URL_PROJETO.git
```
3.Agora que ja tem o projeto salvo no pc, vamos instalar as dependencias
```bash
$ npm install
```
4.Pronto, agora você já tem tudo que precisa para rodar, então:
```bash
$ node app.js
```

Voilá, a mágica já esta acontecendo em http://localhost:8000


./app.js - entry point
./package.json - npm package description
./posts.js - Posts Data Access Helper
./sessions.js - Sessions Data Access Helper
./users.js - Users Data Access Helper
./views/ - html templates

