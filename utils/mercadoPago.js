const { MercadoPagoConfig, Payment } = require("mercadopago");

class MercadoPagoPagamentos {
  static config = require("../config.json");


  static mpCobfig() {
    const novopay = new MercadoPagoConfig({
      accessToken: this.config.tokenMp,
      options: { timeout: 5000 },
    });
    const pagamento = new Payment(novopay);
    return pagamento
  }


  static payValues(valor){
      const body = {
        transaction_amount: valor,
        description: `produtos`,
        payment_method_id: "pix",
        payer: {
          email: "lacopo6367@esterace.com",
        },
      }
      return body
  }

  static async routerPay(req, res) {
    try {
        
      const { valor } = req.body;
      
      const body = MercadoPagoPagamentos.payValues(valor)
      const pagamento = await MercadoPagoPagamentos.mpCobfig().create({body})

      const {qr_code_base64, ticket_url} = pagamento.point_of_interaction.transaction_data
      
    } catch (error) {
      
    }
  }


  static async routerWebhook(req, res) {
  try {
    const {data} = req.body
    const mercadoPago =  MercadoPagoPagamentos.mpCobfig()
    const getId = await mercadoPago.get({id: data.id})

    if (getId.status == 'approved') {
      console.log('aprovado');
    };
    
  } catch (error) {

  }
  
  }
}

module.exports = MercadoPagoPagamentos