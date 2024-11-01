class ProdutosApagar {
    static config = require("../../config/roles.json");
    static db = require("../../config/db")
  
    static bot(bot) {
      bot.command("apagarItens", async (msg) => {
        const { id } = await msg.getChat();
        this.validacoes(id, msg) ? null : this.apagarItens(msg);
      });
    }
  
    static validacoes(id, msg) {
      
  
      if ( String(id) != this.config.csdevAdm) {
        msg.reply(this.mensages().naoAdm);
        return true;
      }
  
      return false;
    }
  
    static apagarItens(msg) {
      try {
        const query = "DELETE FROM PRODUTO";
        const { changes } = this.db.config().prepare(query).run();
        if (changes ==0) {
            msg.reply(this.mensages().naoHaiTENS)
            return;
        }

        if (changes >= 1) {
          msg.reply(this.mensages().sucessoItem);
          return;
        }
  
        msg.reply(this.mensages().falhaerr);
      } catch (error) {
        msg.reply(this.mensages().falhaerr);
      } finally {
        this.db.config().close()
      }
    }
  
    static mensages() {
      return {
        naoHaiTENS: '⚠️ Não há itens para apagar na tabela PRODUTOS.',
        falhaerr:  "❌ Ocorreu um erro ao tentar apagar os produtos. Por favor, tente novamente mais tarde.",
        naoAdm: "Olá! 😊 Você não possui acesso a este comando.",
        sucessoItem: `✅ Todos os produtos foram apagados com sucesso da tabela produtos!`,
      };
    }
  }
  

  module.exports = ProdutosApagar