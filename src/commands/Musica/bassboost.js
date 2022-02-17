const Command = require("../../structures/Command");
const { Manager } = require('erela.js')
const Emojis = require('../../utils/Emojis')
const ClientEmbed = require('../../structures/ClientEmbed')
const ms = require('ms')

module.exports = class BassBoost extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "bassboost";
    this.category = "Musica";
    this.description = "Comando para que eu adicione grave as músicas!";
    this.usage = "bassboost";
    this.aliases = ["bass"]

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
      
    player.filters.setEqualizer([0.31, 0.25, 0.21, 0.18, 0.10]);
    await message.reply(`${Emojis.Certo} **|** Bass adicionado!`)
    
      }
  }

