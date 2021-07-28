const Command = require("../../structures/Command.js");
const User = require("../../database/Schemas/User");
const Emojis = require("../../utils/Emojis.js");
module.exports = class Blacklist extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "blacklist";
    this.category = "Owner";
    this.description = "Comando para adicionar algum usuário na blacklist!";
    this.usage = "blacklist <user>";

    this.enabled = true;
    this.guild = true;
  }

  async run(message, args, prefix) {
    if (message.author.id !== "680943469228982357") return;

    User.findOne({ _id: args[0] }, async (err, user) => {
      if (!user.blacklist) {
        message.reply(
          `${Emojis.Smooze} » O usuário foi adicionado a blacklist com sucesso!`
        );
        await User.findOneAndUpdate(
          { _id: user.id },
          { $set: { blacklist: true } }
        );
      } else if (user.blacklist) {
        message.reply(
          `${Emojis.Smooze} » O usuário foi removido da blacklist com sucesso!`
        );
        await User.findOneAndUpdate(
          { _id: user.id },
          { $set: { blacklist: false } }
        );
      }
    });
  }
};
