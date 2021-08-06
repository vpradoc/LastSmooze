const Discord = require("discord.js");
emojis = require("../../utils/Emojis");
const Command = require("../../structures/Command.js");
const User = require("../../database/Schemas/User");

module.exports = class Marry extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "casar";
    this.aliases = ["marry"];
    this.category = "Diversão";
    this.description = "Comando para casar com um(a) usuário(a)!";
    this.usage = "marry <user>";

    this.enabled = true;
    this.guild = true;
  }

  async run(message, args, prefix, author) {
    const user1 =
      this.client.users.cache.get(args[0]) || message.mentions.users.first();

    if(user1.id === this.client.user.id) {
      return message.reply(`${emojis.Errado} » Você não pode se casar comigo !`);
    }

    const doc = await User.findOne({
      _id: message.author.id,
    });

    if (doc.marry.has) {
      return message.reply(`${emojis.Errado} » Você já se encontra comprometido(a)!`);
    } else if (!user1) {
      return message.reply(
        `${emojis.Errado} » Você deve escolher um(a) usuário(a) para casar-se!`
      );
    } else if (user1.id === message.author.id) {
      return message.reply(`${emojis.Errado} » Você não pode casar com sí mesmo!`);
    } else if (user1.id === this.client.id) {
      return message.reply(`${emojis.Errado} » Você não pode se casar comigo!`);
    }

    const target = await User.findOne({ _id: user1.id });

    if (target.marry.has)
      return message.reply(
        `${
          emojis.Errado
        } » O(a) membro(a) já está casado(a) com o(a) **\`${taraget.marry.user.then(
          (x) => x.tag
        )}\`**.`
      );

      const filter = (reaction, user) => {
        return (
          user.id == user1.id && ["855890757873303572", "855890773827518466"].includes(reaction.emoji.id)
        );
      };
        message.channel
      .send(
        `${emojis.Anel} » ${user1}, você deseja se casar com o(a) ${message.author}?`
      ).then(async (msgReact) => {
          for (let emoji of [emojis.Certo, emojis.Errado]) await msgReact.react(emoji);
        
          msgReact
            .awaitReactions({ filter: filter, max: 1 })
            .then(async (collected) => {
              if (collected.first().emoji.id === "855890757873303572") {
                message.reply(
                  `${emojis.Anel} » ${message.author}, o(a) ${user1} aceitou seu pedido de casamento, parabéns!`
                );
  
                await User.findOneAndUpdate(
                  { _id: message.author.id },
                  {
                    $set: {
                      "marry.user": user1.id,
                      "marry.has": true,
                      "marry.time": Date.now(),
                    },
                  }
                );
                await User.findOneAndUpdate(
                  { _id: user1.id },
                  {
                    $set: {
                      "marry.user": message.author.id,
                      "marry.has": true,
                      "marry.time": Date.now(),
                    },
                  }
                );
                return msgReact.delete();

              }
        
              if (collected.first().emoji.id === "855890773827518466") {
                msgReact.delete();

              return message.channel.send(
                `${emojis.Flushed} » ${user1}, o(a) recusou seu pedido de casamento!`
              );
              }
            });
        })
        }}
        