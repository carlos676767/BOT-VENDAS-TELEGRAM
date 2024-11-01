class Adm {
  static #role = require("../../config/roles.json");
  static #db = require("../../config/db");

  static bot(bot) {
    bot.command("registrarNovosAdm", async (msg) => {
      const { id } = await msg.getChat();

      
      const idAdm = msg.text.split(" ").slice(1)[0];

      if (this.validacoes(id, msg, idAdm)) return;
      
      if (this.verificarId(idAdm, msg)) return
      

      this.cadastrarAdm(idAdm, msg)
    });
  }

  static validacoes(idUsuario, msg, idAdmCadastrado) {
    if (idUsuario != this.#role.csdevAdm) {
      msg.reply(Adm.mensanges().naoTemPerm);
      return true;
    }

    if (idAdmCadastrado.length == 0) {
      msg.reply(this.mensanges().idNaoInformado);
      return true;
    }

    return false;
  }

  static mensanges() {
    return {
        erroAoCadastrar:'😞 Infelizmente, não foi possível cadastrar o ID informado. Por favor, verifique as informações e tente novamente. Se precisar de ajuda, estamos aqui para ajudar',
    msgIDcadastrado: '🎉 Sucesso! O ID foi cadastrado com sucesso em nosso banco de dados. Se precisar de mais alguma coisa, estamos à disposição! 😊',
      msgErroaoVerId: 'Olá! 😟 Ocorreu um erro inesperado ao tentar verificar se o ID existe. Por favor, tente novamente mais tarde. Se o problema persistir, não hesite em nos contatar. Estamos aqui para ajudar! 💪',
      idExiste: 'Olá! 😊 Verificamos que o ID informado já existe em nosso banco de dados. ⚠️ Por favor, verifique e insira um ID diferente. Se precisar de ajuda, estamos à disposição! 💬',
      idNaoInformado: "Olá! 🌟 O ID para cadastrar um administrador não foi informado. Para registrar, use o comando: /registrarNovosAdm [id]. Se precisar de mais alguma coisa, estou aqui para ajudar! 😊",
      naoTemPerm: "Oi! 🌼 Espero que você esteja bem! Só queria avisar que, no momento, você não tem permissão para adicionar um administrador. Se precisar de ajuda com outra questão, estou aqui para ajudar! 😊",
    };
  }



  static verificarId(id, msg){
    try {
        const query = 'SELECT * FROM roles WHERE ID_ADM = ?';
        const databaseInstancia = this.#db.config();
        const result = databaseInstancia.prepare(query).get(id);

        if (result != undefined) {
            msg.reply(this.mensanges().idExiste)
            return true
        }
        return false
    } catch (error) {
        msg.reply(this.mensanges().msgErroaoVerId);
    }finally{
        this.#db.config().close();
    };

  };


  static cadastrarAdm(id, msg) {
    try {
      const query = "INSERT INTO roles(ID_ADM) VALUES(?)";
      const databaseInstancia = this.#db.config();
      const { changes } = databaseInstancia.prepare(query).run(id);
      
      if (changes >= 1) {
        msg.reply(this.mensanges().msgIDcadastrado);
      };
      
    } catch (error) {
        msg.reply(this.mensanges().erroAoCadastrar)
    } finally {
        this.#db.config().close()
    }
  }
}

module.exports = Adm;
