const Command = require("../../structures/Command");
const { Manager } = require("erela.js");
const Emojis = require("../../utils/Emojis");
const ClientEmbed = require("../../structures/ClientEmbed");
const ms = require("ms");

module.exports = class Shuffle extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "unshuffle";
    this.category = "Musica";
    this.description = "Comando para que eu pare de tocar músicas aleatórias da fila!";
    this.usage = "unshuffle";

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
    
      player.shuffleQueue(false);
      return message.react(`👌`);
  }
};
