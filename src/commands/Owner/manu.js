const CommandC = require("../../database/Schemas/Command"),
  ClientS = require("../../database/Schemas/Client");
const Command = require("../../structures/Command");
const Emojis = require("../../utils/Emojis");

module.exports = class Manu extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "manu";
    this.category = "Owner";
    this.description = "Comando para colocar outros comandos em manutenção";
    this.usage = "manu <comando>";

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message, args, prefix, author) {
    if (message.author.id !== "680943469228982357") return;

    let re = args.slice(2).join(" ");

    let reason;
    if (!re) reason = "Não definido";
    else reason = re;

    if (args[0] == "bot") {
      ClientS.findOne({ _id: this.client.user.id }, async (err, cliente) => {
        if (cliente.manutenção) {
          await ClientS.findOneAndUpdate(
            { _id: this.client.user.id },
            { $set: { manutenção: false } }
          );
          return message.reply(
            `${Emojis.Certo} » Fui retirado da manutenção com sucesso.`
          );
        } else {
          message.reply(
            `${Emojis.Certo} » Fui colocado em manutenção com sucesso.`
          );
          await ClientS.findOneAndUpdate(
            { _id: this.client.user.id },
            { $set: { manutenção: true } }
          );
        }
      });

      return;
    }
    if (args[0] == "set") {
      if (!args[1]) {
        return message.reply(
          `${Emojis.Errado} » Insira o nome do comando para prosseguir.`
        );
      }

      const command = args[1].toLowerCase();
      const cmd =
        this.client.commands.get(command) ||
        this.client.commands.get(this.client.aliases.get(command));

      const name = cmd.name;

      CommandC.findOne({ _id: name }, async (err, comando) => {
        if (comando) {
          if (comando.manutenção) {
            await CommandC.findOneAndUpdate(
              { _id: name },
              { $set: { manutenção: false } }
            );
            return message.reply(
              `${Emojis.Certo} » Retirei o comando **\`${name}\`** da manutenção com sucesso.`
            );
          } else {
            await CommandC.findOneAndUpdate(
              { _id: name },
              { $set: { manutenção: true } }
            );
            return message.reply(
              `${Emojis.Certo} » Coloquei o comando **\`${name}\`** em manutenção com sucesso.`
            );
          }
        } else {
          message.reply(
            `${Emojis.Errado} » Não encontrei nenhum comando com o nome **\`${name}\`**.`
          );
        }
      });
    }
  }
};
