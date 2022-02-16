const Command = require("../../structures/Command");
const { Manager } = require("erela.js");
const Emojis = require("../../utils/Emojis");
const ClientEmbed = require("../../structures/ClientEmbed");
const ms = require("ms");

module.exports = class Shuffle extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "shuffle";
    this.category = "Musica";
    this.description = "Comando para que eu toque músicas aleatórias da fila!";
    this.usage = "shuffle";

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message, args, prefix, author) {
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
    const player = this.client.manager.players.get(message.guild.id);

    if (!player || !player.queue[0])
      return message.channel.send(
        `${Emojis.Errado} **|** Não encontrei músicas na fila!`
      );
  else
      player.shuffleQueue(true);
      return message.channel.send(`${Emojis.Certo} **|** Ativado!`);
  }
};
