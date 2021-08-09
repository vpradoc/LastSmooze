const Command = require("../../structures/Command.js");
const Emojis = require("../../utils/Emojis.js");
const path = require("path");
const child = require('child_process')
module.exports = class Shell extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "shell";
    this.category = "Owner";
    this.description = "Executa algo no console!";
    this.usage = "shell <Comando>";

    this.enabled = true;
    this.guild = true;
  }

  async run(message, args, prefix) {
    if (message.author.id !== '680943469228982357') return;
    
    const command = args.join(" ")
    if(!command) {
        return message.reply(`Por favor, insira um comando!`)
    }

    child.exec(command, (err, res) => {
        if(err) return message.reply(`Erro - (${err})`)
        message.reply(
            `:outbox_tray: \`\`\`js\n${res.slice(0, 2000)}\`\`\``)
    })

  }
};
