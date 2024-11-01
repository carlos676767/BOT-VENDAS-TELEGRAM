

class CartaoDeCredito {
  static database = require("../config/db");
  static stripeApi = require('../utils/stripe');
  static cache = require('../config/cache/cache');
  static email = require('../email/email');
  static bot(bot) {
    bot.command("finalizarCompraComOutroMetodo",async (msg) => {
      await CartaoDeCredito.buscarItensNoCarrinhoDb(msg)
    });
  };


  static async pagamentoCartaoCredito(valor, msg, nomeItens){
    const url = await CartaoDeCredito.stripeApi.gerarPagamento(valor,nomeItens)

    if (url != undefined) {
    return msg.reply(this.mensagens(url).msgLink)
    };
  };

  static async buscarItensNoCarrinhoDb(msg) {
    const { id } = await msg.getChat();

    const itensCarrinho = this.database.config().prepare(this.querys()).all(id);
    
    if (itensCarrinho.length != 0) {
      const somaProdutos = itensCarrinho.map((item) => item.PRECO_PRODUTO) .reduce((acc, preco) => acc + preco, 0);
      const itens = itensCarrinho.map(data => data.NOME_PRODUTO).join(',').toLowerCase()
     
      
      await CartaoDeCredito.pagamentoCartaoCredito(somaProdutos,msg,itens);

      const idsProdutos = itensCarrinho.map((item) => item.ID_PRODUCT).join(',')

      console.log(idsProdutos);
      
      CartaoDeCredito.setarCache('iDSPRODUTOS', idsProdutos);
      CartaoDeCredito.setarCache('idUsuario', id);
      CartaoDeCredito.verificarPagamento(msg)
      return;
    };

    return msg.reply(this.mensagens().msgCarrinho);
  }


  static setarCache(propriedade, valor){
    this.cache.set(propriedade, valor)
  }



  static buscarNotificicao(){
    const idUsuario = this.cache.get('idUsuario')
    const query = 'SELECT * FROM PAGAMENTOS_CARTAO WHERE ID_DO_USUARIO = ?'
    const instanciaDatabase = this.database.config();


    return instanciaDatabase.prepare(query).get(idUsuario)
  }

  static verificarPagamento(msg){
    try {

    const pagamento = setInterval(async() => {
      const webhook = await CartaoDeCredito.buscarNotificicao()
      
      if (webhook) {
       const {email_user, recibo, ID_PRODUTOS, ID_DO_USUARIO} = webhook;
       await this.email.enviarEmail(recibo, email_user)
       CartaoDeCredito.entregarProduto(ID_PRODUTOS, msg);
       CartaoDeCredito.deleteProduto(ID_PRODUTOS);
      
       CartaoDeCredito.deletarItensPagosCartao(ID_DO_USUARIO);
       clearInterval(pagamento);
      };
      
     }, 20000);
     
    } catch (error) {
      throw new Error("Error ao verificar", error);
    }finally{
      this.database.config().close;
    };
  };


  static atualizarStatusProdutoPedidos(ids) {
    const db = this.database.config();
    const espaçosReservados = ids.map(data => data = '?').join(',');
    const query = `UPDATE PEDIDOS SET status = ? WHERE ID_PRODUCT IN(${espaçosReservados})`;
   
    db.prepare(query).run('Entregue', ...ids);
    this.database.config().close;
  };

  static entregarProduto(ids, msg){
   try {
    const produdutosIdMap = [...ids].map(data => data = '?').join(',');
    const produtoEntregar = `SELECT * FROM PRODUTO WHERE ID_PRODUCT IN(${produdutosIdMap})`;

    const db = this.database.config().prepare(produtoEntregar).all(...ids);
    const itens = db.map(data => data.keys).join(',');

    if (itens.length == 0) {
      return msg.reply(this.mensagens().produtoNaoEnviado);
    };

    msg.reply(this.mensagens(itens).msgKey);
   } catch (error) {
    msg.reply(this.mensagens().mensagemErroProduto);
   }finally{
    this.database.config().close();
   };
  };

  static deleteProduto(ids){
    const produdutosIdMap = [...ids].map(data => data = '?').join(',');
    
    const query = `DELETE FROM PRODUTO WHERE ID_PRODUCT IN(${produdutosIdMap})`;

    this.database.config().prepare(query).run(...ids);
    
  };


  static deletarItensPagosCartao(usuario){
    const query = 'DELETE FROM PAGAMENTOS_CARTAO WHERE ID_DO_USUARIO = ?';
    const databaseImportar = this.database.config();
    databaseImportar.prepare(query).run(usuario);
  };

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
  };

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
    `,

  msgKey: `🎉 *Parabéns pela sua compra!* Aqui está a chave de acesso aos seus produtos: **[${atributo}]** 🔑.

Se tiver alguma dúvida ou precisar de ajuda, entre em contato conosco pelo e-mail: carçosygegyud@gmail.com ✉️.

Obrigado por escolher a gente! 😊`,


produtoNaoEnviado: `
🤖 **Olá!**

No momento, não temos produtos disponíveis para entrega. Se você tiver um comprovante de pagamento, entre em contato conosco! 📄

Você pode nos enviar um e-mail para **contato@exemplo.com** ou falar conosco pelo WhatsApp no número **(11) 99999-9999**. Estamos aqui para ajudar! 📧📱

Agradecemos pela sua compreensão! 🙏✨
`,


mensagemErroProduto: `
⚠️ **Olá!**

Ocorreu um erro inesperado ao tentar entregar os itens. Pedimos desculpas pelo inconveniente. 

Por favor, entre em contato com um administrador para resolver a situação. Você pode nos enviar um e-mail para **contato@exemplo.com** ou falar conosco pelo WhatsApp no número **(11) 99999-9999**. Estamos aqui para ajudar! 📧📱

Agradecemos pela compreensão! 🙏
`
    };
  };
};

module.exports = CartaoDeCredito;
