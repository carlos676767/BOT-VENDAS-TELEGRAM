const { DatabaseSync } = require("node:sqlite");
class Sql {
    static caminho = 'E://BOT VENDAS TELEGRAM//db.db'
    static config(){
        return new DatabaseSync(this.caminho)
    }
}

module.exports = Sql