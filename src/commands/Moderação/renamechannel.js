const Command = require("../../structures/Command.js");
const Emojis = require("../../utils/Emojis");
module.exports = class RenameChannel extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "renamechannel";
    this.category = "Moderação";
    this.description = "Comando para que eu renomeie um canal!";
    this.usage = "renamechannel <id/menção>";

    this.enabled = true;
    this.guild = true;
  }

  async run(message, args, prefix, author) {

    const user1 = message.author

    if (!message.member.permissions.has("MANAGE_CHANNELS"))
      return message.reply(
        `${Emojis.Errado} » Você não tem as permissões necessárias para **RENOMEAR** canais!`
      );

    if (!message.guild.me.permissions.has("MANAGE_CHANNELS"))
      return message.reply(
        `${Emojis.Errado} » Eu não tenho as permissões necessárias para **RENOMEAR** canais!`
      );

    const canal =
      message.mentions.channels.first() ||
      message.guild.channels.cache.get(args[0]);

    if (!canal)
      return message.reply(
        `${Emojis.Errado} » Por favor, coloque o **ID/NOME** de um canal para ser renomeado!`
      );


    const nome = args.slice(1).join(' ')
    if(!nome) {
    return message.reply(`${Emojis.Errado} » Por favor, escolha o nome do canal!`)
    }
      canal.setName(nome);

      await message.reply(`${Emojis.Certo} » Canal renomeado com sucesso!`)
    }}
    