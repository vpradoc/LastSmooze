const moment = require("moment");
const { appendFileSync, existsSync, mkdirSync } = require("fs");
const ClientEmbed = require("../structures/ClientEmbed")
const Emojis = require("./Emojis")

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

    return messagec.channel.send({embeds: [EmbedError]}), logchannel.send({embeds: [EmbedError1]}), console.log(error)

  }
};
