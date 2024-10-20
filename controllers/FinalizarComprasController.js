class ComprasViaPix {
  static cache = require("../config/cache/cache");
  static MercadoPagoPagamentos = require("../utils/mercadoPago");
  static db = require("../config/db");
  static bot(bot) {
    ComprasViaPix.pagamentoPix(bot);
  }

  static pagamentoPix(bot) {
    bot.command("finalizarCompraPix", async (msg) => {
      await ComprasViaPix.buscarItensNoCarrinhoDb(msg);
    });
  }

  static async enviarMensagensDePagamento(msg, qr_code_base64, qr_code) {
    await msg.replyWithPhoto({ source: Buffer.from(qr_code_base64, "base64") });
    await msg.reply(ComprasViaPix.mensagens().msgAguardandoPay);
    await msg.reply(ComprasViaPix.mensagens(qr_code).chavePix);
  }

  static async pagamentoEmPix(msg, valor) {
    const { qr_code_base64, qr_code } =
    await ComprasViaPix.MercadoPagoPagamentos.routerPay(valor);
    await ComprasViaPix.enviarMensagensDePagamento(  msg, qr_code_base64, qr_code );
    ComprasViaPix.verificarPagamento(msg);
  }

  static verificarPagamento(msg) {
    const monitorarPagamentoAprovado = setInterval(() => {
      const idUsuario = this.cache.get(`idUsuario`);
      const query = "SELECT * FROM INFORMACAO_PAGAMENTO WHERE ID_DO_USUARIO = ? ";
      const data = this.db.config().prepare(query).get(idUsuario);

      if (data != undefined) {
        const { status_pagamento } = data;


        ComprasViaPix.deletarProdutosPagos()

        if (status_pagamento === "approved") {
          msg.reply(ComprasViaPix.mensagens().msgPagamentoAprovado);
          clearInterval(monitorarPagamentoAprovado);
        }
      }
    }, 20000);
  }

  static deletarProdutosPagos() {
    const idProdutos = this.cache.get("ids")
    const database = this.db.config()

    const espaçosReservados = idProdutos.map((data) => (data = "?")).join(",");
    const idsPorVirgula = idProdutos.join(",");

    const query = `DELETE FROM PRODUTO WHERE ID_PRODUCT IN(${espaçosReservados})`;

    database.prepare(query).run(idsPorVirgula)
    
  }
  static async buscarItensNoCarrinhoDb(msg) {
    const { id } = await msg.getChat();

    const itensCarrinho = this.db.config().prepare(this.query()).all(id);

    if (itensCarrinho.length != 0) {
      const somaProdutos = itensCarrinho .map((item) => item.PRECO_PRODUTO) .reduce((acc, preco) => acc + preco, 0);

      await ComprasViaPix.pagamentoEmPix(msg, somaProdutos);

      const idsProdutos = itensCarrinho.map((item) => item.ID_PRODUCT);

      ComprasViaPix.setCache(`ids`, idsProdutos);
      ComprasViaPix.setCache(`idUsuario`, id);

      return;
    }

    return msg.reply(this.mensagens().msgCarrinho);
  }

  static setCache(nome, item) {
    return this.cache.set(nome, item);
  }

  static atualizarStatusProdutoPedidos() {
    const query = "UPDATE PEDIDOS SET status = ? WHERE ID_PRODUCT = ? ";
  }
  static query() {
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
  static mensagens(chavePix) {
    return {
      msgCarrinho: `
🚨 Carrinho Vazio 🚨

Parece que seu carrinho está vazio ou você ainda não está cadastrado em nosso sistema. Para começar a fazer pagamentos, por favor, faça seu cadastro.

👉 Use o comando "registrar" para se cadastrar.

Estamos aqui para ajudar em qualquer dúvida! 😄
`,
      chavePix: `
💳 **Chave de pagamento gerada!**

Você pode realizar o pagamento utilizando a chave Pix abaixo:

🔑 **Chave Pix**: \`${chavePix}\`

Para pagar, basta copiar essa chave e colar no seu app de pagamento ou escanear o QR Code. 📸

Se preferir, você também pode usar o QR Code para facilitar! 👇

Caso tenha qualquer dúvida, estamos à disposição! 🤝
        `,

      msgAguardandoPay:
        "⏳ Aguardando pagamento...\n\n Assim que o pagamento for confirmado, você receberá a notificação. 💸",

      msgPagamentoAprovado: `📢 [Bot de Pagamentos]: Olá! 

✅ O seu pagamento foi *aprovado* com sucesso! 🎉

Agradecemos pela sua compra! Se precisar de algo, estamos à disposição.

Atenciosamente, 
Equipe de Pagamentos 💳
`,
    };
  }
}

module.exports = ComprasViaPix;
