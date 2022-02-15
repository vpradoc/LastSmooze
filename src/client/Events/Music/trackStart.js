const Emojis = require("../../../utils/Emojis");

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

    player.lastPlayingMsgID = await channel
      .send(`${Emojis.CD} | Iniciando **${track.title}**.`)
      .then((x) => x.id);
  }
};
