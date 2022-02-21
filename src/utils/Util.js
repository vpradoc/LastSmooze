const moment = require("moment");
const { appendFileSync, existsSync, mkdirSync } = require("fs");
const ClientEmbed = require("../structures/ClientEmbed");
const Emojis = require("./Emojis");

module.exports = class Util {
  /*
  static logger(toLog) {
    const data = moment(Date.now()).format("D/MM/YYYY | HH:mm:SS");

    if (!existsSync(`./logs`)) mkdirSync(`./logs`);
    appendFileSync(`./logs/log.txt`, `[${data}] ${toLog}\n`);
    return;
  } */

  static formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
  }

  static roughSizeOfObject(object) {
    var objectList = [];
    var stack = [object];
    var bytes = 0;

    while (stack.length) {
      var value = stack.pop();

      if (typeof value === "boolean") {
        bytes += 4;
      } else if (typeof value === "string") {
        bytes += value.length * 2;
      } else if (typeof value === "number") {
        bytes += 8;
      } else if (
        typeof value === "object" &&
        objectList.indexOf(value) === -1
      ) {
        objectList.push(value);

        for (var i in value) {
          stack.push(value[i]);
        }
      }
    }
    return bytes;
  }

  static Error(error, logchannel, messagec, comando) {
    const EmbedError = new ClientEmbed(messagec.author)
      /*.setColor("#EF4565") */

      .setColor("#ff292a")
      .setTitle(`${Emojis.Errado} Erro encontrado!`)
      .setThumbnail(messagec.guild.iconURL({ dynamic: true }))
      .setDescription(
        `${Emojis.Robo} Hey ${messagec.author}, encontrei um erro ao executar o comando que você pediu... Enviei as informações para meu desenvolvedor e em breve o problema será solucionado.\n\n\`Obrigado por usar o BOT!\``
      )
      .setFooter(`SmoozeBOT - 2022`);

    const EmbedError1 = new ClientEmbed(messagec.author)
      /*.setColor("#EF4565") */

      .setColor("#ff292a")
      .setTitle(`${Emojis.Errado} Erro encontrado!`)
      .setThumbnail(messagec.guild.iconURL({ dynamic: true }))
      .setDescription(
        `${Emojis.Id} **Servidor:** ${messagec.guild.name} [${messagec.guild.id}]\n\n${Emojis.Bust} **User:** ${messagec.author.tag} [${messagec.author.id}]\n\n${Emojis.Engrenagem} **Comando:** ${comando.name}\n\n\`\`\`js\n${error}\`\`\``
      )
      .setFooter(`SmoozeBOT - 2022`);

    return (
      messagec.channel.send({ embeds: [EmbedError] }),
      logchannel.send({ embeds: [EmbedError1] }),
      console.log(error)
    );
  }

  static titleize(string, separator = " ") {
    return string
      .split(separator)
      .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
      .join(separator);
  }

  static convertMilliseconds(ms) {
    const seconds = ~~(ms / 1000);
    const minutes = ~~(seconds / 60);
    const hours = ~~(minutes / 60);
    const days = ~~(hours / 24);

    return {
      days,
      hours: hours % 24,
      minutes: minutes % 60,
      seconds: seconds % 60,
    };
  }

  static formatTime(time, format = "dd:hh:mm:ss") {
    const formats = { dd: "days", hh: "hours", mm: "minutes", ss: "seconds" };

    const newFormat = format
      .replace(/dd|hh|mm|ss/g, (match) =>
        time[formats[match]].toString().padStart(2, "0")
      )
      .replace(/^(00:)+/g, "");

    return newFormat.length > 2 ? newFormat : "00:" + newFormat;
  }

  static autoFormatTime(time) {
    return (
      Object.entries(time)
        .filter((e) => e[1])
        .map((e) => [
          e[0].slice(0, -1).padEnd(e[1] > 1 ? e[0].length : 0, "s"),
          e[1],
        ])
        .map((e, i, a) =>
          i === a.length - 1 && a.length > 1
            ? `and ${e[1]} ${e[0]}`
            : i === a.length - 2 || a.length === 1
            ? `${e[1]} ${e[0]}`
            : `${e[1]} ${e[0]},`
        )
        .join(" ") || "0 seconds"
    );
  }

  static formatDate(template, date) {
    var specs = "YYYY:MM:DD:HH:mm:ss".split(":");
    date = new Date(date || Date.now() - new Date().getTimezoneOffset() * 6e4);
    return date
      .toISOString()
      .split(/[-:.TZ]/)
      .reduce(function (template, item, i) {
        return template.split(specs[i]).join(item);
      }, template);
  }
};
