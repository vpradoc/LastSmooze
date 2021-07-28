emojis = require("../../utils/Emojis");
const { Aki } = require("aki-api");
const discord = require("discord.js");
const akinator = new Set();
const Command = require("../../structures/Command.js");
const Emojis = require("../../utils/Emojis");

module.exports = class Akinator extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "akinator";
    this.aliases = ["aki"];
    this.category = "Diversão";
    this.description = "Comando para jogar uma partida de akinator!";
    this.usage = "akinator";

    this.enabled = true;
    this.guild = true;
  }

  async run(message, args, prefix, author) {
    const emojiimage = [
      emojis.Certo,
      emojis.Errado,
      emojis.Pergunta,
      emojis.Pensando,
      emojis.Nervoso,
      emojis.x,
    ];

    const certo_errado = [
      "866095859267928094",
      "866096308841218099"
    ]

    const emoji_id = [
      "866095859267928094",
      "866096308841218099",
      "866101783202234368",
      "866096843528470538",
      "866097145160400926",
      "867034489137528873",
    ];

    if (akinator.has(message.author.id))
      return message.channel.send(
        `${message.author}, você já tem uma partida em andamento.`
      );

    akinator.add(message.author.id);

    message.channel
      .send(`${emojis.Tempo} » ${message.author}, estou começando sua partida!`)
      .then(async (x) => {
        // ================= Parte para iniciar o Game
        const region = "pt";
        const aki = new Aki(region);
        await aki.start();
        // ================= Parte para iniciar o Game

        const EMBED = new discord.MessageEmbed()
          .setColor(process.env.EMBED_COLOR)
          .setTitle(`${aki.currentStep + 1}ª Pergunta`)
          .setThumbnail(
            "https://i.pinimg.com/originals/83/79/00/83790071419dc35b1e1c2f83a9735117.png"
          )
          .addField(
            aki.question,
            aki.answers.map((x, f) => `${emojiimage[f]} | ${x}`).join("\n")
          )
          .addField(
            `Caso queira cancelar:`,
            `${emojis.X} | Termina sua partida!`
          );

          const filter = (reaction, user) => {
            return (
              emoji_id.includes(reaction.emoji.id) && user.id == message.author.id
            );
          };

        message.reply({ embeds: [EMBED] }).then(async (msg) => {
          x.delete();
          for (const emoji of emoji_id) await msg.react(emoji);
    
          const collector = msg.createReactionCollector({
            filter: filter,
            time: 60000 * 6,
          });

          collector
            .on("end", () => akinator.delete(message.author.id))
            .on("collect", async ({ emoji, users }) => {
              users.remove(message.author).catch(() => null);

              if (emoji.id === "867034489137528873")
                return (
                  msg.delete(),
                  message.reply(`${emojis.Certo} » Partida finalizada!`),
                  await collector.stop()
                );

              await aki.step(emoji_id.indexOf(emoji.id));

              if (aki.progress >= 80 || aki.currentStep >= 78) {
                await aki.win();
                
                msg.delete()
                collector.stop();

                const filter1 = (reaction, user) => {
            return (
              certo_errado.includes(reaction.emoji.id) && user.id == message.author.id
            );
          };

                message.channel.send({embeds: [
                  new discord.MessageEmbed()
                    .setColor(process.env.EMBED_COLOR)
                    .setTitle(`${Emojis.Pergunta} Este é seu Personagem?`)
                    .setDescription(
                      `${Emojis.Id} **Nome:**\n**${aki.answers[0].name}**\n\n${Emojis.Engrenagem} **Profissão:**\n**${aki.answers[0].description}**\n ${Emojis.Toy} **Posição no Ranking (Akinator.com):** \`#${aki.answers[0].ranking}\``
                    )
                    .addField(`${Emojis.Nada}`,`Use ${Emojis.Certo} caso eu tenha acertado e ${Emojis.Errado} caso eu tenha errado.`)
                    .setThumbnail(aki.answers[0].absolute_picture_path)
                    ]}).then(async (msgReact) => {
                      for (let emoji of [emojis.Certo, emojis.Errado]) await msgReact.react(emoji);
                    
                      msgReact
                        .awaitReactions({ filter: filter1, max: 1 })
                        .then(async (collected) => {
                          if (collected.first().emoji.id === "866095859267928094") {
                            msgReact.delete()
                            message.reply(`${emojis.Akinator} » Como eu já sabia, acertei mais uma vez...`)
              
                          }
                    
                          if (collected.first().emoji.id === "866096308841218099") {
                            msgReact.delete();
                            message.reply(`${emojis.Akinator} » Ok, ok você ganhou dessa vez... Nos vemos na próxima!`)
                          }
                        });
                    })

              } else {
                msg.edit({embeds: [
                  new discord.MessageEmbed()
                    .setColor(process.env.EMBED_COLOR)
                    .setTitle(`${aki.currentStep + 1}ª Pergunta`)
                    .setThumbnail(
                      `https://i.pinimg.com/originals/83/79/00/83790071419dc35b1e1c2f83a9735117.png`
                    )
                    .addField(
                      aki.question,
                      aki.answers
                        .map((x, f) => `${emojiimage[f]} | ${x}`)
                        .join("\n")
                    )
                    .addField(
                      `Caso queira cancelar:`,
                      `${emojis.X} | Termina sua partida!`
                    )
                ]});
              }
            });
        });
      });
  }
};
