class DeletaProduto {
  static roles = require("../../config/roles.json");
  static db = require('../../config/db')
  static bot(bot) {
    bot.command("deletar_produto", async (msg) => {
      const { id } = await msg.getChat();
      const itens = msg.message.text.split(" ").slice(1);
      if (DeletaProduto.validacoes(id, msg, itens)) {
        return;
      }

      DeletaProduto.databaseDeletarItens(itens, msg);
    });
  }

  static validacoes(id, msg, itens) {
    const db = this.db.config();
    const query = 'SELECT * FROM roles WHERE ID_ADM = ?';
    const executarQuery = db.prepare(query).get(String(id));

    if (id !== Number(this.roles.csdevAdm) || executarQuery === undefined) {
      msg.reply(this.mensagens().acessoNegado);
      return true;
    }

    if (itens.length === 0) {
      msg.reply(this.mensagens().idNaoInformado);
      return true;
    }

    return false;
  }

  static databaseDeletarItens(id, msg) {
    try {
      const db = require("../../config/db");
      const query = "DELETE FROM PRODUTO WHERE ID_PRODUCT = ?";
      const { changes } = db.config().prepare(query).run(...id);

      if (changes > 0) {
        return msg.reply(this.mensagens().produtoDeletado);
      };

      msg.reply(this.mensagens().idNaoEncontrado);
    } catch (error) {
      msg.reply(this.mensagens().msg404);
    }
  }

  static mensagens() {
    return {
         msg404: "❌ **Erro ao deletar o produto:** Ocorreu um erro inesperado ao tentar remover o produto.\n" +
        "Por favor, tente novamente mais tarde ou entre em contato com o suporte.\n\n" +
        "🤖 *nextVendasBot*",
      idNaoInformado:
        "🚨 **Erro:** O ID do produto não foi informado. Por favor, forneça um ID válido.",
      produtoDeletado:
        "✅ **Produto Deletado:** O produto foi removido com sucesso.",
      acessoNegado:
        "⚠️ *Acesso negado!* ⚠️\n" +
        "O ID fornecido não possui permissões de administrador. Você não pode deletar itens.\n\n" +
        "Por favor, solicite permissão de administrador para realizar essa ação. Entre em contato com o responsável.\n\n" +
        "🤖 *nextVendasBot*",
      idNaoEncontrado:
        "🔍 **ID Não Encontrado:** O ID fornecido não corresponde a nenhum produto. Verifique e tente novamente.",
    };
  }
}

module.exports = DeletaProduto;
