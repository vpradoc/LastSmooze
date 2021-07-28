const Command = require("../../structures/Command.js");
const Emojis = require("../../utils/Emojis");
const ClientEmbed = require("../../structures/ClientEmbed.js");

module.exports = class Avatar extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "avatar";
    this.aliases = ["foto"];
    this.category = "Informação";
    this.description =
      "Comando para que eu envite o avatar de um(a) usuário(a)!";
    this.usage = "avatar <user>";

    this.enabled = true;
    this.guild = true;
  }

  async run(message, args, prefix, author) {
    const user =
      message.guild.members.cache.get(args[0]) ||
      message.mentions.members.first() ||
      message.guild.members.cache.get(message.author.id)
    

    const avatar = user.user.displayAvatarURL({
      dynamic: true,
      format: "png",
      size: 2048,
    });

    const EMBED = new ClientEmbed(author)

      .setTitle(`${user.nickname ? user.nickname : user.user.username}`)
      .setDescription(
        `${Emojis.Camera} Clique **[aqui](${avatar})** para baixar o avatar.`
      )
      .setImage(avatar);

    message.reply({ embeds: [EMBED] });
  }
};
