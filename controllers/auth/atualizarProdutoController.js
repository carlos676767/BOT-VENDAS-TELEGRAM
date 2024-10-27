

class ProdutosAtualiaalizar {
  static database = require("../../config/db");
  static roles = require("../../config/roles.json");

  static bot(bot) {
    bot.command("editar_produto", async (msg) => {
      const { id } = await msg.getChat();
      const mensagess = msg.message.text.split(' ').slice(1)
      
      if (ProdutosAtualiaalizar.validacoes(msg, id, mensagess)) {
        return
      }

      ProdutosAtualiaalizar.alteracoesProdutos(mensagess, msg)
    });
  }

  static validacoes(msg,id, produtos) {
    if (this.roles.csdevAdm != String(id)) {
        msg.reply(this.mensages().naoAutorizado)
        return true
    };

    if (produtos.length == 0) {
        msg.reply(this.mensages().msgAtt)
        return true
    };

    const opcao = produtos[0]
    const arraysOpcoes = [1,2,3]

    if (!arraysOpcoes.includes(Number(opcao))) {
        msg.reply(this.mensages().opcaoInvalida)
        return true
    };

    return false;
  };

  
  static mensages() {
    return {
        naoAutorizado: `⚠️ *Acesso negado!* ⚠️  
O ID fornecido não possui permissões para editar produtos. Você não pode realizar essa ação.

Por favor, solicite permissão de administrador para proceder. Entre em contato com o responsável.

🤖 *nextVendasBot*`,

  msgAtt: `🔄 *Atualização de Produto* 🔄  
Para atualizar o produto, utilize os seguintes comandos:

- Para atualizar o nome, digite: \`/editar_produto 1 [novo nome]\`  
- Para atualizar o valor, digite: \`/editar_produto 2 [novo valor]\`  
- Para atualizar a key, digite: \`/editar_produto 3 [nova key]\`  

Exemplo: Para alterar o valor, você pode usar: \`/editar_produto 2 199.99\`.

Aguardo suas instruções!

🤖 *nextVendasBot*`,

        opcaoInvalida: `❗ *Opção Inválida* ❗  
Por favor, informe a opção correta para a atualização do produto. Utilize um dos seguintes comandos:

1. Para atualizar o nome: \`/editar_produto 1 [novo nome] [ID do produto]\`  
2. Para atualizar o valor: \`/editar_produto 2 [novo valor] [ID do produto]\`  
3. Para atualizar a key: \`/editar_produto 3 [nova key] [ID do produto]\`  

Aguardo sua resposta!

🤖 *nextVendasBot*
`,


msgIdErrado: `❗ *ID Incorreto* ❗  
O ID informado está incorreto. Por favor, verifique e tente novamente.

Certifique-se de que o ID do produto que você está utilizando é válido e siga as instruções para atualizar:

1. Para atualizar o nome: \`/editar_produto 1 [novo nome] [ID do produto]\`  
2. Para atualizar o valor: \`/editar_produto 2 [novo valor] [ID do produto]\`  
3. Para atualizar a key: \`/editar_produto 3 [nova key] [ID do produto]\`  

Aguardo sua resposta!

🤖 *nextVendasBot*
`,


msgProdutoAtt: `✅ *Produto Atualizado!* ✅  
O produto foi atualizado com sucesso!

Se precisar de mais alguma informação ou quiser fazer outras alterações, é só avisar.

🤖 *nextVendasBot*
`,


err404: `⚠️ *Erro Inesperado* ⚠️  
Ocorreu um erro inesperado durante a atualização do produto. 

Por favor, tente novamente mais tarde. Se o problema persistir, entre em contato com a equipe de suporte.

🤖 *nextVendasBot*
`
    }
}

  static alteracoesProdutos(opcao, msg) {

   try {
    const optionNumero = String(opcao[0])
    const novoValor = opcao[1]
    const idProduto = opcao[2]

    
    const condicional = {
        '1': 'nome',
        '2': 'preco', 
        '3': 'keys'
    };

    const valorSetado = condicional[optionNumero]
    const query = `UPDATE PRODUTO SET ${valorSetado} = ? WHERE ID_PRODUCT = ?`
    const {changes} = ProdutosAtualiaalizar.database.config().prepare(query).run(novoValor, idProduto);

    if (changes == 0) {
        msg.reply(this.mensages().msgIdErrado)
        return true
    }

    return msg.reply(this.mensages().msgProdutoAtt)
   } catch (error) {
    msg.reply(this.mensages().err404)
   }finally{
    this.database.config().close()
   };
  };
};

module.exports = ProdutosAtualiaalizar;
