const Command = require("../../structures/Command");
emojis = require("../../utils/Emojis");
const User = require("../../database/Schemas/User");
module.exports = class Divorce extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "divorce";
    this.category = "Diversão";
    this.description = "Comando para se divorciar!";
    this.usage = "divorce <user>";
    this.aliases = ["divorcio", "divorciar"];

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message, args, prefix, author) {
    const doc = await User.findOne({
      _id: message.author.id,
    });

    if (!doc.marry.has)
      return message.reply(`${emojis.Errado} » Você não está casado!`);

    const par = this.client.users.cache.get(doc.marry.user).tag;

    const filter = (reaction, user) => {
      return (
        user.id == doc.id && ["855890757873303572", "855890773827518466"].includes(reaction.emoji.id)
      );
    };

    message.channel
      .send(`${message.author}, você quer se divorciar do(a) **\`${par}\`**?`)
      .then(async (msgReact) => {
        for (let emoji of [emojis.Certo, emojis.Errado]) await msgReact.react(emoji);
      
        msgReact
          .awaitReactions({ filter: filter, max: 1 })
          .then(async (collected) => {
            if (collected.first().emoji.id === "855890757873303572") {
              message.reply(`${emojis.Certo} » Você se divorciou com sucesso.`);

              await User.findOneAndUpdate(
                { _id: message.author.id },
                {
                  $set: {
                    "marry.user": "null",
                    "marry.has": false,
                    "marry.time": 0,
                  },
                }
              );
              await User.findOneAndUpdate(
                { _id: doc.marry.user },
                {
                  $set: {
                    "marry.user": "null",
                    "marry.has": false,
                    "marry.time": 0,
                  },
                }
              );
              return msgReact.delete();

            }
      
            if (collected.first().emoji.id === "855890773827518466") {
              msgReact.delete();

              return message.reply(`${emojis.Certo} » Divorcio cancelado!`);
            }
          });
      });
  }}