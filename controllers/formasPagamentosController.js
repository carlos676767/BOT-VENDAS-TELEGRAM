class FormasPagamentos {
  static pagamentosFormas(bot) {
    bot.command("pagamentos", (msg) => {
      msg.reply(this.mensagens());
      msg.replyWithPhoto(
        "https://imgs.search.brave.com/ULEyLQWo70sppgZDq6yrEIw-f6oBijN3JYAT9Wd_YCM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZW5zZW1vbGRlcy5j/b20uYnIvd3AtY29u/dGVudC91cGxvYWRz/LzIwMjAvMDYvSW1h/Z2VtLUJhbmRlaXJh/LWRlLUNhcnQlQzMl/QTNvLVBORy0zMDB4/Mjk4LnBuZw",
        {
          caption:
            "💳Cartão de Crédito: Aceitamos todas as bandeiras, com a opção de parcelar suas compras.",
        }
      );
      msg.replyWithPhoto(
        "https://geradornv.com.br/wp-content/themes/v1.34.3/assets/images/logos/pix/logo-pix-954x339.png",
        {
          caption:
            "💸PIX: Rápido e prático, ideal para quem não quer perder tempo!",
        }
      );
    });
  };

  static mensagens() {
    return `🌟 Olá! Aqui você pode pagar da maneira que preferir! Aceitamos: `;
  }
}

module.exports = FormasPagamentos;
