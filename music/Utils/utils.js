const { Manager } = require("../Manager");

let payload = {
  op: Number,
  d: String,
};

let NodeOptions = {
  hostname: String,
  password: String,
  port: Number,
  secure: Boolean,
  followRedirects: Boolean,
};

guildId = String;

export class ManagerOptions {
  constructor() {
    /** The array of lavalink nodes */
    this.nodes = NodeOptions;
    /** Function to send voice channel connect payloads to discord */
    this.sendWS = (guildId, payload);
  }
}
