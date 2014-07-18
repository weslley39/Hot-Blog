var SessionHandler = require('./session')
  , ContentHandler = require('./content')
  , ErrorHandler = require('./error').errorHandler;

module.exports = exports = function(app, db) {

    var sessionHandler = new SessionHandler(db);
    var contentHandler = new ContentHandler(db);

    // Verificar se o usuario esta logado
    app.use(sessionHandler.isLoggedInMiddleware);

    // Home Page do Hot Blog
    app.get('/', contentHandler.displayMainPage);

    // A pagina inicial do Hot Blog, com filtro
    app.get('/tag/:tag', contentHandler.displayMainPageByTag);

    // Simples Post, que pode ser comentado
    app.get("/post/:permalink", contentHandler.displayPostByPermalink);
    app.post('/newcomment', contentHandler.handleNewComment);
    app.get("/post_not_found", contentHandler.displayPostNotFound);

    // Mostra o form deixando o usuario adicionar um novo post. Apenas para usuarios logados
    app.get('/newpost', contentHandler.displayNewPostPage);
    app.post('/newpost', contentHandler.handleNewPost);

    // Form de Login
    app.get('/login', sessionHandler.displayLoginPage);
    app.post('/login', sessionHandler.handleLoginRequest);

    // Logout da pagina
    app.get('/logout', sessionHandler.displayLogoutPage);

    // Pagina de Boas Vindas
    app.get("/welcome", sessionHandler.displayWelcomePage);

    // Form de Registro
    app.get('/signup', sessionHandler.displaySignupPage);
    app.post('/signup', sessionHandler.handleSignup);

    // Erros
    app.use(ErrorHandler);
}
