const Emojis = require("../../utils/Emojis");
const Command = require("../../structures/Command.js");

module.exports = class Dados extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "dados";
    this.category = "Diversão";
    this.description = "Comando para que eu jogue os dados!";
    this.usage = "dados";

    this.enabled = true;
    this.guild = true;
  }

  async run(message, args, prefix) {
    const result = Math.floor(Math.random() * 6);

    message.reply(
      `${Emojis.Dado} » Você jogou os dados e obteve como resultado o número **${result}**`
    );
  }
};
