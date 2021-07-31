const Command = require("../../structures/Command");
const ClientEmbed = require("../../structures/ClientEmbed");
const Emojis = require("../../utils/Emojis");
const ms = require('ms')

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
    const player2 = message.client.manager.players.get(message.guild.id);

    try {
      if (player2) {
        if (
          message.member.voice.channel.id != message.guild.me.voice.channel.id
        )
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

      const result = await this.client.manager.search(music, message.author);

      if (result.loadType === "LOAD_FAILED")
        return message.reply(
          `${Emojis.Errado} **|** Você precisa estar inserir um link/nome de música!`
        );
      if (result.loadType === "NO_MATCHES")
        return message.reply(
          `${Emojis.Errado} **|** Não encontrei uma música válida!`
        );

      message.reply(`${Emojis.Fone} **|** Pesquisando: **\`${music}\`**.`);

      const player = this.client.manager.create({
        guild: message.guild.id,
        voiceChannel: message.member.voice.channel.id,
        textChannel: message.channel.id,
        selfDeafen: true,
      });

      if (player.state === "DISCONNECTED") player.connect();

      if (result.loadType === "PLAYLIST_LOADED") {
        const playlist = result.playlist;

        for (const track of result.tracks) player.queue.add(track);

        if (!player.playing) player.play();

        const embed = new ClientEmbed(message.author)
          .setTitle(`${Emojis.CD} Playlist adicionada:`)
          .addField(`${Emojis.Id} Nome:`, "`" + playlist?.name + "`")
          .addFields(
            {
              name: `${Emojis.Toy} Quantidade:`,
              value: `${result.tracks.length}`,
              inline: true,
            },
            {
              name: `${Emojis.Tempo} Duração:`,
              value: `${formatTime(
                convertMilliseconds(result.playlist.duration),
                "hh:mm:ss"
              )}`,
              inline: true,
            }
          );
        message.reply({ embeds: [embed] });
      } else {
        const tracks = result.tracks;

        player.queue.add(tracks[0]);

        if (player2) {
          const embed = new ClientEmbed(message.author)
            .setTitle(`${Emojis.CD} Iniciando:`)
            .setThumbnail(result.tracks[0].displayThumbnail("maxresdefault"))
            .setDescription(
              `**[${result.tracks[0].title}](${
                result.tracks[0].uri
              })** - [${author}]\n\n${Emojis.Nada}${Emojis.Id} **Canal:** \`${
                result.tracks[0].author
              }\`\n${Emojis.Nada}${Emojis.Tempo} **Duração:** \`${ms(
                result.tracks[0].duration
              )}\``
            );

          message.reply({ embeds: [embed] });
        }

        if (!player.playing) player.play();
      }
    } catch (err) {
      if (err) console.log(err);
      return message.reply(`${Emojis.Errado} **|** Erro ao executar o comando!`);
    }
  
  function convertMilliseconds(ms) {
    const seconds = ~~(ms / 1000);
    const minutes = ~~(seconds / 60);
    const hours = ~~(minutes / 60);

    return { hours: hours % 24, minutes: minutes % 60, seconds: seconds % 60 };
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
  }}
};
