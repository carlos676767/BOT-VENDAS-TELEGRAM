class BotAdicionarDados {
  static database = require("../../config/db");
  

  
  static queryDb(){
    const database = this.database.config();
    const query = "SELECT * FROM PRODUTO ORDER  BY nome ASC";
    return database.prepare(query).all();
  }

  static  acoesBot(bot) {
    bot.command("ver_produtos", async(msg) => {

      const produtos =  await BotAdicionarDados.queryDb()

      
      if (produtos.length == 0) {
        msg.reply(BotAdicionarDados.#messanges().naoTemItem);
        return
      }

      const itens = produtos.reduce((acc, data) => {
        return acc += ` 1️⃣ ID: ${data.ID_PRODUCT} 📦 ${data.nome} - 💰 ${data.preco}R$\n`;
     }, '');

     msg.reply(`${BotAdicionarDados.#messanges().itens}\n\n ${itens}`)
    });
  }



  static #messanges() {
    return {
      naoTemItem: ` 👀 Ops! No momento, não temos produtos disponíveis em nosso catálogo.
      🛍️ Estamos sempre trabalhando para trazer novidades! Volte em breve para conferir as opções.
      Se precisar de ajuda ou tiver alguma dúvida, não hesite em nos chamar! 😊`,
      itens: '🛒 Confira nossos produtos disponíveis:'
    };
    
  }
}

module.exports = BotAdicionarDados;
