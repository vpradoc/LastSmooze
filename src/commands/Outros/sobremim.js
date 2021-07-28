const User = require("../../database/Schemas/User");
const Command = require("../../structures/Command");
const Emojis = require("../../utils/Emojis");

module.exports = class About extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "sobremim";
    this.category = "Outros";
    this.description = "Troque a biografia do seu perfil!";
    this.usage = "sobremim <msg>";
    this.aliases = ["about", "sobre"];

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message, args, prefix, author) {
    const about = args.join(" ");

    User.findOne({ _id: author.id }, async (err, usuario) => {

      if (about === "reset") {
        message.reply(`${Emojis.Certo} » Biografia resetada com sucesso!`);
        await User.findOneAndUpdate(
          { _id: message.author.id },
          { $set: { about: `O Smooze é muito legal! Sabia que usando ${prefix}sobre <msg> você pode mudar essa mensagem?!` } }
        );
      return
      }
      else if (about === "null") {
        return message.reply(`${Emojis.Errado} » Coloque algo válido!`);
      } else if (!about) {
        return message.reply(
          `${Emojis.Errado} » Você não inseriu o que deseja colocar em sua biografia.`
        );
      } else if (about.length > 210) {
        return message.reply(
          `${Emojis.Errado} » A sua biografia deve ter menos de 210 caracteres.`
        );
      } else if (usuario.about == about) {
        return message.reply(
          `${Emojis.Errado} » A biografia que você inseriu é a mesma setada atualmente.`
        );
      } else
        message.reply(`${Emojis.Certo} » Seu sobre foi alterado com sucesso.`);
      await User.findOneAndUpdate(
        { _id: message.author.id },
        { $set: { about: about } }
      );
    });
  }
};
