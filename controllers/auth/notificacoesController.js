class Notificacao {
  static database = require("../../config/db");
  static csdev = require("../../config/roles.json");

  static bot(bot) {
    bot.command("notificar", async (msg) => {
      const { id } = await msg.getChat();
      const mensagem = msg.message.text.split(" ").slice(1);

      if (this.validacoes(id, msg, mensagem)) {
        return;
      }

      await this.enviarMensagens(msg, mensagem);
    });
  }

  static validacoes(id, msg, mensagem) {
    const db = this.database.config();
    const query = "SELECT * FROM roles WHERE ID_ADM = ?";
    const executarQuery = db.prepare(query).get(String(id));

    if (executarQuery === undefined || id != Number(this.csdev.csdevAdm)) {
      msg.reply(this.mensages().msgNaoAdm);
      return true;
    }

    if (mensagem.length == 0) {
      msg.reply(this.mensages().mssgAserEnviada);
      return true;
    }
    return false;
  }

  static mensages() {
    return {
      mssgAserEnviada:
        "Envie a mensagem que deseja compartilhar, e eu a encaminharei para todos os usuários! ✉️",
      erroMensagem:
        "Desculpe, ocorreu um erro ao tentar enviar as mensagens. Por favor, tente novamente mais tarde. ⚠️",
      mensagemEnviadas:
        "Mensagem enviada com sucesso para todos os usuários! 📬",
      naoHaUsuarios:
        "Ops! Parece que não há usuários cadastrados para receber a mensagem no momento. 😊",
      msgNaoAdm:
        "Olá! 🚫 Você não é um administrador e, por isso, não tem permissão para enviar notificações. Se precisar de ajuda, estou à disposição!",
    };
  }

  static async enviarMensagens(msg, texto) {
    try {
      const query = "SELECT * FROM USER";
      const dbImportacao = this.database.config();
      const users = dbImportacao.prepare(query).all();
      const ids = users.map((data) => (data.ID));

      if (ids.length === 0) {
        return msg.reply(this.mensages().naoHaUsuarios);
      }

      await Promise.all(
        ids.map((ids) => msg.telegram.sendMessage(Number(ids), texto.join(` `)))
      )

      msg.reply(this.mensages().mensagemEnviadas);
    } catch (error) {
      msg.reply(this.mensages().erroMensagem);
    } finally {
      this.database.config().close();
    }
  }
}

module.exports = Notificacao;
