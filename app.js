
const BotAdicionarDados = require("./controllers/auth/getProutoController");
const Menu = require("./controllers/MenuOpcoes");
const ControlePedidos = require("./controllers/orderController");

const Ping = require("./controllers/pingController");


class BotConfig {
  static telegraf = require("telegraf");
  static message = require("telegraf/filters");
  static config = require('./config.json')
  static async startBot() {
    try {
      const bot = new this.telegraf.Telegraf(this.config.Token);
      Menu.menu(bot)
    
      Ping.pingBot(bot)

      ControlePedidos.bot(bot)
      ControlePedidos.comandoDeAdicionaItem(bot)
      BotAdicionarDados.acoesBot(bot)
      await bot.launch();
    } catch (error) {
      console.log(error);
    }
  }
}




BotConfig.startBot();
