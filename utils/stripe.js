class StripeApi {
    static #configJson = require("../config.json");
    static #stripeApi = require("stripe")(StripeApi.#configJson.stripeToken);
    
    static #informacoesPagamento(valor, itens) {
      const valorParaMultiplicarEmCentavos = 100;
      const valorEmCentavos = valor * valorParaMultiplicarEmCentavos;
      const price_data = {
        price_data: {
          currency: 'brl',
          product_data: { name: `${itens}` },
          unit_amount: valorEmCentavos,
        },
        quantity: 1,
      };
  
      return price_data;
    }
  
    static configsRedirecionamentoEpagamneto() {
      return {
        mode: "payment",
        success_url: "https://www.exemplo.com",
        cancel_url: "https://www.exemplo.com",
      };
    }
  
    static async gerarPagamento(valor,itens) {
      try {
        const { url } = await StripeApi.#stripeApi.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [this.#informacoesPagamento(valor, itens)],
          ...this.configsRedirecionamentoEpagamneto(),
        });
      
        
        return url
        
      } catch (error) {
        
        throw new Error('error ao criar pagamento.')
      }
    }

    static async notificacoesPagamento(req, res) {
      const  database = require('../config/db');
      const cache = require('../config/cache/cache');
      try {
        const tipoNotificacao = req.body.type;


       if (tipoNotificacao === "charge.succeeded") {
        const query = 'INSERT INTO PAGAMENTOS_CARTAO (status_pagamento, email_user, recibo, ID_DO_USUARIO, ID_PRODUTOS) VALUES(?, ?, ?, ?, ?)';
        
        const charge = req.body.data.object;

        const dados = {
          email:charge.billing_details.email,
          recibo: charge.receipt_url
        };

        const instanciaDb = database.config();
        const idUsuario = cache.get('idUsuario');
        const idProdutos = cache.get('iDSPRODUTOS');
        const {email, recibo} = dados;
        instanciaDb.prepare(query).run('aprovado',email, recibo, idUsuario, idProdutos);
        
      };

      } catch (error) {
        console.log(error);
      }finally{
        database.config().close;
      }
    }
  }
  module.exports = StripeApi;
  
