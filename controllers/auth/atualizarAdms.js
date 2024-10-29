class admAtualizar {
    static config = require("../../config/roles.json");
    static db = require("../../config/db").config();
    static bot(bot) {
      bot.command("atualizarAdms", async (msg) => {
        const menssage = msg.message.text.split(" ").slice(1);
        console.log(menssage);
        
        const { id } = await msg.getChat();
  
        if (this.validacoes(menssage, msg, id)) {
          return;
        }
        this.atualizarAdm(menssage, msg);
      });
    }
  
    static validacoes(id, msg, idUser) {
      if (id.length == 0) {
        msg.reply(this.mensagens().idNaoInformado);
        return true;
      }
  
      if (idUser.toString() != this.config.csdevAdm) {
        msg.reply(this.mensagens().naoEoDono);
        return true;
      }

      console.log(String(id));
      
      if (id.length > 3) {
        msg.reply(this.mensagens().msgComprimento);
        return true;
      }
  
      return false;
    }
  
    static mensagens() {
      return {
        msgErro404:  "Olá! ❌ Ocorreu um erro ao tentar apagar o administrador. Por favor, tente novamente mais tarde. Se precisar de assistência, estamos à disposição!",
        idNaoEncontrado:  "Olá! ⚠️ O ID informado não foi encontrado. Por favor, verifique e tente novamente. Se precisar de ajuda, estamos aqui!",
        msgAtualiado: "Olá! ✨ Informamos que o administrador foi atualizado com sucesso. Se precisar de mais assistência, estamos à disposição!",
        msgComprimento:'"Olá! 😊 Por favor, informe primeiro o novo valor e depois o ID do usuário. Note que o comprimento da mensagem deve ser de no máximo 2 caracteres. Agradecemos a sua colaboração!"',
        naoEoDono:"Ops! Apenas o dono do bot tem permissão para usar esse comando. Verifique e tente novamente! 😉",
        idNaoInformado:"Ops! Parece que o campo de ID do administrador está vazio. Por favor, preencha esse campo para continuar. 😊",
      };
    }
  
    static atualizarAdm(id, msg) {
      try {
        console.log(id);
        
        const query = "UPDATE roles SET ID_ADM = ? WHERE ID_ADM = ?";
  
        const { changes } = this.db.prepare(query).run(String(id[0]), String(id[1]));
  
        if (changes >= 1) {
          msg.reply(this.mensagens().msgAtualiado);
          return;
        }
        msg.reply(this.mensagens().idNaoEncontrado);
      } catch (error) {
        msg.reply(this.mensagens().msgErro404);
      } finally {
        this.db.close();
      }
    }
  }
  
  module.exports = admAtualizar;

