const Discord = require("discord.js");
const Command = require("../../structures/Command.js");
const Emojis = require("../../utils/Emojis");

module.exports = class Ban extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "ban";
    this.category = "Moderação";
    this.description = "Comando para banir um(a) membro(a)!";
    this.usage = "ban <user>";

    this.enabled = true;
    this.guild = true;
  }

  async run(message, args, prefix, author) {
    if (message.deletable) message.delete();

    if (!message.member.permissions.has("BAN_MEMBERS")) {
      return message.reply(`${Emojis.Errado} » Você não tem as permissões necessárias (\`BAN_MEMBERS\`)!`)
    }

    //Se não houver uma pessoa para tomar o BAN!
    const Banido = message.guild.member(
      this.client.users.cache.get(args[0]) || message.mentions.members.first()
    );

    if (!Banido) {
      return message.channel.send(
        `${Emojis.Errado} » ${message.author}, por favor coloque alguém para que eu aplique o ban!`
      );
    }

    if(Banido.id === this.client.user.id) {
      return message.reply(`${Emojis.Errado} » Eu não posso me banir!`)
    }

    //Membro não encontrado!
    if (!Banido) {
      return message.channel.send(
        `${Emojis.Errado} » ${message.author}, por favor coloque um(a) usuário(a) válido para que eu aplique o ban!`
      );
    }

    //A pessoa não pode banir ela mesma!
    if (message.author.id === Banido.id) {
      return message.channel.send(
        `${Emojis.Errado} » ${message.author}, você não pode aplicar o ban em sí mesmo!`
      );
    }

    //O Bot não pode banir este membro!
    if (!Banido.kickable) {
      return message.channel.send(
        `${Emojis.Errado} » ${message.author}, eu não tenho permissão de banir este membro!`
      );
    }

    const Motivo = args[1];

    if (!Motivo) {
      return message.channel.send(
        `${Emojis.Errado} » ${message.author}, coloque um motivo para o ban!`
      );
    }

    message.channel
      .send(
        `${Emojis.Certo} » ${message.author}, gostaria mesmo de banir o membro **${Banido}**, com o motivo \`${Motivo}\`?\nPara banir de forma silenciosa, basta reagir com ${Emojis.SoundOff}`
      )
      .then(async (msg) => {
        await msg.react(Emojis.Certo);
        await msg.react(Emojis.Errado);
        await msg.react(Emojis.SoundOff);

        const Embedban = new Discord.MessageEmbed()
          .setColor(process.env.EMBED_COLOR)
          .setThumbnail(message.guild.iconURL({ dynamic: true }))
          .setFooter(
            `Pedido por ${message.author.username}`,
            message.author.displayAvatarURL({ dynamic: true })
          )
          .setTimestamp()
          .setTitle(Banido.username)
          .setDescription(`**FOI BANIDO COM SUCESSO!**`)
          .addField(`>**Motivo:**`, Motivo)
          .addField(`>**Autor:**`, message.author.username);

        const Embedbanido = new Discord.MessageEmbed()
          .setColor(process.env.EMBED_COLOR)
          .setThumbnail(message.guild.iconURL({ dynamic: true }))
          .setTimestamp()
          .setTitle(Banido.username)
          .setDescription(`**Você foi banido do servidor!**`)
          .addField(`>**Motivo:**`, Motivo)
          .addField(`>**Autor:**`, message.author.username);

        const filter = (reaction, user) =>
          (reaction.emoji.id === `855890757873303572` ||
            reaction.emoji.id === `855890773827518466` ||
            reaction.emoji.id === `857764132827430942`) &&
          user.id === message.author.id;
        msg.awaitReactions(filter, { max: 1 }).then((collected) => {
          collected.map((emoji) => {
            switch (emoji._emoji.id) {
              case "855890757873303572":
                msg.delete();
                Banido.ban(Motivo);
                message.reply({ embeds: [Embedban] });
                Banido.send({ embeds: [Embedbanido] });
                return;
              case "855890773827518466":
                msg.delete();
                return message.channel.send(
                  `${Emojis.Certo} » ${message.author}, o ban foi cancelado com sucesso!`
                );

              case "857764132827430942":
                msg.delete();
                Banido.Ban(Motivo);
                Banido.send({ embeds: [Embedbanido] });
                return;
            }
          });
        });
      });
  }
};
