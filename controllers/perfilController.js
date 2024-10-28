class PerfilController {
  static bot(bot){
    bot.command('perfil', async(msg) => {
        const perfil = await msg.getChat()
        const {id, first_name} = perfil

        PerfilController.mostrarPerfil(first_name, id, msg);
    })
  };


  static mostrarPerfil(nome, id, msg){
    const perfil =  `
    👤Perfil do Usuário
    
    Nome: ${nome}  
    ID: ${id}  
    
    Se precisar de ajuda, sinta-se à vontade para entrar em contato! 😊
    `;

    msg.reply(perfil);
  };
};

module.exports = PerfilController;