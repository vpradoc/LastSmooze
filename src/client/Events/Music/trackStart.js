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
    .setDescription(`${Emojis.CD} | [${track.title}](${track.uri}) - [<@${track.requester.id}>]`)
    .setColor("#759ffe")

    player.lastPlayingMsgID = await channel
      .send({embeds: [Embed]})
      .then((x) => x.id);
  }
};
