const { Client, Collection } = require("discord.js");
const klaw = require("klaw");
const path = require("path");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const { Vulkava } = require("vulkava");
const Util = require("./utils/Util")

class Main extends Client {
  constructor(options) {
    super(options);
    this.commands = new Collection();
    this.aliases = new Collection();
  }

  login(token) {
    token = process.env.TOKEN;
    return super.login(token);
  }

  load(commandPath, commandName) {
    const props = new (require(`${commandPath}/${commandName}`))(this);
    props.location = commandPath;
    if (props.init) {
      props.init(this);
    }
    this.commands.set(props.name, props);
    props.aliases.forEach((aliases) => {
      this.aliases.set(aliases, props.name);
    });
    return false;
  }
}

const dbIndex = require("./database/index.js");
dbIndex.start();

const client = new Main({
  intents: 641,
  allowedMentions: { parse: ["users", "roles"], repliedUser: true },
});

client.manager = new Vulkava({
  nodes: [
    {
      id: "Smooze 1",
      hostname: "smoozelava.herokuapp.com",
      port: 80,
      password: "vpc1",
    },
  ],
  sendWS: (guildId, payload) => {
    client.guilds.cache.get(guildId)?.shard.send(payload);
  },
});

client.utils = Util 

const onLoad = async () => {
  klaw("src/commands").on("data", (item) => {
    const cmdFile = path.parse(item.path);
    if (!cmdFile.ext || cmdFile.ext !== ".js") return;
    const response = client.load(cmdFile.dir, `${cmdFile.name}${cmdFile.ext}`);
    if (response) return;
  });

  const discordEvents = await readdir("./src/client/Events/Discord");
  discordEvents.forEach((file) => {
    const eventName = file.split(".")[0];
    const event = new (require(`./client/Events/Discord/${file}`))(client);
    client.on(eventName, (...args) => event.run(...args));
    delete require.cache[require.resolve(`./client/Events/Discord/${file}`)];
  });

  const processEvents = await readdir("./src/client/Events/Process");
  processEvents.forEach((file) => {
    const eventName = file.split(".")[0];
    const event = new (require(`./client/Events/Process/${file}`))(client);
    process.on(eventName, (...args) => event.run(...args));
    delete require.cache[require.resolve(`./client/Events/Process/${file}`)];
  });

  const musicEvents = await readdir("./src/client/Events/Music");
  musicEvents.forEach((file) => {
    const eventName = file.split(".")[0];
    const event = new (require(`./client/Events/Music/${file}`))(client);
    client.manager.on(eventName, (...args) => event.run(...args));
    delete require.cache[require.resolve(`./client/Events/Music/${file}`)];
  });

  client.login();
};

onLoad();

module.exports = {
  Util: require("./utils/index.js"),
};
