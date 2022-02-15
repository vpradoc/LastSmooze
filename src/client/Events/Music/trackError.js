const Emojis = require("../../../utils/Emojis");

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(player, track) {
    const channel = client.channels.cache.get(player.textChannel);
    channel.send(
      `${Emojis.Errado} » Erro ao colher informações da música **(${track.title})**!`
    );
    player.stop();
  }
};
