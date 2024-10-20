



class ControlePedidos {
  static DatabaseSql = require("../config/db");
  static bot(bot) {
    ControlePedidos.#botMensageInformcao(bot);
  }

  static #botMensageInformcao(bot) {
    bot.command("comprar_produto", (msg) => {
      msg.reply(ControlePedidos.#mensagensBot().msgInstrucoesProdutos);
    });
  }

  static comandoDeAdicionaItem(bot) {
    try {
      bot.command("addcarrinho", async (msg) => {
        const user = await ControlePedidos.InforUser(msg);
        const procurarUusario = ControlePedidos.procurarIdUsuario(user.id)

        if (procurarUusario === undefined) {
          return msg.reply(ControlePedidos.#mensagensBot().usuarioNaoCadastrado)

        }
        if (user.idProduto == null) {
          return msg.reply(ControlePedidos.#mensagensBot().msgIdNaoIformado);
        }

        const dbProcurarId = ControlePedidos.databaseBuscarId( user.idProduto[0]  );
        
        if (dbProcurarId === undefined) {
          return msg.reply(ControlePedidos.#mensagensBot().msgIdNaoExiste);
        }

        const { ID_PRODUCT } = dbProcurarId;

        ControlePedidos.inserirProdutoNaTabelaPedidos(user.id, ID_PRODUCT, msg);
      });
    } catch (error) {
      console.log(error);
    };
  };


  static procurarIdUsuario(id) {
    try {
      const idEmNumero = Number(id);
      const queryVuscaerUser = "SELECT * FROM USER WHERE ID = ?";
      const buscarUser = this.DatabaseSql.config().prepare(queryVuscaerUser).get(idEmNumero)

      return buscarUser

    } catch (error) {
      this.Sql.config().close();
    }
  }


  static async InforUser(msg) {
    const idProduto = msg.message.text.match(/\d+/g);
    const { id, first_name } = await msg.getChat();
    return { id, first_name, idProduto };
  }

  static inserirProdutoNaTabelaPedidos( iUser, idProduto, msg) {
    try {
      const database = this.DatabaseSql.config();
      const data = this.data();
      const status = "Aguardando Pagamento";
      const query = "INSERT INTO PEDIDOS (status, ID_USER, ID_PRODUCT, data) VALUES(?, ?, ? , ?)";
      const { changes } = database  .prepare(query).run(status, iUser, idProduto, data);

      if (changes == 1) {
        msg.reply(ControlePedidos.#mensagensBot().msgProdutoNoCarrinho);
      }
    } catch (error) {  
      msg.reply(ControlePedidos.#mensagensBot().msgErrInesperado);
    }
  }

  static data() {
    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, "0");
    const dia = String(agora.getDate()).padStart(2, "0");

    return `${dia}/${mes}/${ano}`;
  }



  static databaseBuscarId(id) {
    const query = "SELECT * FROM PRODUTO WHERE ID_PRODUCT = ?";
    const database = this.DatabaseSql.config().prepare(query).get(id);
    return database;
  }

  static #mensagensBot() {
    return {
      msgInstrucoesProdutos: `🛒 Olá! Estamos felizes em ajudá-lo a encontrar o que precisa! Para visualizar todos os nossos produtos e seus respectivos IDs, use o comando /ver_produtos. 

🔍 Após ver a lista de produtos, você pode adicionar o item desejado ao seu carrinho. Para isso, basta usar o comando /addcarrinho <ID>. Por exemplo, se você deseja adicionar o produto com ID **1**, digite /addcarrinho 1.

🛍️ Fique à vontade para perguntar se precisar de mais assistência. Estamos aqui para ajudar! 😊`,

      msgIdNaoIformado: `🚫 Ops! Parece que você esqueceu de informar o ID do produto que deseja adicionar ao carrinho.

🔍 Para visualizar todos os produtos e seus respectivos IDs, use o comando /ver_produtos. Assim, você poderá encontrar o ID correto e adicionar o item desejado.

Se precisar de mais assistência, estou aqui para ajudar! 😊`,

      msgIdNaoExiste: `🚫 Desculpe! O ID do produto que você informou não existe em nosso catálogo.

🔍 Por favor, verifique a lista de produtos disponíveis usando o comando /ver_produtos para encontrar um ID válido.

Se precisar de mais assistência, estou aqui para ajudar! 😊`,

      msgProdutoNoCarrinho: `🛒 Produto adicionado ao seu carrinho com sucesso! 

Para visualizar os itens em seu carrinho, use o comando /meu_carrinho. 
Se estiver pronto para finalizar a compra, use o comando /finalizarCompraPix. ou /finalizarCompraComOutroMetodo

Agradecemos por escolher nossos produtos! Se precisar de mais assistência, estou aqui para ajudar! 😊`,

      msgErrInesperado: `⚠️ Oops! Ocorreu um erro inesperado. 

Estamos trabalhando para resolver isso o mais rápido possível. 

Por favor, tente novamente mais tarde ou entre em contato com o suporte se o problema persistir. Agradecemos pela sua compreensão! 🙏`,

usuarioNaoCadastrado: `🚫 Parece que você ainda não está cadastrado em nosso sistema. 
Não se preocupe, é fácil! 
Para começar, basta usar o comando /registrar e completar seu cadastro. 
Qualquer dúvida, estou aqui para ajudar! 😊`
    };
  }
}

module.exports = ControlePedidos;
