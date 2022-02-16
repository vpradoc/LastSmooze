const Command = require("../../structures/Command");
const { Manager } = require("erela.js");
const Emojis = require("../../utils/Emojis");

module.exports = class Volume extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "volume";
    this.category = "Musica";
    this.description = "Comando para modificar o volume da fila!";
    this.usage = "volume <valor>";

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message, args, prefix, author) {
    const player = message.client.manager.players.get(message.guild.id);

    if (message.guild.me.voice.channel != null) {
      if (
        (message.member.voice.channel.id !=
          message.guild.me.voice.channel.id) ===
        true
      )
        return message.reply(
          `${Emojis.Errado} **|** Você precisa estar no mesmo canal que eu estou para modificar a fila!`
        );
    }
    if (!player)
      return message.reply(`${Emojis.Errado} **|** Não estou em nenhum canal!`);

    const volume = args[0];

    if (isNaN(volume) || volume >= 500) {
      return message.reply(
        `${Emojis.Errado} **|** Por favor, coloque um **número** de 0 a 500!`
      );
    } else {
      player.filters.setVolume(Number(volume)),
        await message.reply(
          `${Emojis.Certo} **|** Valor modificado para \`${volume}\`!`
        );
    }
  }
};
