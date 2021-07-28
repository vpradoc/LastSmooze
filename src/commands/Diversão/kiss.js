const fetch = require("node-fetch");
const Emojis = require("../../utils/Emojis");
const Command = require("../../structures/Command.js");
const ClientEmbed = require("../../structures/ClientEmbed.js");

module.exports = class Kiss extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "kiss";
    this.aliases = ["beijar"];
    this.category = "Diversão";
    this.description = "Comando para dar um beijo em um(a) usuário(a)!";
    this.usage = "kiss <user>";

    this.enabled = true;
    this.guild = true;
  }

  async run(message, args, prefix, author) {
    const user =
      this.client.users.cache.get(args[0]) || message.mentions.members.first();

    if (!user) {
      message.reply(
        `${Emojis.Errado} » Você deve escolher um membro para levar o beijo!`
      );
    } else if (user.id === message.author.id) {
      message.reply(
        `${Emojis.Errado} » Você não pode dar um beijo em sí mesmo!`
      );
    } else {
      const gif = await fetch("https://nekos.life/api/v2/img/kiss").then(
        (res) => res.json()
      );

      const embed = new ClientEmbed(author)
        .setDescription(
          `**${
            message.author.username ? message.author : message.author.username
          } deu um beijo no(a) <@${user.id}>!**`
        )

        .setImage(gif.url);

      message.reply({ embeds: [embed] });
    }
  }
};
