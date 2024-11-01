class BotConfig {
  static #telegraf = require("telegraf");
  static #message = require("telegraf/filters");
  static #config = require("./config.json");
  static #BotAdicionarDados = require("./controllers/auth/getProutoController");
  static #Menu = require("./controllers/MenuOpcoes");
  static #ControlePedidos = require("./controllers/orderController");
  static #Ping = require("./controllers/pingController");
  static #MeuCarrinho = require("./controllers/meuCarrinhoController");
  static #Register = require("./controllers/RegistroUserController");
  static #Compras = require("./controllers/ComprasPixController");
  static #CartaoDeCredito = require("./controllers/ComprasCartaoCreditoController");
  static #Produtos = require("./controllers/auth/cadastrarProduto");
  static #DeletaProduto = require("./controllers/auth/DeletarProduto");
  static #ProdutosAtualiaalizar = require("./controllers/auth/atualizarProdutoController");
  static #PerfilController = require("./controllers/perfilController");
  static #FormasPagamentos = require("./controllers/formasPagamentosController");
  static #Adm = require("./controllers/auth/RegistrarNovosAdmController");
  static #AdmsApagar = require("./controllers/auth/apagarAdmsController");
  static #admAtualizar = require("./controllers/auth/atualizarAdms");
  static #Notificacao = require("./controllers/auth/notificacoesController");
  static #HistoricoCompras = require("./controllers/historicoControllerCompras");
  static #ProdutosApagar = require("./controllers/auth/apagarItensController");
  static #UsuariosApagar = require("./controllers/auth/ApagarUsuariosController");

  static async startBot() {
    try {
      console.log("bot rodando");
      const bot = new this.#telegraf.Telegraf(this.#config.Token);

      this.#Menu.menu(bot);
      this.#Ping.pingBot(bot);
      this.#ControlePedidos.bot(bot);
      this.#ControlePedidos.comandoDeAdicionaItem(bot);
      this.#BotAdicionarDados.acoesBot(bot);
      this.#MeuCarrinho.bot(bot);
      this.#Register.bot(bot);
      this.#Compras.bot(bot);
      this.#CartaoDeCredito.bot(bot);
      this.#Produtos.bot(bot);
      this.#DeletaProduto.bot(bot);
      this.#ProdutosAtualiaalizar.bot(bot);
      this.#PerfilController.bot(bot);
      this.#FormasPagamentos.pagamentosFormas(bot);
      this.#Adm.bot(bot);
      this.#AdmsApagar.bot(bot);
      this.#admAtualizar.bot(bot);
      this.#Notificacao.bot(bot);
      this.#HistoricoCompras.bot(bot);
      this.#ProdutosApagar.bot(bot);
     this. #UsuariosApagar.bot(bot);

      await bot.launch();
    } catch (error) {
      console.log(error);
    }
  }
}

class Express {
  static myApiEXPRESS = require("./routes/botRoutes");
  static #express = require("express");
  static #api = this.#express();
  static #parser = require("body-parser");
  static expressConfig() {
    const port = 8080 || process.env.PORT;
    this.#api.use(this.#parser.json());
    this.#api.use(this.myApiEXPRESS);
    this.#api.listen(port, () => {
      console.log(`servidor rodando na porta ${port}`);
    });
  }
}

BotConfig.startBot();
Express.expressConfig();
