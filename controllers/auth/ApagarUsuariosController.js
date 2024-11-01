class UsuariosApagar {
  static config = require("../../config/roles.json");
  static db = require("../../config/db").config();

  static bot(bot) {
    bot.command("limparUsuarios", async (msg) => {
      const { id } = await msg.getChat();
      this.validacoes(id, msg) ? null : this.apagarItens();
    });
  }

  static validacoes(id, msg) {
    const query = "SELECT * FROM ROLES WHERE ID_ADM = ?";
    const exefutarQuery = this.db.prepare(query).get(String(id));

    if (exefutarQuery === undefined || String(id) != this.config.csdevAdm) {
      msg.reply(this.mensages().naoAdm);
      return true;
    }

    return false;
  }

  static apagarItens(msg) {
    try {
      const query = "DELETE FROM PRODUTO";
      const { changes } = this.db.prepare(query).run();
      if (changes >= 1) {
        msg.reply(this.mensages().sucessoItem);
        return;
      }

      msg.reply(this.mensages().falhaerr);
    } catch (error) {
      msg.reply(this.mensages().falhaerr);
    } finally {
      this.db.close();
    }
  }

  static mensages() {
    return {
      falhaerr:
        "❌ Ocorreu um erro ao tentar apagar os itens. Por favor, tente novamente mais tarde.",
      naoAdm: "Olá! 😊 Você não possui acesso a este comando.",
      sucessoItem: `✅ Todos os itens foram apagados com sucesso da tabela PRODUTO!`,
    };
  }
}

module.exports = UsuariosApagar;
