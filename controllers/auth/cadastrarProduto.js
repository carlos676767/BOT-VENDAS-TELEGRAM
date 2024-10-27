class CadastrarProduto {
  static roles = require("../../config/roles.json");
  static bot(bot) {
    bot.command("criar_produto", async (msg) => {
      const { id } = await msg.getChat();
      const itens = msg.message.text.split(" ").slice(1);

      if (CadastrarProduto.validacoes(msg, id, itens)) {
        return;
      };

      CadastrarProduto.adicionarItens(itens, msg);
    });
  };
  
  static validacoes(msg, id, itens) {
    if (id !== Number(this.roles.csdevAdm)) {
      msg.reply(this.mensagens().msgNaoAdm);
      return true;
    };

    if (itens.length === 0) {
      msg.reply(this.mensagens().msgProdutoNaoInformado);
      return true;
    };

    if (itens.length > 3) {
      msg.reply(CadastrarProduto.mensagens().msgLimite);
      return true;
    };

    return false;
  };

  static adicionarItens(itens, msg) {
    const database = require("../../config/db");
    const query = "INSERT INTO PRODUTO (nome, preco, keys) VALUES(?, ?, ?)";
    const {lastInsertRowid, changes} = database.config().prepare(query).run(...itens);

    if (changes >= 1) {
      return msg.reply(CadastrarProduto.mensagens().produtoCadastradoSucesso);
    };
  };

  static mensagens() {
    return {
      msgNaoAdm: `⚠️ *Acesso negado!* ⚠️\n` +
        `O ID fornecido não possui permissões de administrador. Você não pode adicionar itens à venda.\n\n` +
        `Por favor, solicite permissão de administrador para realizar essa ação. Entre em contato com o responsável.\n\n` +
        `🤖 *nextVendasBot*`,

      msgProdutoNaoInformado: `⚠️ Nenhum Produto Informado! ⚠️  
Parece que você não forneceu os detalhes do produto para cadastro. Verifique e envie as informações corretamente para prosseguir.

🤖nextVendasBot: /criar_produto <nome do produto>, <valor>, <key>.`,

      msgLimite: `⚠️ *Limite de itens excedido!* ⚠️\n` +
        `Você pode adicionar no máximo 3 itens. Por favor, revise sua lista e tente novamente.\n\n` +
        `🤖 *nextVendasBot*`,

        produtoCadastradoSucesso: `🎉 Produto Cadastrado com Sucesso! 🎉
        O produto foi cadastrado com sucesso.
        Obrigado por utilizar nosso sistema!`,
    };
  };
};

module.exports = CadastrarProduto;
