const Command = require("../../structures/Command");
const ClientEmbed = require("../../structures/ClientEmbed");
const moment = require("moment");
const Emojis = require("../../utils/Emojis");
const User = require("../../database/Schemas/User");
require("moment-duration-format");

module.exports = class Wedding extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "casamento";
    this.category = "Outros";
    this.description = "Comando para ver suas informações de casamento.";
    this.usage = "casamento <user>";
    this.aliases = ["wedding"];

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message, args, prefix, author) {
    moment.locale("pt-BR");
    const usuario =
      this.client.users.cache.get(args[0]) ||
      message.mentions.users.first() ||
      message.author;

    const doc = await User.findOne({ _id: usuario.id }, async (err, user1) => {
      if (!user1.marry.has)
        return message.reply(
          `${Emojis.Errado} » Você/o usuário não está casado.`
        );

      const par = await this.client.users.cache.get(user1.marry.user);

      const EMBED = new ClientEmbed(author)
        .setThumbnail(
          usuario.displayAvatarURL({ dynamic: true, format: "jpg", size: 2048 })
        )
        .setDescription(
          `${Emojis.Anel} Informações sobre o casamento do(a) ${usuario}.`
        )
        .addFields(
          {
            name: `${Emojis.Id} **Casado com**`,
            value: `${par.tag} \`( ${par.id} )\``,
          },
          {
            name: `${Emojis.Calendario} **Data do Casamento**`,
            value: `${moment
              .duration(Date.now() - user1.marry.time)
              .format(
                "M [Meses] d [Dias] h [Horas] m [Minutos] s [Segundos]"
              )} \`(${moment(user1.marry.time).format("L LT")})\``,
          }
        );

      message.reply({embeds: [EMBED]});
    });
  }
};
