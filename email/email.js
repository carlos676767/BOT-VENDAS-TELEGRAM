const emailConfirmaco = require("./emailTemplate");

class NodeMailer {
  static #nodemailer = require("nodemailer");
  static #json = require("../config.json");
  static #config() {
    return this.#nodemailer.createTransport({
      service: "yahoo",
      auth: {
        user: this.#json.email,
        pass: this.#json.senha,
      },
    });
  };


  static async enviarEmail(url, destino) {
    try {
      await this.#config().sendMail({
        from: this.#json.email,
        to: destino,
        subject: "✉️ Confirmacao pagamento",
        html: emailConfirmaco(url)
      });
    } catch (error) {
      throw new Error("Erro ao enviar email", error);
    };
  };
};

module.exports = NodeMailer;
