const moment = require("moment");
require("moment-duration-format");
const discord = require("discord.js");
const os = require("os");
const Emojis = require("../../utils/Emojis");
const Command = require("../../structures/Command.js");
const ClientEmbed = require("../../structures/ClientEmbed.js");

module.exports = class Botinfo extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "botinfo";
    this.aliases = ["binfo", "bi"];
    this.category = "Informação";
    this.description = "Comando para que eu envie as informações do BOT!";
    this.usage = "botinfo";

    this.enabled = true;
    this.guild = true;
  }

  async run(message, args, prefix, author) {

    const botAvatar = message.client.user.displayAvatarURL();
    const date = message.client.user.createdAt;
    const servsize = message.client.guilds.cache.size;
    const dev = message.client.users.cache.get("680943469228982357");
    const uptime = moment
      .duration(process.uptime() * 1000)
      .format("d[d] h[h] m[m] e s[s]");
    const usersize = message.client.guilds.cache
      .map((g) => g.memberCount)
      .reduce((a, g) => a + g)
      .toLocaleString();

    const embed = new ClientEmbed(author)
      .setThumbnail(botAvatar)
      .setAuthor(`Smooze`, message.client.user.displayAvatarURL())
      .addField(
        `**Informações Básicas**`,
        `${Emojis.Coroa} Dono: **[Vinicius](https://github.com/Splitze)** | ${
          dev.tag
        } \n${Emojis.Calendario} Data da criação: **${formatDate(
          "DD/MM/YYYY",
          date
        )}**\n${Emojis.Bust} Usuários: **${usersize}**\n${
          Emojis.Casa
        } Servidores: **${servsize}**`
      )
      .addField(
        `**Informações Técnicas**`,
        `${Emojis.DJs} Livraria: **Discord.Js - v${discord.version.replace(
          "13.0.0-dev.610b0b4.1625357028",
          "13.0.0"
        )}** \n${Emojis.Node} Versão do Node: **[${
          process.version
        }](https://nodejs.org/en/)**\n${
          Emojis.Uptime
        } Tempo online: ${uptime}\n${Emojis.Engrenagem} RAM Usada: **${(
          process.memoryUsage().heapUsed /
          1024 /
          1024
        ).toFixed(2)}MB**\n${Emojis.Wifi} Ping: **${
          message.client.ws.ping
        }ms**\n${
          Emojis.Heroku
        } Hospedagem: **[Heroku](https://www.heroku.com/)**\n${
          Emojis.Linux
        } Sistema Operacional: **Linux**`
      )
      .addField(
        `**Meu Convite**`,
        `**[Me coloque em seu servidor!](https://discord.com/oauth2/authorize?client_id=700681803098226778&permissions=20887631278&scope=bot)**`
      );

    message.reply({ embeds: [embed] });
  }
};

function formatDate(template, date) {
  var specs = "YYYY:MM:DD:HH:mm:ss".split(":");
  date = new Date(date || Date.now() - new Date().getTimezoneOffset() * 6e4);
  return date
    .toISOString()
    .split(/[-:.TZ]/)
    .reduce(function (template, item, i) {
      return template.split(specs[i]).join(item);
    }, template);
}
