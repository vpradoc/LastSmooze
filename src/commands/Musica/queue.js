const Command = require("../../structures/Command");
const Emojis = require("../../utils/Emojis");
const ClientEmbed = require("../../structures/ClientEmbed");
const ms = require("ms");
const { MessageButton, MessageActionRow, Collection } = require("discord.js");

module.exports = class Queue extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "queue";
    this.category = "Musica";
    this.description = "Comando para que receber a lista de músicas!";
    this.usage = "queue";
    this.aliases = ["q"];

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message, args, prefix, author) {

    const player = message.client.manager.players.get(message.guild.id);

    if (!player) {
      return message.reply(
        `${Emojis.Errado} **|** Não estou tocando músicas neste servidor...`
      );
    }

    const getSongDetails = (pos, pos2) => {
      const data = [];

      for (; pos <= pos2 && player.queue[pos]; pos++) {
        const duration = player.queue[pos].duration;
        const title = player.queue[pos].title;
        const uri = player.queue[pos].uri;
        data.push(
          `\`${pos + 1}\` - [${shorten(title, 25)}](${uri})  [${formatTime(
            convertMilliseconds(duration),
            "hh:mm:ss"
          )}]`
        );
      }
      return data.join("\n");
    };
    


    const embed = new ClientEmbed(author);

    embed.setDescription(`**Tocando agora: [${player.current.title}](${
      player.current.uri
    })**\n\n${getSongDetails(0, 5)}`
  );


    message.reply({
      embeds: [embed]
    });

    function shorten(text, size) {
      if (typeof text !== "string") return "";
      if (text.length <= size) return text;
      return text.substr(0, size).trim() + "...";
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
