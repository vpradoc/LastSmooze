const Guild = require("../../../database/Schemas/Guild"),
  User = require("../../../database/Schemas/User"),
  Command = require("../../../database/Schemas/Command"),
  ClientS = require("../../../database/Schemas/Client");
const GetMention = (id) => new RegExp(`^<@!?${id}>( |)$`);
const ClientEmbed = require("../../../structures/ClientEmbed");
const moment = require("moment");
const Emojis = require("../../../utils/Emojis");
const coldoown = new Set();
const Utils = require("../../../utils/Util");

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(message) {
    moment.locale("pt-BR");

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
        const EmbedMention = new ClientEmbed(message.author)
          .setTitle(`${Emojis.Ola} | Olá, sou o **Smooze**.`)
          .setDescription(
            `${Emojis.Toy} **|** Meu prefixo aqui é \`${server.prefix}\`, use **${server.prefix}ajuda** para saber minhas funcionalidades!\n\n${Emojis.Bust} **|** Caso tenha algum outro bot com o mesmo prefixo, você pode usar \`@${this.client.user.username} prefix <prefixo>\` para que o mesmo seja alterado!`
          )
          .setImage(
            `https://cdn.discordapp.com/attachments/693473291158945805/892790061811257344/banner1.png`
          )
          .setFooter(
            `${this.client.user.tag}`,
            this.client.user.displayAvatarURL({ dynamic: true })
          );
        message.reply({ embeds: [EmbedMention] });
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

        const EmbedLOGCMD = new ClientEmbed(author)
          .setTitle(`LOG DE COMANDOS`)
          .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
          .addFields(
            {
              name: `${Emojis.Bust} Usuário:`,
              value: `${message.author.username}`,
            },
            {
              name: `${Emojis.Robo} Comando:`,
              value: `\`${cmd.name} ${args.join(" ")}\``,
            },
            {
              name: `${Emojis.Casa} Servidor:`,
              value: `${message.guild.name}`,
            }
          )
          .setTimestamp()
          .setFooter(`SmoozeBOT - 2021`);
          
          const logc = this.client.channels.cache.get("877968105060573254");

          try {

          await cmd.run(message, args, prefix, author);
          var num = comando.usages;
          num = num + 1;

          }catch(error) {
            Utils.Error(error, logc, message, cmd)
          }


        logc.send({ embeds: [EmbedLOGCMD] });
        /*
        Utils.logger(`COMANDO UTILIZADO:\n\u200b  User: ${message.author.tag} (${message.author.id})\n\u200b  Servidor: ${message.guild} (${message.guild.id})\n\u200b  Comando: ${cmd.name}\n\u200b  Args: ${args.join(" ")}\n`)
   */

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
  }
};
