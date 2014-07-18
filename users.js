var bcrypt = require('bcrypt-nodejs');

/* O UsersDAO deve ser construido com um objeto database conectado*/
function UsersDAO(db) {
    "use strict";

    /* Se o for construido sem o operador "new", "this" aponta para
     * o objeto global. Mostra um log de warning e chama o mesmo corretamente. */
     if (false === (this instanceof UsersDAO)) {
        console.log('Warning: UsersDAO constructor called without "new" operator');
        return new UsersDAO(db);
    }

    var users = db.collection("users");

    this.addUser = function(username, password, email, callback) {
        "use strict";

        // Gera um hash password
        var salt = bcrypt.genSaltSync();
        var password_hash = bcrypt.hashSync(password, salt);

        // Cria um novo User
        var user = {'_id': username, 'password': password_hash};

        // Caso o email for passado, seta ele
        if (email != "") {
            user['email'] = email;
        }

        users.insert(user, function (err, result) {
            "use strict";

            if (!err) {
                console.log("Novo Usuario Cadastrado!");
                return callback(null, result[0]);
            }

            return callback(err, null);
        });
    }

    this.validateLogin = function(username, password, callback) {
        "use strict";

        // Callback para passar para o Mongo que valida o documento
        function validateUserDoc(err, user) {
            "use strict";

            if (err) return callback(err, null);

            if (user) {
                if (bcrypt.compareSync(password, user.password)) {
                    callback(null, user);
                }
                else {
                    var invalid_password_error = new Error("Senha Inválida");

                    // Seta um campo extra para distinguir este de um db error
                    invalid_password_error.invalid_password = true;
                    callback(invalid_password_error, null);
                }
            }
            else {
                var no_such_user_error = new Error("Usuario: " + user + " nao existe!");

                // Seta um campo extra para distinguir este de um db error
                no_such_user_error.no_such_user = true;
                callback(no_such_user_error, null);
            }
        }

        users.findOne({ '_id' : username }, validateUserDoc);
    }
}

module.exports.UsersDAO = UsersDAO;
