const Command = require("../../structures/Command.js");
const Emojis = require("../../utils/Emojis");
const ClientEmbed = require("../../structures/ClientEmbed.js");

module.exports = class RemoveChannel extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "removechannel";
    this.aliases = ["rchannel"];
    this.category = "Moderação";
    this.description = "Comando para que eu delete um canal!";
    this.usage = "removechannel <id/menção>";

    this.enabled = true;
    this.guild = true;
  }

  async run(message, args, prefix, author) {
    if (!message.member.permissions.has("MANAGE_CHANNELS"))
      return message
        .reply(
          `${Emojis.Errado} » Você não tem a permissão de deletar canais (\`MANAGE_GUILD\`)!`
        )
        

    if (!message.guild.me.permissions.has("MANAGE_CHANNELS"))
      return message
        .reply(
          `${Emojis.Errado} » Eu não tenho a permissão de deletar canais (\`MANAGE_GUILD\`)!`
        )
        

    const canal =
      message.mentions.channels.first() ||
      message.guild.channels.cache.get(args[0]);
    const user1 = message.author

    if (!canal)
      return message
        .reply(`${Emojis.Errado} » Por favor, escolha um canal para ser deletado!`)
        .then((m) => m.delete({ timeout: 10000 }));

        const filter = (reaction, user) => {
          return (
            user.id == user1.id && ["855890757873303572", "855890773827518466"].includes(reaction.emoji.id)
          );
        };

    const Embed = new ClientEmbed(author)
      .setTitle(`Você quer mesmo deletar o canal ${canal.name}?`)
      .addField(`**Sim**`, `Emoji: ${Emojis.Certo}`)
      .addField(`**Não**`, `Emoji: ${Emojis.Errado}`);

      message.reply({ embeds: [Embed] }).then(async (msgReact) => {
        for (let emoji of [Emojis.Certo, Emojis.Errado]) await msgReact.react(emoji);
      
        msgReact
          .awaitReactions({ filter: filter, max: 1 })
          .then(async (collected) => {
            if (collected.first().emoji.id === "855890757873303572") {
              msgReact.delete();
              canal.delete();
            message.reply(`${Emojis.Certo} » **\`${canal.name}\`** Deletado com sucesso!`);
            return;

            }
      
            if (collected.first().emoji.id === "855890773827518466") {
              msgReact.delete();
              message.reply(`${Emojis.Certo} » Ação finalizada com sucesso!`);
            }
          });
      })
  }}