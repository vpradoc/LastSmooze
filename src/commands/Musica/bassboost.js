const Command = require("../../structures/Command");
const { Manager } = require('erela.js')
const Emojis = require('../../utils/Emojis')
const ClientEmbed = require('../../structures/ClientEmbed')
const ms = require('ms')

module.exports = class Bass extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "bass";
    this.category = "Musica";
    this.description = "Comando para que eu adicione grave nas músicas!";
    this.usage = "bass <valor>";
    this.aliases = ["bassboost"]

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message, args, prefix, author) {

    if(message.guild.me.voice.channel != null) {
    if(message.member.voice.channel.id != message.guild.me.voice.channel.id === true) return message.reply(`${Emojis.Errado} **|** Você precisa estar no mesmo canal que eu estou para modificar a fila!`)
    }
    const player = message.client.manager.players.get(message.guild.id)
    
    const valor = args[0]

    if(valor === "off") {

      var Obj = {
        "band": 0,
        "gain": 0,
      }
      player.setEQ(Obj)
      message.reply(`${Emojis.Certo} **|** Grave desativado!`)
  
  
    }
    else if(valor === "on") {
    var Obj = {
        "band": 0,
        "gain": 0.25,
      }
      player.setEQ(Obj)
      message.reply(`${Emojis.Certo} **|** Grave ativado!`)
    }
  }
  }

