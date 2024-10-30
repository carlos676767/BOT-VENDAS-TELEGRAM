class HistoricoCompras {
  static db = require("../config/db");

  static bot(bot) {
    bot.command("historico", async (msg) => {
      const { id } = await msg.getChat();

      if (this.verificarCadastrado(msg, id)) {
        return;
      }

      HistoricoCompras.buscarHistorico(id, msg);
    });
  }

  static verificarCadastrado(msg, id) {
    try {
      const query = "SELECT * FROM USER WHERE ID = ?";
      const executarQuery = this.db.config().prepare(query).get(id);

      if (executarQuery === undefined) {
        msg.reply(this.mensagens().msgCadastro);
        return true;
      }
    } catch (error) {
      msg.reply(this.mensagens().msgError404);
    } finally {
      this.db.config().close();
    }
  }

  static mensagens() {
    return {
     histirocoErr: "⚠️ Oops! Houve um erro ao tentar acessar o histórico de pedidos. Por favor, tente novamente mais tarde. Estamos aqui para ajudar! 😊",
      msgError404: "⚠️ Oops! Houve um erro ao verificar se o usuário está cadastrado. Por favor, tente novamente mais tarde ou use o comando `/registrar` para se inscrever. Estamos aqui para ajudar! 😊",
      msgCadastro:"🌟 Olá! Para acessar o histórico, você precisa estar cadastrado. Por favor, use o comando `/registrar` para se inscrever. Assim, poderemos te ajudar melhor! 😊",
    };
  }

  static buscarHistorico(id, msg) {
    try {
      const query = `
          SELECT * FROM PEDIDOS 
          JOIN PRODUTO ON PEDIDOS.ID_PRODUCT = PRODUTO.ID_PRODUCT 
          WHERE PEDIDOS.ID_USER = ? 
          ORDER BY PRODUTO.nome ASC
        `;
      const buscarItens = this.db.config().prepare(query).all(id);

      if (buscarItens.length === 0) {
        return;
      }

      const itens = buscarItens.reduce((acc, data) => {
        return (acc += `🍽️ ${data.nome} - 💲${data.preco} - 📅${data.data} - 🔑${data.keys} \n`);
      }, "");

      const mensagemHistorico = "🛍️ Aqui está o histórico de pedidos:\n";
      const respostaFinal = mensagemHistorico.concat(itens);

      msg.reply(respostaFinal);
    } catch (error) {
        msg.reply(this.mensagens().histirocoErr)
    } finally {
        this.db.config().close()
    }
  }
}

module.exports = HistoricoCompras;
