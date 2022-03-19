const WebSocket = require("ws");
const { NodeOptions } = require("./Utils/utils");
const { Manager } = require("./Manager");

class Node {
  constructor() {
    this.manager = Manager;
    this.hostname = NodeOptions.hostname;
    this.password = NodeOptions.password;
    this.port = NodeOptions.port;
    this.secure = NodeOptions.secure;
    this.followRedirects = NodeOptions.followRedirects;
  }

  checkOptions(options) {
    if (!options.password)
      throw new Error(`[ NodeOptions ] - Define a senha ai mano`);
    if (!options.hostname)
      throw new Error(`[ NodeOptions ] - Define o hostname ai mano`);
    if (!options.port)
      throw new Error(`[ NodeOptions ] - Define a porta ai mano`);
    if (!options.secure)
      throw new Error(`[ NodeOptions ] - Define o secure ai mano`);
    if (!options.followRedirects)
      throw new TypeError(`[ NodeOptions ] - Define o followRedirects ai mano`);

    if (!typeof options.port == "Boolean")
      throw new Error(`[ NodeOptions ] - A porta não é um number`);
    if (!typeof options.secure == "Number")
      throw new Error(`[ NodeOptions ] - O secure não é um boolean`);
  }
}

async (manager, options) => {
  this.manager = manager;
  this.options = options;

  Node.checkOptions(this.options);

  const headers = {
    Authorization: this.password,
    "Session-Id": this.manager.sessionId,
  };

  const ws = new WebSocket(
    `ws${this.secure ? "s" : ""}://${this.hostname}:${this.port}`,
    {
      headers,
      followRedirects: this.options.followRedirects,
    }
  );
};
