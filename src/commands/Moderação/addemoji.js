const Command = require("../../structures/Command.js");
const Emojis = require("../../utils/Emojis");
const ClientEmbed = require("../../structures/ClientEmbed");

module.exports = class AddEmoji extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "addemoji";
    this.category = "Moderação";
    this.description = "Comando para que eu adicione um emoji ao servidor!";
    this.usage = "addemoji <link>";

    this.enabled = true;
    this.guild = true;
  }

  async run(message, args, prefix, author) {

    const user1 = message.author

    if (!message.member.permissions.has('MANAGE_EMOJIS'))
      return message.reply(
        `${Emojis.Errado} » Você não tem as permissões necessárias (\`MANAGE_EMOJIS\`) para adicionar emojis!`
      );

    if (!message.guild.me.permissions.has('MANAGE_EMOJIS'))
      return message.reply(
        `${Emojis.Errado} » Eu não tenho as permissões necessárias (\`MANAGE_EMOJIS\`) para adicionar emojis!`
      );

    const link = args[0];

    if (!link)
      return message.reply(
        `${Emojis.Errado} » Por favor, coloque o **link** de um emoji para ser adicionado!`
      );

    function itsALink(Text) {
      var res = Text.match(
        /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
      );
      if (res == null) return false;
      else return true;
    }

    if (!itsALink(link)) {
      return message.reply(
        `${Emojis.Errado} » Por favor, coloque um link válido!`
      );
    }

    await message.reply(
      "> Escreva o nome do emoji abaixo:\n> Tempo de Resposta:`1 minuto`"
    );

    const filter = (user) => {
      return (
        user.id == user1.id
      );
    };

    var nome = message.channel.createMessageCollector(
      filter, {time: 60000 * 2}
    );

    try{
    nome.on("collect", async (c) => {
      nome = c.content;

      message.guild.emojis.create(link, nome).then((added) => {
        const embed = new ClientEmbed(author).setTitle(
          `Emoji adicionado! <:${added.name}:${added.id}>`
        );

        message.reply({ embeds: [embed] });
      });
    })
  }catch (error) {
    if (error) message.reply(`${Emojis.Errado} » A imagem deve ter no máximo **256KB**!`);
  }}
};
