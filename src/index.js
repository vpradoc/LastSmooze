const { Client, Collection } = require("discord.js");
const klaw = require("klaw");
const path = require("path");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const { Manager } = require("erela.js");
const Spotify = require("erela.js-spotify");
const Emojis = require('../src/utils/Emojis')

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
  intents: 32767,
  allowedMentions: { parse: ["users", "roles"], repliedUser: true },
});

const clientID = "bb423c23d4084466bd32b10974b2fe83";
const clientSecret = "59d1dee435f74bb4abce8bd9eba08d9f";

client.manager = new Manager({
  nodes: [
    {
        identifier: 'Node 1',
        host: 'smoozelavaa.herokuapp.com',
        port: 80,
        password: "testando",
        retryAmount: 30,
        retryDelay: 3000,
        secure: false
    }
],
  send(id, payload) {
      const guild = client.guilds.cache.get(id);
      if (guild) guild.shard.send(payload);
    },
    plugins: [
      
      new Spotify({
        playlistLimit: undefined,
        albumLimit: undefined,
        clientID,
        clientSecret,
      }),
    ],
  })

  client.lavalinkPings = new Map();


  client.manager.on("trackStart", async (player, track) => {
    const channel = client.channels.cache.get(player.textChannel);
    
    if (player.lastPlayingMsgID) {
      const msg = channel.messages.cache.get(player.lastPlayingMsgID);

      if (msg) msg.delete();
    }

    player.lastPlayingMsgID = await channel
      .send(`${Emojis.CD} | Iniciando **${track.title}**, pedido por \`${track.requester.tag}\`.`)
      .then((x) => x.id);

  });

  client.manager.on("queueEnd", player => {
    const channel = client.channels.cache.get(player.textChannel);
    channel.send(`${Emojis.Certo} » Fila de músicas acabou, saí do canal!`);
    return player.destroy()
  })
////////////////////////////////////////////////////////////////////////////////////////////////////////////
client.manager.on('nodeConnect', (node) => {
  client.lavalinkPings.set(node.identifier, {});
	const sendPing = () => {
		node.send({
			op: 'ping'
		})
	};
	sendPing();
	setInterval(() => {
		sendPing();
	}, 45000);
  console.log(`Lavalink CONECTADO!`)
});


client.on("voiceStateUpdate", (oldState, newState)=> {

  const guild = newState.guild
  const user = newState.member
  const player = client.manager.players.get(guild.id);

  if (
    !newState.channelID &&
    user.id !== client.user.id &&
    player &&
    player.voiceChannel === oldState.channelID
  ) {
    if (oldState.channel.members.filter((c) => !c.user.bot).size === 0) {
      player.pause(true);
  
      client.channels.cache
        .get(player.textChannel)
        .send(`${Emojis.Microfone} » Vou sair do canal em **2 minutos** caso fique sozinho!`)
  
      setTimeout(() => {
        if (!player) return;
  
        if (oldState.channel.members.filter((c) => !c.user.bot).size > 0) return;
  
        player.destroy();
  
        return client.channels.cache
          .get(player.textChannel)
          .send(`${Emojis.Fone} » Saí do canal!`);
      }, 2 * 60000);
    }
  } else if (
    newState.channel &&
    newState.channel.members.filter((c) => !c.user.bot).size === 1 &&
    player &&
    player.voiceChannel === newState.channelID
  ) {
    player.pause(false);
  }
})

client.manager.on('nodeError', (node, error) => {
	if (error && error.message.includes('"pong"')) {
		const lavalinkPing = client.lavalinkPings.get(node.identifier);
		lavalinkPing.ping = Date.now() - lavalinkPing.lastPingSent;
		return;
	}
	console.log(`[Lavalink]: Ocorreu um erro no node ${node.identifier}.\nErro: ${error.message}`);
});

client.manager.on("trackError", (player, track) => {
  const channel = client.channels.cache.get(player.textChannel);
    channel.send(`${Emojis.Errado} » Erro ao colher informações da música **(${track.title})**!`);
    player.stop();
})
//////////////////////////////////////////////////////////////////////////////////////////////////////////// 


const onLoad = async () => {
  klaw("src/commands").on("data", (item) => {
    const cmdFile = path.parse(item.path);
    if (!cmdFile.ext || cmdFile.ext !== ".js") return;
    const response = client.load(cmdFile.dir, `${cmdFile.name}${cmdFile.ext}`);
    if (response) return;
  });

  const eventFiles = await readdir("./src/client/listeningIn/");
  eventFiles.forEach((file) => {
    const eventName = file.split(".")[0];
    const event = new (require(`./client/listeningIn/${file}`))(client);
    client.on(eventName, (...args) => event.run(...args));
    delete require.cache[require.resolve(`./client/listeningIn/${file}`)];
  });


  client.login();
};

onLoad();
