

class Menu {
  static Sql = require("../config/db");
  static configButtons() {
    const menuText = `🛍️ Menu do Next Vendas Bot:

    1. 🖐️ /iniciar - Iniciar a interação com o bot
    2. 🛒 /ver_produtos - Ver Produtos
    3. 📦 /meu_carrinho - Meu Carrinho
    4. 📋 /comprar_produto** - Comprar produto
    5. 💳 /pagamentos - Pagamentos
    6. 📊 /status_do_pedido - Status do Pedido
    7. 🛠️ /criar_produto - Criar Produto
    8. ✏️ /editar_produto - Editar Produto
    9. 🗑️ /deletar_produto** - Deletar Produto
    10. 📶 /ver_ping - Ver Ping
    11. 📝 /registrar - Registrar novo usuário
    
    Escolha uma opção digitando o comando correspondente! 😊`;
    
    return menuText;
  }

  static menu(bot) {
    bot.command("iniciar", async(ctx) => {
      const {id, first_name} = await ctx.getChat()
      Menu.cadastrarUser(first_name, id)
      const msg = `Olá! Bem-vindo ao Next Vendas Bot! 🛍️\n\n🛒 Aqui está o menu! Faça suas escolhas e boas compras! Se precisar de ajuda, estou aqui! 😊 ${Menu.configButtons()}`
      ctx.reply(msg);
    });
  }


  static cadastrarUser( nome,id){
    try {
      const queryVuscaerUser = 'SELECT * FROM USER WHERE ID = ?'
      const buscarUser = this.Sql.config().prepare(queryVuscaerUser).get(id)
      
      if (buscarUser == undefined) {
        const query = 'INSERT  INTO USER(NOME_USER, ID) VALUES(?, ?)'
        this.Sql.config().prepare(query).run(nome, id) 
        this.Sql.config().close()
      }
      
    } catch (error) {
      this.Sql.config().close()
    }
  }
}


module.exports = Menu;
