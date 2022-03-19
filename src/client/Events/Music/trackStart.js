const { DiscordAPIError } = require("discord.js");
const Emojis = require("../../../utils/Emojis");
const Discord = require("discord.js")

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(player, track) {
    const channel = this.client.channels.cache.get(player.textChannelId);

    if (player.lastPlayingMsgID) {
      const msg = channel.messages.cache.get(player.lastPlayingMsgID);

      if (msg) msg.delete();
    }

    const Embed = new Discord.MessageEmbed()
    .setDescription(`**[${track.title}](${track.uri})**\n\n${Emojis.CD}** | Origem:** \`${track.author}\`\n${Emojis.Bust}** | Pedido por:** \`${track.requester.tag}\`\n${Emojis.Tempo}** | Duração:** \`${this.client.utils.formatTime(this.client.utils.convertMilliseconds(track.duration))}\``)
    .setThumbnail(track.thumbnailUrl)
    .setColor("#759ffe")

    player.lastPlayingMsgID = await channel
      .send({embeds: [Embed]})
      .then((x) => x.id);
  }
};
