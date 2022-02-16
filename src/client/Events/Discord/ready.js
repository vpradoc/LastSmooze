const Utils = require("../../../utils/Util");

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run() {

    this.client.manager.start(this.client.user.id)
    this.client.on("raw", packet => this.client.manager.handleVoiceUpdate(packet));

    Utils.logger(`${this.client.user.username} Iniciou com ${this.client.users.cache.size} Users | ${this.client.guilds.cache.size} Guilds\n`)
   

    setInterval(() => {
      this.client.user.setActivity(`em ${this.client.manager.players.size} servidores! | @Smooze ajuda`, {type: "LISTENING"});    }, 10 * 1000);
    }
};
