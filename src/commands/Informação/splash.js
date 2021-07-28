const Command = require("../../structures/Command.js");
const ClientEmbed = require("../../structures/ClientEmbed");
const Emojis = require("../../utils/Emojis");
module.exports = class GuildBanner extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "splash";
    this.aliases = ["serversplash"];
    this.category = "Informação";
    this.description = "Comando para que eu envie o 'splash' do servidor!";
    this.usage = "splash";

    this.enabled = true;
    this.guild = true;
  }

  async run(message, args, prefix, author) {
    if (message.guild.banner === null) {
      return message.reply(
        `${Emojis.Errado} » Este servidor não conta com um splash!`
      );
    }

    const embed = new ClientEmbed(author)
      .setTitle(
        `Splash de ${message.guild.name}`,
        message.guild.iconURL({ dynamic: true })
      )
      .setImage(`${message.guild.splashURL({ dynamic: true, size: 4096 })}`);

    message.reply({ embeds: [embed] });
  }
};
