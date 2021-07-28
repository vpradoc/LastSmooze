const fetch = require("node-fetch");
const Emojis = require("../../utils/Emojis");
const Command = require("../../structures/Command.js");
const ClientEmbed = require("../../structures/ClientEmbed.js");

module.exports = class Abraço extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "abraço";
    this.aliases = ["hug"];
    this.category = "Diversão";
    this.description = "Comando para abraçar um(a) usuário(a)!";
    this.usage = "hug <user>";

    this.enabled = true;
    this.guild = true;
  }

  async run(message, args, prefix, author) {
    const user =
      this.client.users.cache.get(args[0]) || message.mentions.members.first();

    if (!user) {
      message.reply(
        `${Emojis.Errado} » Você deve escolher um membro para ganhar um abraço!`
      );
    } else if (user.id === message.author.id) {
      message.reply(
        `${Emojis.Errado} » Você não pode dar um abraço em sí mesmo!`
      );
    } else {
      const gif = await fetch("https://nekos.life/api/v2/img/hug").then((res) =>
        res.json()
      );

      const embed = new ClientEmbed(author)

        .setDescription(
          `**${
            message.author.username ? message.author : message.author.username
          } deu um abraço no(a) <@${user.id}>!**`
        )
        .setImage(gif.url);

      message.reply({ embeds: [embed] });
    }
  }
};
