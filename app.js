const bodyParser = require("body-parser");
const BotAdicionarDados = require("./controllers/auth/getProutoController");
const Menu = require("./controllers/MenuOpcoes");
const ControlePedidos = require("./controllers/orderController");
const Ping = require("./controllers/pingController");
const MeuCarrinho = require("./controllers/meuCarrinhoController");
const Register = require("./controllers/RegistroUserController");
const Compras = require("./controllers/ComprasPixController");
const myApiEXPRESS = require("./routes/botRoutes");
const CartaoDeCredito = require("./controllers/ComprasCartaoCreditoController");
const Produtos = require("./controllers/auth/cadastrarProduto");
const DeletaProduto = require("./controllers/auth/DeletarProduto");

class BotConfig {
  static telegraf = require("telegraf");
  static message = require("telegraf/filters");
  static config = require("./config.json");
  static async startBot() {
    try {
      console.log("bot rodando");
      const bot = new this.telegraf.Telegraf(this.config.Token);
      Menu.menu(bot);
      Ping.pingBot(bot);
      ControlePedidos.bot(bot);
      ControlePedidos.comandoDeAdicionaItem(bot);
      BotAdicionarDados.acoesBot(bot);
      MeuCarrinho.bot(bot);
      Register.bot(bot);
      Compras.bot(bot);
      CartaoDeCredito.bot(bot);
      Produtos.bot(bot);
      DeletaProduto.bot(bot);
      await bot.launch();
    } catch (error) {
      console.log(error);
    };
  };
};

class Express {
  static #express = require("express");
  static #api = this.#express();
  static #parser = require("body-parser");
  static expressConfig() {
    const port = 8080 || process.env.PORT;
    this.#api.use(this.#parser.json());
    this.#api.use(myApiEXPRESS)
    this.#api.listen(port, () => {
      console.log(`servidor rodando na porta ${port}`);
    });
  };
};

BotConfig.startBot();
Express.expressConfig();
