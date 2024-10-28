class FormasPagamentos {
  static pagamentosFormas(bot) {
    bot.command("pagamentos", (msg) => {
      msg.reply(this.mensagens());
    });
  }

  static mensagens() {
    return `🌟 Olá! Aqui você pode pagar da maneira que preferir! Aceitamos:

💸PIX: Rápido e prático, ideal para quem não quer perder tempo!
💳Cartão de Crédito: Aceitamos todas as bandeiras, com a opção de parcelar suas compras.

Qualquer dúvida, estou aqui para ajudar! 😊`;
  };
};

module.exports = FormasPagamentos;