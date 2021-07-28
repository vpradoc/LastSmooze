const Command = require("../../structures/Command.js");
const Emojis = require("../../utils/Emojis");
const ClientEmbed = require("../../structures/ClientEmbed.js");

module.exports = class Bigemoji extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "bigemoji";
    this.aliases = ["bemoji"];
    this.category = "Informação";
    this.description =
      "Comando para que eu envie um emoji em um tamanho familia!";
    this.usage = "bigemoji";

    this.enabled = true;
    this.guild = true;
  }

  async run(message, args, prefix, author) {
    if (!args[0])
      return message.reply(
        `${Emojis.Errado} » Coloque um emoji para que eu consiga avaliar!`
      );

    const emoji =
      message.guild.emojis.cache.find(
        (x) => x.id == args[0].replace(/\D/g, "")
      ) || message.guild.emojis.cache.find((x) => x.name === `${args[0]}`);

    if (!emoji)
      return message.reply(
        `${Emojis.Errado} » Coloque um emoji válido para que eu consiga avaliar!`
      );

    const image = emoji.url;

    const Embed = new ClientEmbed(author)
      .setDescription(`**${Emojis.Dado} Aqui está seu emoji:**`)
      .setImage(image);

    if (emoji) return message.reply({ embeds: [Embed] });
  }
};
