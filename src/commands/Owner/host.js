const moment = require("moment");
const os = require("os");
const Command = require("../../structures/Command.js");
const Emojis = require("../../utils/Emojis");
const ClientEmbed = require("../../structures/ClientEmbed.js");
const { version } = require("moment");
const Guild = require('../../database/Schemas/Guild')

module.exports = class Host extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "host";
    this.category = "Owner";
    this.description =
      "Comando para que eu envie informações sobre a hospedagem!";
    this.usage = "host";

    this.enabled = true;
    this.guild = true;
  }

  async run(message, args, prefix, author) {
    if (message.author.id !== "680943469228982357") return;

    const startDB = process.hrtime();
    await Guild
      .findOne({ _id: message.guild.id })
      .then((x) => x.prefix);
    const stopDB = process.hrtime(startDB);
    const pingdb = Math.round((stopDB[0] * 1e9 + stopDB[1]) / 1e6) + "ms";

    const nome = os.hostname

    const uptime = moment
      .duration(this.client.uptime)
      .format("h [horas] m [minutos] e s [segundos]")
      .replace("minsutos", "minutos");

    const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
      2
    )
    const SO = os.platform
    const version = os.release
    const ping = this.client.ws.ping + "ms"

    const Embed = new ClientEmbed(author)
      .setTitle(`${Emojis.Toy} Dados da Operação:`)
      .setThumbnail(`${this.client.user.displayAvatarURL({size: 2048})}`)
      .setDescription(`${Emojis.Id} **ID DO SISTEMA:**\n\`${nome}\`\n${Emojis.Uptime} **TEMPO DE FUNCIONAMENTO:**\n${uptime}\n${Emojis.Engrenagem} **RAM USADA:**\n\`${ram}\`\n${Emojis.Linux} **SISTEMA OPERACIONAL:**\n\`${SO} v${version}\`\n${Emojis.Wifi} **PING:**\n\`${ping}\`\n\n${Emojis.DB} **DATABASE:**\n${Emojis.Dado} **PING:**\n\`${pingdb}\``)
    message.reply({ embeds: [Embed] });
  }
};
