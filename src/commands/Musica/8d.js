const Command = require("../../structures/Command");
const { Manager } = require('erela.js')
const Emojis = require('../../utils/Emojis')
const ClientEmbed = require('../../structures/ClientEmbed')
const ms = require('ms')

module.exports = class BassBoost extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "8d";
    this.category = "Musica";
    this.description = "Comando para que eu ative o modo 8D na fila de músicas!";
    this.usage = "8d";

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
      
    player.filters.setRotation({ rotationHz: 0.1 })
    await message.reply(`${Emojis.Certo} **|** 8D ativado!`)
    
      }
  }