

class Menu {
  static Sql = require("../config/db");
  static configButtons() {
    const menuText = `🛍️ Menu do Next Vendas Bot:

    1. 🖐️ /iniciar - Iniciar a interação com o bot
    2. 🛒 /ver_produtos - Ver Produtos
    3. 📦 /meu_carrinho - Meu Carrinho
    4. 📋 /comprar_produto - Comprar Produto
    5. 💳 /pagamentos - Pagamentos
    6. 🛠️ /criar_produto - Criar Produto
    7. ✏️ /editar_produto - Editar Produto
    8. 🗑️ /deletar_produto - Deletar Produto
    9. 📶 /ver_ping - Ver Ping
    10. 📝 /registrar - Registrar novo usuário
    11. 👁 /perfil - Perfil do usuário
    12. 🧑‍💼 /registrarNovosAdm - Registrar novos administradores (apenas dono)
    13. 🔄 /atualizarAdms - Atualizar administradores (apenas dono)
    14. ❌ /apagarAdms - Apagar administradores (apenas dono)
    15. 🧾 /historico - Ver histórico de compras
    16. 🔔 /notificar - Enviar notificações aos usuários(ADMS)
   

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
      const queryVuscaerUser = 'SELECT * FROM USER WHERE ID = ?';
      const buscarUser = this.Sql.config().prepare(queryVuscaerUser).get(id);
      
      if (buscarUser == undefined) {
        const query = 'INSERT  INTO USER(NOME_USER, ID) VALUES(?, ?)';
        this.Sql.config().prepare(query).run(nome, id);
      };
      
    }finally{
      this.Sql.config().close()
    };
  };
};


module.exports = Menu;