class Ping {
  static pingBot(bot) {
    bot.command("ver_ping", async(ctx) => {
      const agora = Date.now();

      await ctx.reply('Ping...')
      const latencia = Date.now() - agora
      ctx.reply(`Pong! 🌐\nA latência é de ${latencia}ms.`); 
    });
  }
}

module.exports = Ping