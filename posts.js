/* PostsDAO deve ser construido com um objeto de conexão para funcionar */
function PostsDAO(db) {
    "use strict";

    /* Se esse construtor for chamado sem o "new", "this" aponta para o
     * objeto global. Mostra um log de warning e chama o mesmo corretamente. */
     if (false === (this instanceof PostsDAO)) {
        console.log('Erro: PostsDAO chamado sem o "new"');
        return new PostsDAO(db);
    }

    var posts = db.collection("posts");

    this.insertEntry = function (title, body, tags, author, callback) {
        "use strict";
        console.log("Inserindo Nova Entrada no Hot Blog" + title + body);

        var permalink = title.replace( /\s/g, '_' );
        permalink = permalink.replace( /\W/g, '' );

        // Constrói um novo Post
        var post = {"title": title,
                "author": author,
                "body": body,
                "permalink":permalink,
                "tags": tags,
                "comments": [],
                "date": new Date()}

        posts.insert(post, function (err, result) {
            "use strict";

            if (err) return callback(err, null);

            console.log("Novo Post Inserido com SUCESSO!");
            callback(err, permalink);
        });
    }

    this.getPosts = function(num, callback) {
        "use strict";

        posts.find().sort('date', -1).limit(num).toArray(function(err, items) {
            "use strict";

            if (err) return callback(err, null);

            console.log("Foram encontrados " + items.length + " posts");

            callback(err, items);
        });
    }

    this.getPostsByTag = function(tag, num, callback) {
        "use strict";

        posts.find({ tags : tag }).sort('date', -1).limit(num).toArray(function(err, items) {
            "use strict";

            if (err) return callback(err, null);

            console.log("Foram Encontrados " + items.length + " posts");

            callback(err, items);
        });
    }

    this.getPostByPermalink = function(permalink, callback) {
        "use strict";
        posts.findOne({'permalink': permalink}, function(err, post) {
            "use strict";

            if (err) return callback(err, null);

            callback(err, post);
        });
    }

    this.addComment = function(permalink, name, email, body, callback) {
        "use strict";

        var comment = {'author': name, 'body': body}

        if (email != "") {
            comment['email'] = email
        }

        var query = {'permalink': permalink};
        posts.findOne(query, function(err, post) {
            "use strict";

            if (err) return callback(err, null);

            comment['comments'] = post.comments.push(comment);

            posts.update(query, post, function(err, updated) {
                if(err) throw err;

                console.dir("Documento alterado com SUCESSO! " + updated);

                callback(err, updated[0]);
            });
        });
    }
}

module.exports.PostsDAO = PostsDAO;
