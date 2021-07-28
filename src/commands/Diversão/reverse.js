const Command = require("../../structures/Command.js");
const Emojis = require("../../utils/Emojis");

module.exports = class Reverse extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "reverse";
    this.category = "Diversão";
    this.description = "Comando para que eu mande uma mensagem ao contrário!";
    this.usage = "reverse <msg>";

    this.enabled = true;
    this.guild = true;
  }

  async run(message, args, prefix) {
    const fala = args.join(" ");

    if (!fala)
      message.reply(
        `${Emojis.Errado} » Por favor, coloque algo para que eu reescreva o mesmo ao contrário!`
      );
    else
      message.reply(
        `${Emojis.Balão} ${fala} = **\`${fala.split("").reverse().join("")}\`**`
      );
  }
};
