const Command = require("../../structures/Command");
const WebSocket = require("ws");
const { listenerCount } = require("ws");

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
    

    const ws = new WebSocket("ws://lavaedit.herokuapp.com", {
  headers: {
    Authorization: "vpc1",
  }});

  ws.on('open', () => {
      console.log('Conectou')
  })

  ws.send({
      op: 'destroy',
  })
  }
};