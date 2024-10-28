class MeuCarrinho {
  static DatabaseSql = require("../config/db");
  static cache = require('../config/cache/cache')
  static async bot(bot) {
    bot.command("meu_carrinho", async (msg) => {
      const id = await MeuCarrinho.pegarIdChat(msg);
      
      const procurarUser = await MeuCarrinho.procurarIdUsuario(id);

      if (procurarUser === undefined) {
        return msg.reply(MeuCarrinho.menssages().usuarioNaoCadastrado);
      }

      const { ID } = procurarUser;
      const dados = await MeuCarrinho.procurarProdutosVinculadosComAconta(ID);
      
      
      if (dados.length == 0) {
        msg.reply(MeuCarrinho.menssages().msgCartVazio)
        return
      }



      const itens = dados.reduce((acc, item) => {
        return acc += ` 🏷️ Status: ${item.status} 📦 ${item.NOME_PRODUTO} - 💰 ${item.PRECO_PRODUTO}R$\n`;
      }, '');

      msg.reply(`${MeuCarrinho.menssages().msgItens} \n\n ${itens} \n ${MeuCarrinho.menssages().msgFimCompra}`)
    });
  }

  

  static menssages() {
    return {
      usuarioNaoCadastrado: `🚫 Parece que você ainda não está cadastrado em nosso sistema. 
Não se preocupe, é fácil! 
Para começar, basta usar o comando /registrar e completar seu cadastro. 
Qualquer dúvida, estou aqui para ajudar! 😊`,
msgCartVazio: `Olá! Seu carrinho está vazio. 😕  
Para adicionar itens ao carrinho, use o comando /addcarrinho seguido do seu ID de usuário. Exemplo: /addcarrinho <id>.  
Se precisar de ajuda, é só chamar!`,

msgItens: 'Aqui estão os itens no seu carrinho: 🛍️',

msgFimCompra: `
Deseja finalizar a compra ou adicionar mais itens? 🛒💳

Para finalizar com Pix, use o comando: \`/finalizarCompraPix\`  
Para escolher outro método de pagamento, use o comando: \`/finalizarCompraComOutroMetodo\`  
`
    };
  }

  static async pegarIdChat(msg) {
    const { id } = await msg.getChat();
    return id;
  }

  static procurarIdUsuario(id) {
    try {
      const idEmNumero = Number(id);
      const queryVuscaerUser = "SELECT * FROM USER WHERE ID = ?";
      const buscarUser = this.DatabaseSql.config()
        .prepare(queryVuscaerUser)
        .get(idEmNumero);

      return buscarUser;
    } catch (error) {
      this.DatabaseSql.config().close();
    } finally {
      this.DatabaseSql.config().close();
    }
  }

  static procurarProdutosVinculadosComAconta(id, msg) {
    const database = this.DatabaseSql.config();
    const dados = database.prepare(this.query("?")).all(id);
      
    return dados
  }



  static query(idUser) {
    return `
    SELECT 
      PEDIDOS.status, 
      PEDIDOS.ID_USER, 
      PEDIDOS.ID_PRODUCT, 
      PRODUTO.nome AS NOME_PRODUTO, 
      PRODUTO.preco AS PRECO_PRODUTO
    FROM 
      PEDIDOS
    JOIN 
      PRODUTO ON PEDIDOS.ID_PRODUCT = PRODUTO.ID_PRODUCT
    JOIN 
      USER ON PEDIDOS.ID_USER = USER.ID
    WHERE 
      USER.ID = ${idUser}
    ORDER BY 
      PRODUTO.nome ASC;
  `;
  }
}

module.exports = MeuCarrinho;
