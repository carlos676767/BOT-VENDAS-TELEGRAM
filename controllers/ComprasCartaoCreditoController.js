class CartaoDeCredito {
  static database = require("../config/db");
  static stripeApi = require('../utils/stripe');
  static cache = require('../config/cache/cache')
  static bot(bot) {
    bot.command("finalizarCompraComOutroMetodo",async (msg) => {
      await CartaoDeCredito.buscarItensNoCarrinhoDb(msg)
    });
  }


  static async pagamentoCartaoCredito(valor, msg, nomeItens){
    const url = await CartaoDeCredito.stripeApi.gerarPagamento(valor,nomeItens)

    if (url != undefined) {
      
     msg.reply(this.mensagens(url).msgLink)
     

    };
  }

  static async buscarItensNoCarrinhoDb(msg) {
    const { id } = await msg.getChat();

    const itensCarrinho = this.database.config().prepare(this.querys()).all(id);
    
    if (itensCarrinho.length != 0) {
      const somaProdutos = itensCarrinho.map((item) => item.PRECO_PRODUTO) .reduce((acc, preco) => acc + preco, 0);
      const itens = itensCarrinho.map(data => data.NOME_PRODUTO).join(',').toLowerCase()

      
      await CartaoDeCredito.pagamentoCartaoCredito(somaProdutos,msg,itens);

      const idsProdutos = itensCarrinho.map((item) => item.ID_PRODUCT);
      this.cache.set('iDSPRODUTOS', idsProdutos)
      return;
    };

    return msg.reply(this.mensagens().msgCarrinho);
  }


  static querys(){
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
      USER.ID = ?
    ORDER BY 
      PRODUTO.nome ASC;
  `;
  }

  static mensagens(atributo){
    return {
      msgCarrinho: `
      🚨 Carrinho Vazio 🚨
      
      Parece que seu carrinho está vazio ou você ainda não está cadastrado em nosso sistema. Para começar a fazer pagamentos, por favor, faça seu cadastro.
      
      👉 Use o comando "registrar" para se cadastrar.
      
      Estamos aqui para ajudar em qualquer dúvida! 😄
      `,

      msgLink: `
      Olá! 😊
      Aqui está o seu link de pagamento para finalizar a compra com cartão de crédito:
      👉 ${atributo}
    
      Caso tenha alguma dúvida, estou por aqui para ajudar! 💬
      Agradecemos a sua compra e esperamos que você aproveite! 🛒
    `
    }
  }
}

module.exports = CartaoDeCredito;
