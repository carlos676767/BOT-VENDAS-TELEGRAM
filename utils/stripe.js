class StripeApi {
    static #configJson = require("../../config.json");
    static #stripeApi = require("stripe")(StripeApi.#configJson.apikeyStripe);
  
    static async routerStripe(req, res) {
      try {
        const { valor, tipoMoeda } = req.body;
  
        StripeApi.validacoes(valor, tipoMoeda);
        await StripeApi.listaMoedas(tipoMoeda);
        await StripeApi.#gerarPagamento(valor, res, tipoMoeda);
      } catch (error) {

      }
    }
  

    static #informacoesPagamento(valor, tipoMoeda) {
      const valorParaMultiplicarEmCentavos = 100;
      const valorEmCentavos = valor * valorParaMultiplicarEmCentavos;
      const price_data = {
        price_data: {
          currency: tipoMoeda,
          product_data: { name: "carro alugado" },
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
  
    static async #gerarPagamento(valor, res, tipoMoeda) {
      const { url } = await StripeApi.#stripeApi.checkout.sessions.create({
        payment_method_types: ["card"],
        payment_method_options: {
          boleto: {
            expires_after_days: 7,
          },
        },
        line_items: [this.#informacoesPagamento(valor, tipoMoeda)],
        ...this.configsRedirecionamentoEpagamneto(),
      });
    }
  
    static async notificacoesPagamento(req, res) {
      const tipoNotificacao = req.body.type;
  
      if (tipoNotificacao === "charge.succeeded") {
        const charge = req.body.data.object;
        const recibo = charge.receipt_url;
  
        console.log("Tipo de notificação:", tipoNotificacao);
        console.log("URL do recibo:", recibo);
      };

    }
  }
  module.exports = StripeApi;
  
