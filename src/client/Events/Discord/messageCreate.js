const Guild = require("../../../database/Schemas/Guild"),
  User = require("../../../database/Schemas/User"),
  Command = require("../../../database/Schemas/Command"),
  ClientS = require("../../../database/Schemas/Client");
const GetMention = (id) => new RegExp(`^<@!?${id}>( |)$`);
const ClientEmbed = require("../../../structures/ClientEmbed");
const moment = require("moment");
const Emojis = require("../../../utils/Emojis");
const coldoown = new Set();

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(message) {
    moment.locale("pt-BR");

    try {
      let server = await Guild.findOne({ _id: message.guild.id });
      let user = await User.findOne({ _id: message.author.id });
      const client = await ClientS.findOne({ _id: this.client.user.id });

      if (message.author.bot == true) return;

      if (!user)
        await User.create({
          _id: message.author.id,
          gay: Math.floor(Math.random() * 100),
        });

      if (!server) {
        await Guild.create({ _id: message.guild.id });
      }
      if (!client)
        await ClientS.create({
          _id: this.client.user.id,
          manutenção: false,
        });

      server = await Guild.findOne({ _id: message.guild.id });

      const prefixMention = new RegExp(`^<@!?${this.client.user.id}> `);
      var prefix = message.content.match(prefixMention)
        ? message.content.match(prefixMention)[0]
        : server.prefix;

      user = await User.findOne({ _id: message.author.id });

      if (user.blacklist) return;

      if (message.content.match(GetMention(this.client.user.id))) {
        message.reply(
          `${Emojis.Ola} | Olá ${message.author}, sou o **Smooze**. Meu prefixo aqui é \`${server.prefix}\`, use **${server.prefix}ajuda** para saber minhas funcionalidades!`
        );
      }

      user = await User.findOne({ _id: message.author.id });

      if (message.content.indexOf(prefix) !== 0) return;
      const author = message.author;
      const args = message.content.slice(prefix.length).trim().split(/ +/g);
      const command = args.shift().toLowerCase();
      const cmd =
        this.client.commands.get(command) ||
        this.client.commands.get(this.client.aliases.get(command));

      if (!cmd) return;
      if (coldoown.has(message.author.id))
        return message.reply(
          `${message.author}, você deve aguardar **5 segundos** para usar outro comando.`
        );

      const comando = await Command.findOne({ _id: cmd.name });

      if (comando) {
        let owners = ["680943469228982357", "600804786492932101"];

        if (!owners.some((x) => x == message.author.id)) {
          if (comando.manutenção)
            return message.reply(
              `${Emojis.Smooze} - O comando **\`${cmd.name}\`** está em manutenção no momento!`
            );

          if (client.manutenção) {
            const embedcmanu = new ClientEmbed(author).setDescription(
              `**${message.author.tag}**, eu me encontro em manutenção no momento.\nPor favor, tente novamente mais tarde!`
            );
            return message.reply({ embeds: [embedcmanu] });
          }
        }

        cmd.run(message, args, prefix, author);
        var num = comando.usages;
        num = num + 1;

        if (
          !["680943469228982357", "600804786492932101"].includes(
            message.author.id
          )
        ) {
          coldoown.add(message.author.id);
          setTimeout(() => {
            coldoown.delete(message.author.id);
          }, 5000);
        }
        await Command.findOneAndUpdate(
          { _id: cmd.name },
          { $set: { usages: num } }
        );
      } else {
        await Command.create({
          _id: cmd.name,
          usages: 1,
          manutenção: false,
        });
        message.reply(
          `${message.author}, por favor utilize o comando novamente!`
        );
        console.log(
          `O comando ${cmd.name} teve seu documento criado com sucesso.`
        );
      }
    } catch (err) {
      if (err) console.error(err);
    }
  }
};
