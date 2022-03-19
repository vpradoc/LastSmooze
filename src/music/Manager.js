const { EventEmitter } = require("ws");

const { ManagerOptions, payload } = require("./Utils/utils");

const { Node } = require("./Node");

class Manager extends ManagerOptions {
  constructor() {
    super();

    this.sessionId = String;
    this.guildId = String;
    this.payload = payload;
    this.nodes = [];
    this.node = Node;
    this.sendWS = (this.guildId, this.payload);
    this.players = new Map();

    for (const nodeOp of this.nodes) {
      const node = new Node(this, nodeOp);
      this.nodes.push(node);
    }
  }
  start(clientId) {
    if (typeof clientId !== "string") {
      throw new Error("clientId must be a string");
    }

    this.clientId = clientId;

    for (const node of this.nodes) {
      return node.connect();
    }
  }
}

module.exports = {
  Manager,
};
