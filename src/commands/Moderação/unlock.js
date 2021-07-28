const Command = require("../../structures/Command.js");
const Emojis = require("../../utils/Emojis");
module.exports = class GuildBanner extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "unlock";
    this.aliases = ["unlockchannel"];
    this.category = "Moderação";
    this.description = "Comando para que eu desbloqueie o canal!";
    this.usage = "unlock";

    this.enabled = true;
    this.guild = true;
  }

  async run(message, args, prefix, author) {
    if (!message.member.permissions.has("MANAGE_CHANNELS")) {
      return message.reply(
        `${Emojis.Errado} » Você não tem a permissão (\`MANAGE_CHANNELS\`) necessária!`
      );
    } else if (!message.guild.me.permissions.has("MANAGE_CHANNELS")) {
      return message.reply(
        `${Emojis.Errado} » Eu não tenho a permissão para modificar canais!`
      );
    }

    message.reply(`${Emojis.Certo} » Canal desbloqueado com sucesso!`);
    await message.channel.updateOverwrite(
      message.channel.guild.roles.everyone,
      { VIEW_CHANNEL: true, SEND_MESSAGES: true }
    );
  }
};
