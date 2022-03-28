const Command = require("../../structures/Command");
const { getColorsArray } = require("node-album-color")
module.exports = class Test extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "test";
    this.category = "Owner";
    this.description = "Comando para colocar outros comandos em manutenção";
    this.usage = "manu <comando>"
    this.aliases = ["t"]

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message, args, prefix, author) {
    if (message.author.id !== '680943469228982357') return;
    

    console.log(getColorsArray(author.displayAvatarURL()))
  }
};