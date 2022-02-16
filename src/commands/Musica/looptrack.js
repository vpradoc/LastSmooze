const Command = require("../../structures/Command");
const { Manager } = require('erela.js')
const Emojis = require('../../utils/Emojis')
const ClientEmbed = require('../../structures/ClientEmbed')
const ms = require('ms')

module.exports = class LoopTrack extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "looptrack";
    this.category = "Musica";
    this.description = "Comando para que eu coloque a musica em loop!";
    this.usage = "loop";
    this.aliases = ["loopsong"]

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message, args, prefix, author) {

    if(message.guild.me.voice.channel != null) {
    if(message.member.voice.channel.id != message.guild.me.voice.channel.id === true) return message.reply(`${Emojis.Errado} **|** Você precisa estar no mesmo canal que eu estou para modificar a fila!`)
    }

    const player = message.client.manager.players.get(message.guild.id)
    
    if (!player.trackRepeat) {
        message.reply(`${Emojis.Certo} **|** Música colocada em loop!`);
        player.setTrackLoop(true);
      } else {

      player.setTrackLoop(false);

      return message.reply(`${Emojis.Certo} **|** Música retirada do loop!`);

      }}
  }

