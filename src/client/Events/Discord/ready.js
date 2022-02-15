module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run() {

    this.client.manager.start(this.client.user.id)
    this.client.on("raw", packet => this.client.manager.handleVoiceUpdate(packet));



    setInterval(() => {
      this.client.user.setActivity(`em ${this.client.manager.players.size} servidores! | @Smooze ajuda`, {type: "LISTENING"});    }, 10 * 1000);
    }
};
