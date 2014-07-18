var crypto = require('crypto');

/* O SessionsDAO deve ser construido com um objeto database conectado*/
function SessionsDAO(db) {
    "use strict";

     /* Se o for construido sem o operador "new", "this" aponta para
     * o objeto global. Mostra um log de warning e chama o mesmo corretamente. */
     if (false === (this instanceof SessionsDAO)) {
         console.log('Erro: SessionsDAO chamado sem o "new"');
        return new SessionsDAO(db);
    }

    var sessions = db.collection("sessions");

    this.startSession = function(username, callback) {
        "use strict";

        // Gera um Id de Sessao
        var current_date = (new Date()).valueOf().toString();
        var random = Math.random().toString();
        var session_id = crypto.createHash('sha1').update(current_date + random).digest('hex');

        // Cria um documento de Sessao
        var session = {'username': username, '_id': session_id}

        // Inseri o documento de Sessao
        sessions.insert(session, function (err, result) {
            "use strict";
            callback(err, session_id);
        });
    }

    this.endSession = function(session_id, callback) {
        "use strict";
        // Remove session document
        sessions.remove({ '_id' : session_id }, function (err, numRemoved) {
            "use strict";
            callback(err);
        });
    }
    this.getUsername = function(session_id, callback) {
        "use strict";

        if (!session_id) {
            callback(Error("Session não setada!"), null);
            return;
        }

        sessions.findOne({ '_id' : session_id }, function(err, session) {
            "use strict";

            if (err) return callback(err, null);

            if (!session) {
                callback(new Error("Sessao: " + session + " nao existe!"), null);
                return;
            }

            callback(null, session.username);
        });
    }
}

module.exports.SessionsDAO = SessionsDAO;
