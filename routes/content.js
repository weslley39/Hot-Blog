var PostsDAO = require('../posts').PostsDAO
  , sanitize = require('validator').sanitize;

/* O ContentHandler deve ser construido com um banco conectado */
function ContentHandler (db) {
    "use strict";

    var posts = new PostsDAO(db);

    this.displayMainPage = function(req, res, next) {
        "use strict";

        posts.getPosts(10, function(err, results) {
            "use strict";

            if (err) return next(err);

            return res.render('blog_template', {
                title: 'blog homepage',
                username: req.username,
                myposts: results
            });
        });
    }

    this.displayMainPageByTag = function(req, res, next) {
        "use strict";

        var tag = req.params.tag;

        posts.getPostsByTag(tag, 10, function(err, results) {
            "use strict";

            if (err) return next(err);

            return res.render('blog_template', {
                title: 'blog homepage',
                username: req.username,
                myposts: results
            });
        });
    }

    this.displayPostByPermalink = function(req, res, next) {
        "use strict";

        var permalink = req.params.permalink;

        posts.getPostByPermalink(permalink, function(err, post) {
            "use strict";

            if (err) return next(err);

            if (!post) return res.redirect("/post_not_found");

            // Inicia o form de comentarios em branco
            var comment = {'name': req.username, 'body': "", 'email': ""}

            return res.render('entry_template', {
                title: 'blog post',
                username: req.username,
                post: post,
                comment: comment,
                errors: ""
            });
        });
    }

    this.handleNewComment = function(req, res, next) {
        "use strict";
        var name = req.body.commentName;
        var email = req.body.commentEmail;
        var body = req.body.commentBody;
        var permalink = req.body.permalink;

        // Substitui o comentario com o atual username se for encontrado
        if (req.username) {
            name = req.username;
        }

        if (!name || !body) {
            // Se o usuario nao colocar as informacoes necessarias

            posts.getPostByPermalink(permalink, function(err, post) {
                "use strict";

                if (err) return next(err);

                if (!post) return res.redirect("/post_not_found");

                // Inicia o form de comentarios em branco
                var comment = {'name': name, 'body': "", 'email': ""}

                var errors = "O Post deve conter seu name e seu comentario atual."
                return res.render('entry_template', {
                    title: 'blog post',
                    username: req.username,
                    post: post,
                    comment: comment,
                    errors: errors
                });
            });

            return;
        }

        // Mesmo o usuario não estando logado, ele pode estar comentando
        posts.addComment(permalink, name, email, body, function(err, updated) {
            "use strict";

            if (err) return next(err);

            if (updated == 0) return res.redirect("/post_not_found");

            return res.redirect("/post/" + permalink);
        });
    }

    this.displayPostNotFound = function(req, res, next) {
        "use strict";
        return res.send('Desculpe, post nao encontrado!', 404);
    }

    this.displayNewPostPage = function(req, res, next) {
        "use strict";

        if (!req.username) return res.redirect("/login");

        return res.render('newpost_template', {
            subject: "",
            body: "",
            errors: "",
            tags: "",
            username: req.username
        });
    }

    function extract_tags(tags) {
        "use strict";

        var cleaned = [];

        var tags_array = tags.split(',');

        for (var i = 0; i < tags_array.length; i++) {
            if ((cleaned.indexOf(tags_array[i]) == -1) && tags_array[i] != "") {
                cleaned.push(tags_array[i].replace(/\s/g,''));
            }
        }

        return cleaned
    }

    this.handleNewPost = function(req, res, next) {
        "use strict";

        var title = req.body.subject
        var post = req.body.body
        var tags = req.body.tags

        if (!req.username) return res.redirect("/signup");

        if (!title || !post) {
            var errors = "O post deve conter um titulo e uma descricao";
            return res.render("newpost_template", {subject:title, username:req.username, body:post, tags:tags, errors:errors});
        }

        var tags_array = extract_tags(tags)

        // Se tudo estiver correto, insere
        var escaped_post = sanitize(post).escape();

        // Substitui os <br> por paragrafos
        var formatted_post = escaped_post.replace(/\r?\n/g,'<br>');

        posts.insertEntry(title, formatted_post, tags_array, req.username, function(err, permalink) {
            "use strict";

            if (err) return next(err);

            // entao, redireciona para o permalink
            return res.redirect("/post/" + permalink)
        });
    }
}

module.exports = ContentHandler;
