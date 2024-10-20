class Register {

    static DatabaseSql = require("../config/db");
  static bot(bot) {
    bot.command("registrar", async (msg) => {
      const { id, first_name } = await msg.getChat();
      await Register.cadastrarUsuario(first_name, id, msg)
    });
  }

  static cadastrarUsuario(nome, id, msg) {
    try {
      const idEmNumero = Number(id);
      const queryVuscaerUser = "SELECT * FROM USER WHERE ID = ?";
      const buscarUser = this.DatabaseSql.config()
        .prepare(queryVuscaerUser)
        .get(idEmNumero);

      if (buscarUser == undefined) {
        const query = "INSERT  INTO USER(NOME_USER, ID) VALUES(?, ?)";
        this.DatabaseSql.config().prepare(query).run(nome, id);
        this.DatabaseSql.config().close();
        msg.reply(Register.msgs().usuarioJaCadastrado);
        return;
      }

      msg.reply(Register.msgs().usuarioJaCadastrado);
    } catch (error) {
      this.DatabaseSql.config().close();
    }
  }

  static msgs() {
    return {
      usuarioJaCadastrado: `😔 Oops! Você já está cadastrado em nosso sistema. 
        Não é necessário se registrar novamente. 
        Se precisar de ajuda ou tiver alguma dúvida, estou à disposição! 😊`,
      usuarioCadastradoComSucesso: `🎉 Parabéns! Você foi cadastrado com sucesso! 
        Agora, explore nossos produtos e aproveite as ofertas. 
        Se precisar de algo, me avise! 😉`,
    };
  }
}


module.exports = Register