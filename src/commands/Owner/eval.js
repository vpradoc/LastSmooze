const ClientEmbed = require("../../structures/ClientEmbed.js");
const Command = require("../../structures/Command.js");
const Emojis = require("../../utils/Emojis");
const ms = require("ms");
const Discord = require("discord.js");

module.exports = class Eval extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "eval";
    this.category = "Owner";
    this.description = "Comando para que eu avalie algo!";
    this.aliases = ["ev"];
    this.usage = "eval <código>";

    this.enabled = true;
  }

  async run(message, args, prefix, author) {
    if (message.author.id !== "680943469228982357") return;

    const mguild = message.guild;
    const manager = this.client.manager;

    if (!args[0]) return;

    let litchdelicia = args.join(" ");

    const token = "***************************************";

    let security = ["token", "process.env", "TOKEN"];

    const EmbedTK = new Discord.MessageEmbed()
      .setColor(process.env.EMBED_COLOR)
      .setDescription(`:outbox_tray: \`\`\`js\nExpressão Inválida...\`\`\``);

    if (security.some((word) => message.content.includes(word))) {
      return message.reply({ embeds: [EmbedTK] });
    }

    try {
      let litchtotoso = await eval(litchdelicia);
      if (typeof litchtotoso !== "string")
        litchtotoso = require("util").inspect(litchtotoso, { depth: 0 });

      const Embed = new Discord.MessageEmbed()
        .setColor(process.env.EMBED_COLOR)
        .setDescription(`:outbox_tray: \`\`\`js\n${litchtotoso}\`\`\``);

      message.reply({ embeds: [Embed] });
    } catch (e) {
      const EmbedE = new Discord.MessageEmbed()
        .setColor("#ff0000")
        .setDescription(`${Emojis.Errado} \`\`\`js\n${e}\`\`\``);

      if (e) message.reply({ embeds: [EmbedE] });
    }
  }
};
