const c = require("colors")

module.exports = class {
    constructor(client) {
      this.client = client;
    }
  
    async run(node) { 
        console.log(c.blue(`🎧 [LAVALINK] - Conectado!`));
        setInterval(() => {
          node.send({
            op: 'ping'
          });
        }, 45000);
    }}