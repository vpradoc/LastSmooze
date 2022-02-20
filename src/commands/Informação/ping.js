const Command = require("../../structures/Command.js");
const Emojis = require("../../utils/Emojis.js");
const User = require("../../database/Schemas/User");

module.exports = class Ping extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "ping";
    this.category = "Informação";
    this.description = "Comando para que eu envie informações sobre meu ping!";
    this.usage = "ping";

    this.enabled = true;
    this.guild = true;
  }

  async run(message, args, prefix, author) {
    const start = process.hrtime();
    const doc = await User.findOne({ _id: message.author.id });
    const stop = process.hrtime(start);
    const pingm = Math.round((stop[0] * 1e9 + stop[1]) / 1e6);

    message.channel.send(`${Emojis.Wifi} » Calculando!`).then((m) => {
      var ping = m.createdTimestamp - message.createdTimestamp;

      m.edit(
        `**🏓 | Meu ping:** \`${ping}\`ms\n**${Emojis.Wifi} | MongoDB:** \`${pingm}\`ms`
      );
    });
  }
};
