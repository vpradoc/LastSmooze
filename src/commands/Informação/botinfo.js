const {MessageButton, MessageActionRow} = require("discord.js");
const os = require("os");
const Emojis = require("../../utils/Emojis");
const Command = require("../../structures/Command.js");
const ClientEmbed = require("../../structures/ClientEmbed.js");
const { Uptime } = require("../../utils/Emojis");

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
    const botAvatar = message.client.user.displayAvatarURL({ format: "webp" });
    const date = message.client.user.createdAt;
    const servsize = message.client.guilds.cache.size;
    const dev = message.client.users.cache.get("680943469228982357");
    const uptime = message.client.utils.formatTime(message.client.utils.convertMilliseconds(process.uptime() * 1000))

    const usersize = message.client.guilds.cache
      .map((g) => g.memberCount)
      .reduce((a, g) => a + g)
      .toLocaleString();
    const plat = os
      .platform()
      .replace("linux", "Linux")
      .replace("win32", "Windows");

    const embed = new ClientEmbed(author)
      .setThumbnail(botAvatar)
      .setAuthor(`Smooze`, message.client.user.displayAvatarURL())
      .addFields(
        {
          name: `Informações Básicas`,
          value: `${Emojis.Coroa} **Criador:** **[Splitze](https://github.com/Splitze)** || ${
            dev.tag
          }\n${Emojis.Calendario} **Criação:** \`${message.client.utils.formatDate(
            "DD/MM/YYYY",
            date
          )}\`\n${Emojis.Bust} **Usuários:** \`${usersize}\`\n${
            Emojis.Casa
          } **Servidores**: \`${servsize}\``,
          inline: true,
        },
        {
          name: `Informações Técnicas`,
          value: `${Emojis.Uptime} **Uptime:** ${uptime}\n${
            Emojis.Engrenagem
          } **RAM:** \`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
            2
          )}MB\`\n${Emojis.Linux} **SO:** ${plat}\n${
            Emojis.Heroku
          } **[Hospedagem](https://www.heroku.com/)**`,
          inline: true,
        }
      )

      const row = new MessageActionRow().addComponents(
        new MessageButton()
        .setStyle("LINK")
        .setLabel("Me adicione!")
        .setURL("https://discord.com/oauth2/authorize?client_id=700681803098226778&permissions=20887631278&scope=bot")
      )

    message.reply({ embeds: [embed], components: [row] });
  }
};
