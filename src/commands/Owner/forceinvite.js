const Command = require("../../structures/Command.js");
const Emojis = require("../../utils/Emojis");
module.exports = class ForceInvite extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "forceinvite";
    this.category = "Owner";
    this.description = "Comando para que eu crie o invite de uma guild!";
    this.aliases = ["finvite"];
    this.usage = "forceinvite <guild>";

    this.enabled = true;
    this.guild = true;
  }

  async run(message, args, prefix, author) {
    let owners = ["680943469228982357", "600804786492932101"];
    const logc = this.client.channels.cache.get("877968105060573254");
    if (!owners.some((x) => x == message.author.id)) return;
    if (!args[0]) return;

    let guild = message.client.guilds.cache.get(args[0]);

    const invite = await guild.channels.cache
      .find((x) => x.type == "GUILD_TEXT")
      .createInvite({ maxAge: 0, maxUses: 0 });
    logc.send(`<@${author.id}> - **${guild.name} ${invite}**`);
  }
};
