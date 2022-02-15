const Command = require("../../structures/Command.js");
const Emojis = require("../../utils/Emojis");
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
    this.guild = true;
  }

  async run(message, args, prefix, author) {

    let TOKEN = ["message.channel.send(this.client.token)", "message.reply(this.client.token)", "message.author.send(this.client.token)", "message.author.reply(this.client.token)"]
    let owners = ["680943469228982357", "600804786492932101"];
    if (!owners.some((x) => x == message.author.id)) return;
    if (!args[0]) return;

    

    let litchdelicia = args.join(" ");
    if (litchdelicia === "process.env") return;
    

    try {
      let litchtotoso = eval(litchdelicia);
      if (typeof litchtotoso !== "string")
      litchtotoso = require("util").inspect(litchtotoso, { depth: 0 });
      
      message.reply(
        `:outbox_tray: \`\`\`js\n${litchtotoso}\`\`\``);
      
    } catch (e) {
      if (e) message.channel.send(`${Emojis.Errado} » ${e}`);
    }
  }
};
