const Command = require("../../structures/Command.js");
const Emojis = require("../../utils/Emojis");
module.exports = class GuildBanner extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "lock";
    this.aliases = ["lockchannel"];
    this.category = "Moderação";
    this.description = "Comando para que eu bloqueie o canal!";
    this.usage = "lock";

    this.enabled = true;
    this.guild = true;
  }

  async run(message, args, prefix, author) {
    if (!message.member.permissions.has("MANAGE_CHANNELS")) {
      return message.reply(
        `${Emojis.Errado} » Você não tem a permissão necessária (\`MANAGE_CHANNELS\`)!`
      );
    }
    if (!message.guild.me.permissions.has("MANAGE_CHANNELS")) {
      return message.reply(
        `${Emojis.Errado} » Eu não tenho a permissão para modificar canais (\`MANAGE_CHANNELS\`)!`
      );
    }

    message.reply(`${Emojis.Certo} » Canal bloqueado com sucesso!`);
    await message.channel.updateOverwrite(
      message.channel.guild.roles.everyone,
      { VIEW_CHANNEL: true, SEND_MESSAGES: false }
    );
  }
};
