const Command = require("../../structures/Command");
const ClientEmbed = require("../../structures/ClientEmbed");
const Emojis = require("../../utils/Emojis");
const ms = require("ms");

module.exports = class Play extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "play";
    this.category = "Musica";
    this.description = "Comando para tocar música em seu servidor.";
    this.usage = "play <url/name>";
    this.aliases = ["p"];

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message, args, author) {
    try {
      if (
        message.client.manager.players.get(message.guild.id) != null &&
        message.member.voice.channel.id != message.guild.me.voice.channel.id
      ) {
        return message.reply(
          `${Emojis.Errado} **|** Você precisa estar no mesmo canal que eu estou para modificar a fila!`
        );
      }

      if (!message.member.voice.channel)
        return message.reply(
          `${Emojis.Errado} **|** Você precisa estar em um canal!`
        );

      const music = args.join(" ");

      if (!music)
        return message.reply(
          `${Emojis.Errado} **|** Você precisa estar inserir um link/nome de música!`
        );

      const result = await message.client.manager.search(music, message.author);

      if (result.loadType === "LOAD_FAILED")
        return message.reply(
          `${Emojis.Errado} **|** Você precisa estar inserir um link/nome de música!`
        );
      if (result.loadType === "NO_MATCHES")
        return message.reply(
          `${Emojis.Errado} **|** Não encontrei uma música válida!`
        );

      const player = message.client.manager.createPlayer({
        guildId: message.guild.id,
        voiceChannelId: message.member.voice.channel.id,
        textChannelId: message.channel.id,
        selfDeaf: true,
      });

      player.connect();

      if (result.loadType === "PLAYLIST_LOADED") {
        for (const track of result.tracks) {
          player.queue.push(track);
          track.setRequester(message.author);
        }

        if (!player.playing) player.play();

        const embed = new ClientEmbed(message.author)
          .setTitle(`Playlist Adicionada:`)
          .setDescription(`[${result.playlistInfo.name}](${args[0]})`)
          .addFields({
            name: `${Emojis.Tempo} Duração:`,
            value: `${formatTime(
              convertMilliseconds(result.playlistInfo?.duration),
              "hh:mm:ss"
            )}`,
            inline: true,
          });
        message.reply({ embeds: [embed] });
      } else {
        const tracks = result.tracks;
        const msc = tracks[0];
        msc.setRequester(message.author);
        player.queue.push(msc);

        if (message.client.manager.players.get(message.guild.id)) {
          const embed = new ClientEmbed(message.author)
            .setTitle(`Música adicionada:`)
            .setThumbnail(msc.thumbnailUrl)
            .setDescription(
              `**[${msc.title}](${msc.uri})** - [${message.author}]`
            );

          message.reply({ embeds: [embed] });
        }

        if (!player.playing) player.play();
      }
    } catch (err) {
      if (err) console.log(err);
      return message.reply(
        `${Emojis.Errado} **|** Erro ao executar o comando!`
      );
    }

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
  }
};
