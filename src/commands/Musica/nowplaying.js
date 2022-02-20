const Command = require("../../structures/Command");
const { Manager } = require('erela.js')
const Emojis = require('../../utils/Emojis')
const ClientEmbed = require('../../structures/ClientEmbed')
const ms = require('ms')

module.exports = class NowPlaying extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "nowplaying";
    this.category = "Musica";
    this.description = "Comando para que eu mande as informações da música atual!";
    this.usage = "nowplaying";
    this.aliases = ["np"]

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message, args, prefix, author) {

    const player = message.client.manager.players.get(message.guild.id);

    if (!player)
      return message.reply(`${Emojis.Errado} **|** Não estou em nenhum canal!`);


      
    const Embed = new ClientEmbed(author)
    .setTitle(`Tocando Agora`)
    .setDescription(`${Emojis.CD} **[${player.current.title}](${player.current.uri})**`)
        .addFields(
        {
            name: `${Emojis.Microfone} Autor: \`${player.current.author}\``,
            value: `${Emojis.Engrenagem} **Origem:** ${this.client.utils.titleize(player.current.source.toUpperCase())}`,
            inline: true
        })
        .addField(`${Emojis.Bust} **Pedido por:** \`${player.current.requester.tag}\``, `${Emojis.Tempo} **Duração:** ${ms(player.current.duration)}`, true)
        .setThumbnail(player.current.thumbnailUrl)
    await message.reply({embeds: [Embed]})
    
      }
  }

