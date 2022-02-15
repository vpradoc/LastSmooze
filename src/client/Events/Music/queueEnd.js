const Emojis = require("../../../utils/Emojis");

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(player) {
    const channel = this.client.channels.cache.get(player.textChannelId);
    player.destroy();
    await channel.send(`A fila de músicas acabou e eu desconectei do canal!`)
  }
};
