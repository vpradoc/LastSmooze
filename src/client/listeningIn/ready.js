module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run() {

    this.client.manager.init(this.client.user.id);
    this.client.on("raw", d => this.client.manager.updateVoiceState(d));

    const status = [
      {
        type: "WATCHING",
        name: `${this.client.users.cache.size} Usuários! | @Smooze ajuda!`,
      },
      {
        type: "PLAYING",
        name: `${this.client.guilds.cache.size} Servidores! | @Smooze ajuda!`,
      },
      {
        type: "COMPETING",
        name: `${
          this.client.commands.size -
          this.client.commands.filter((x) => x.category == "Owner").size
        } Comandos! | @Smooze ajuda!`,
      },
    ];
    setInterval(() => {
      var randomStatus = status[Math.floor(Math.random() * status.length)];
      this.client.user.setActivity(randomStatus.name, {
        type: randomStatus.type,
      });
    }, 10 * 1000);

    this.client.user.setStatus("dnd");
  }
};
