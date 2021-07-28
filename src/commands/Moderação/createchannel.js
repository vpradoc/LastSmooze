const Command = require("../../structures/Command.js");
const Emojis = require("../../utils/Emojis");
const ClientEmbed = require("../../structures/ClientEmbed.js");

module.exports = class CreateChannel extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "createchannel";
    this.aliases = ["cchanel", "criarcanal"];
    this.category = "Moderação";
    this.description = "Comando para que eu crie um canal!";
    this.usage = "createchannel <nome>";

    this.enabled = true;
    this.guild = true;
  }

  async run(message, args, prefix, author) {
    if (!message.member.permissions.has("MANAGE_CHANNELS"))
      return message
        .reply(`${Emojis.Errado} » Você não tem as permissões necessárias para criar canais (\`MANAGE_CHANNELS\`)!`)
        .then((m) => m.delete({ timeout: 10000 }));

    if (!message.guild.me.permissions.has("MANAGE_CHANNELS"))
      return message
        .reply(`${Emojis.Errado} » Eu não tenho as permissões necessárias para criar canais (\`MANAGE_CHANNELS\`)!`)
        .then((m) => m.delete({ timeout: 10000 }));

    const nome = args.join(" ");
    const user1 = message.author

    if (!nome)
      return message
        .reply(`${Emojis.Errado} » Por favor coloque um nome para o canal!`)
        .then((m) => m.delete({ timeout: 10000 }));

        const filter = (reaction, user) => {
          return (
            user.id == user1.id && ["866097525462794250", "866099984611803166"].includes(reaction.emoji.id)
          );
        };

    const Embed = new ClientEmbed(author)
      .setTitle("Escolha um tipo de canal para ser criado!")
      .addField(`**Canal de texto**`, `Emoji: ${Emojis.Balão}`)
      .addField(`**Canal de voz**`, `Emoji: ${Emojis.Microfone}`);

    message.reply({ embeds: [Embed] }).then(async (msgReact) => {
      for (let emoji of [Emojis.Balão, Emojis.Microfone]) await msgReact.react(emoji);
    
      msgReact
        .awaitReactions({ filter: filter, max: 1 })
        .then(async (collected) => {
          if (collected.first().emoji.id === "866097525462794250") {
            msgReact.delete();
            message.guild.channels.create(`${nome}`);
            message.reply(`${Emojis.Certo} » **${nome}** Criado com sucesso!`);
            return;
          }
    
          if (collected.first().emoji.id === "866099984611803166") {
            msgReact.delete();
            message.guild.channels.create(`${nome}`, {
              type: "voice",
            });
            message.reply(`${Emojis.Certo} » **${nome}** Criado com sucesso!`);
          }
        });
    })
  }
};
