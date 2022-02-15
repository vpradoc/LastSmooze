
module.exports = class {
    constructor(client) {
      this.client = client;
    }
  
    async run(node, err) { 
        console.error(`[Vulkava] Error on node ${node.identifier}`, err.message);
    }}