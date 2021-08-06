const Command = require("../../structures/Command.js");
const Emojis = require("../../utils/Emojis");
const Guild = require("../../database/Schemas/Guild");
const User = require('../../database/Schemas/User.js')
module.exports = class Eval extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "dbset";
    this.category = "Owner";
    this.description = "Comando para que eu modifique um valor na database!";
    this.usage = "dbset";

    this.enabled = true;
    this.guild = true;
  }

  async run(message, args, prefix, author) {

    Guild.findOne({ _id: message.guild.id }, async (err, server) => {
    User.findOne({ _id: args[0] }, async (err, user) => {

        let owners = ["680943469228982357", "600804786492932101"];
        if (!owners.some((x) => x == message.author.id)) return;
        if (!args[0]) return;


        if(!args[0]) return message.reply(`${Emojis.Errado} » Por favor, coloque um parâmetro!`)
        if(!args[1]) return message.reply(`${Emojis.Errado} » Por favor, coloque um id!`)
        if(!args[2]) return message.reply(`${Emojis.Errado} » Por favor, coloque um valor!`)

        if(args[0] === 'gay') {
            message.reply(`${Emojis.Certo} » Valor modificado para \`${args[2]}\`!`)
        await User.findOneAndUpdate({ _id: args[1]  }, {$set: {'gay': args[2]}})
        }

        if(args[0] === 'marry.has') {
          message.reply(`${Emojis.Certo} » Valor modificado para \`${args[2]}\`!`)
      await User.findOneAndUpdate({ _id: args[1]  }, {$set: {'marry.has': args[2]}})
      }

      if(args[0] === 'marry.time') {
        message.reply(`${Emojis.Certo} » Valor modificado para \`${args[2]}\`!`)
    await User.findOneAndUpdate({ _id: args[1]  }, {$set: {'marry.time': args[2]}})
    }

    if(args[0] === 'marry.user') {
      message.reply(`${Emojis.Certo} » Valor modificado para \`${args[2]}\`!`)
  await User.findOneAndUpdate({ _id: args[1]  }, {$set: {'marry.user': args[2]}})
  }
  if(args[0] === 'prefix') {
    message.reply(`${Emojis.Certo} » Valor modificado para \`${args[2]}\`!`)
  await Guild.findOneAndUpdate({ _id: args[1]  }, {$set: {'prefix': args[2]}})
  }
    })
  })}
};
