const Command = require("../../structures/Command");
const ClientEmbed = require("../../structures/ClientEmbed");
module.exports = class Docs extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "invite";
    this.category = "Outros";
    this.description = "Com este comando eu envio meu link de convite!";
    this.usage = "invite";
    this.aliases = ["convidar"];

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message, args, prefix, author) {
    const Embed = new ClientEmbed(author)
      .setAuthor(
        `${this.client.user.username}`,
        this.client.user.displayAvatarURL()
      )
      .setThumbnail(this.client.user.displayAvatarURL())
      .addField(
        `Meus links:`,
        `**[Link de convite](https://discord.com/oauth2/authorize?client_id=700681803098226778&permissions=20887631278&scope=bot)**`
      );

    message.reply({embeds: [Embed]});
  }
};
