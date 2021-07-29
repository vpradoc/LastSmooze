const Command = require("../../structures/Command");
const { Manager } = require('erela.js')
const Emojis = require('../../utils/Emojis')
const ClientEmbed = require('../../structures/ClientEmbed')
const ms = require('ms')
module.exports = class Play extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "play";
    this.category = "Musica";
    this.description = "Comando para que eu toque uma música!";
    this.usage = "play <nome/link>";
    this.aliases = ["p"];

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message, args, prefix, author) {

    if(message.guild.me.voice.channel != null) {
    if(message.member.voice.channel.id != message.guild.me.voice.channel.id === true) return message.reply(`${Emojis.Errado} » Você precisa estar no mesmo canal que eu estou para modificar a fila!`)
    }else
    if (!message.member.voice.channel) return message.reply(`${Emojis.Errado} » Você precisa estar em um canal!`)
    if (!args.length) return message.reply(`${Emojis.Errado} » Por favor, coloque algo para que eu pesquise!`);

    const search = args.join(" ");
    let res;


      res = await this.client.manager.search(search, message.author);
      if (res.loadType === "LOAD_FAILED") throw res.exception;
      
    
   
      let player = this.client.manager.players.get(message.guild.id);
      !player
        ? (player = this.client.manager.create({
            guild: message.guild.id,
            voiceChannel: message.member.voice.channel.id,
            textChannel: message.channel.id,
            selfDeafen: true,
          }))
        : (player = player);
  
      if(player.state != "CONNECTED") player.connect();

    if (res.loadType === "PLAYLIST_LOADED") {

     
      const playlist = res.playlist;

        player.connect(); 
        for (const track of res.tracks) player.queue.add(track);
        if (!player.playing) player.play();

        function convertMilliseconds(ms) {
          const seconds = ~~(ms / 1000);
          const minutes = ~~(seconds / 60);
          const hours = ~~(minutes / 60);

          return {
            hours: hours % 24,
            minutes: minutes % 60,
            seconds: seconds % 60,
          };
        }

        function formatTime(time, format, twoDigits = true) {
          const formats = {
            dd: "days",
            hh: "hours",
            mm: "minutes",
            ss: "seconds",
          };

          return format.replace(/dd|hh|mm|ss/g, (match) =>
            time[formats[match]].toString().padStart(twoDigits ? 2 : 0, "0")
          );
        }

        const embed = new ClientEmbed(message.author)
          .setTitle(`${Emojis.CD} Playlist adicionada:`)
          .addField(`${Emojis.Id} Nome:`, "`" + playlist?.name + "`")
          .addFields({name: `${Emojis.Toy} Quantidade:`, value: `${res.tracks.length}`, inline: true},
            {
              name: `${Emojis.Tempo} Duração:`,
              value: `${formatTime(
                convertMilliseconds(res.playlist.duration),
                "hh:mm:ss"
              )}`,
              inline: true,
            }
          )
        message.reply({ embeds: [embed] });

        
      } else {
        const Emojis = require('../../utils/Emojis')
        
      
    player.connect();
    player.queue.add(res.tracks[0]);
    
    if (!player.playing && !player.paused && !player.queue.size) player.play()

    const embed = new ClientEmbed(message.author)
    .setTitle(`${Emojis.CD} Iniciando:`)
    .setThumbnail(res.tracks[0].displayThumbnail("maxresdefault"))
    .setDescription(`**[${res.tracks[0].title}](${res.tracks[0].uri})** - [${author}]\n\n${Emojis.Nada}${Emojis.Id} **Canal:** \`${res.tracks[0].author}\`\n${Emojis.Nada}${Emojis.Tempo} **Duração:** \`${ms(res.tracks[0].duration)}\``)

     message.reply({embeds: [embed]});}
      }
  }

