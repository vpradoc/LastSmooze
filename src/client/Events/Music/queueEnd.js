const Emojis = require("../../../utils/Emojis");
const Discord = require("discord.js");

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(player) {
    const channel = this.client.channels.cache.get(player.textChannelId);

    const Embed = new Discord.MessageEmbed()
      .setDescription(
        `${Emojis.Ola} | A fila de músicas acabou e eu saí do canal !`
      )
      .setColor("#759ffe");

    player.destroy();
    await channel.send({ embeds: [Embed] });
  }
};
