const Command = require("../../structures/Command.js");
const ClientEmbed = require("../../structures/ClientEmbed");
const Emojis = require("../../utils/Emojis");
module.exports = class GuildBanner extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "guildbanner";
    this.aliases = ["serverbanner"];
    this.category = "Informação";
    this.description = "Comando para que eu envie o banner do servidor!";
    this.usage = "guildbanner";

    this.enabled = true;
    this.guild = true;
  }

  async run(message, args, prefix, author) {
    if (message.guild.banner === null) {
      return message.reply(
        `${Emojis.Errado} » Este servidor não conta com um banner!`
      );
    }

    const embed = new ClientEmbed(author)
      .setTitle(
        `Banner de ${message.guild.name}`,
        message.guild.iconURL({ dynamic: true })
      )
      .setImage(`${message.guild.bannerURL({ dynamic: true, size: 4096 })}`);

    message.reply({ embeds: [embed] });
  }
};
