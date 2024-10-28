const { MercadoPagoConfig, Payment } = require("mercadopago");
const Cache = require(`../config/cache/cache`)
class MercadoPagoPagamentos {
  static config = require("../config.json");
  static mpCobfig() {
    const novopay = new MercadoPagoConfig({
      accessToken: this.config.mercadoPagoToken,
      options: { timeout: 5000 },
    });
    const pagamento = new Payment(novopay);
    return pagamento;
  };

  static pagamentoConfig(valor, itens) {
    const body = {
      transaction_amount: valor,
      description: itens,
      payment_method_id: "pix",
      payer: { 
        email: "lacopo6367@esterace.com",
      },
    };
    return body;
  };

  static async routerWebhook(req, res) {
    
    const query = "INSERT INTO INFORMACAO_PAGAMENTO(status_pagamento, ID_DO_USUARIO) VALUES(?, ?)";
    const DBpagamentos = require("../config/db");

    
    try {
      const mercadoPagoApi = MercadoPagoPagamentos.mpCobfig();
      const { data } = req.body;
      const statusCompra = await mercadoPagoApi.get({ id: data.id });
      
      if(statusCompra.status === 'approved') {
        
        const idUser = Cache.get("idUsuario");
        DBpagamentos.config().prepare(query).run(statusCompra.status, idUser);
      };

    } catch (error) {
        throw new Error('Erro ao receber webhook, tente novamente.')
    }finally{
      DBpagamentos.config().close()
    };
  };

  static async routerPay(valor, itens) {
    const body = MercadoPagoPagamentos.pagamentoConfig(valor, itens);
    const pagamento = await MercadoPagoPagamentos.mpCobfig().create({ body });
    return pagamento.point_of_interaction.transaction_data;
  };
};

module.exports = MercadoPagoPagamentos;
