const Command = require("../../structures/Command.js");
const Emojis = require("../../utils/Emojis.js");
const path = require("path");
const fetch = require("node-fetch");
const ClientEmbed = require("../../structures/ClientEmbed.js");
const ms = require("ms");

module.exports = class LavaStats extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "lavastats";
    this.category = "Owner";
    this.description = "Informações sobre o lavalink!";
    this.usage = "lavastats";
    this.aliases = ["ls"];
    this.enabled = true;
    this.guild = true;
  }

  async run(message, args, prefix, author) {
    if (message.author.id !== "680943469228982357") return;

    const node = this.client.manager.nodes.filter(
      (x) => x.stats.uptime != 0
    )[0];

    let startLL;

    if (node.options.id === "Smooze 1") {
      startLL = process.hrtime();
      await fetch(`smoozelava.herokuapp.com/version`, {
        headers: { Authorization: "vpc1" },
      });
    } else startLL = process.hrtime();
    await fetch(`smoozelava2.herokuapp.com/version`, {
      headers: { Authorization: "vpc1" },
    });

    const stopLL = process.hrtime(startLL);

    const LavaLinkPing = Math.round((stopLL[0] * 1e9 + stopLL[1]) / 1e6);

    const EMBED = new ClientEmbed(author)
      .setTitle(`${Emojis.CD} Lavalink Status:`)
      .addFields(
        {
          name: `${Emojis.Id} Nome:`,
          value: `${node.options.id}`,
        },
        {
          name: `${Emojis.Device} Players Conectados:`,
          value: `${node.stats.players}`,
        },
        {
          name: `${Emojis.Uptime} Uptime:`,
          value: `${ms(node.stats.uptime)}`,
        },
        {
          name: `${Emojis.Engrenagem} CPU:`,
          value: `**Cores:** ${node.stats.cpu.cores}\n**Lavalink:** ${~~(
            node.stats.cpu.lavalinkLoad * 100
          )}%\n**System:** ${~~(node.stats.cpu.systemLoad * 100)}%`,
        },
        {
          name: `${Emojis.DB} RAM:`,
          value: `${(node.stats.memory.used / 1024 / 1024).toFixed(0)}MB`,
        },
        {
          name: `${Emojis.Wifi} Ping:`,
          value: `${LavaLinkPing}ms`,
        }
      );

    message.reply({ embeds: [EMBED] });
  }
};
