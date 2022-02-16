const moment = require("moment");
const Command = require("../../structures/Command.js");
const Emojis = require("../../utils/Emojis.js");
const ClientEmbed = require("../../structures/ClientEmbed.js");
const Utils = require("../../utils/Util");

module.exports = class Serverinfo extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "serverinfo";
    this.aliases = ["si", "sinfo"];
    this.category = "Informação";
    this.description = "Comando para que eu envie informações de seu servidor!";
    this.usage = "serverinfo";

    this.enabled = true;
    this.guild = true;
  }

  async run(message, args, prefix, author) {
    moment.locale("pt-br");

    const dono = await message.guild.fetchOwner()

      let boost =
        message.guild.premiumSubscriptionCount === 0
          ? "O servidor não conta com Nitro Boost's"
          : `${message.guild.premiumSubscriptionCount} Boost(s) (Nível: ${message.guild.premiumTier.replace("TIER_", "")})`;

      let channels = [
        `Texto: ${
          message.guild.channels.cache.filter((x) => x.type == "text").size
        }`,
        `Voz: ${
          message.guild.channels.cache.filter((x) => x.type == "voice").size
        }`,
      ].join("\n");

      const SERVERINFO = new ClientEmbed(author)
        .setAuthor(
          `${message.guild.name}`,
          message.guild.iconURL({ dynamic: true })
        )
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .addFields(
          {
            name: `**Informações do Servidor**`,
            value: `${Emojis.Coroa} **Dono:**\n<@${
              dono.user.id
            }>\n${Emojis.Id} **Id:**\n${message.guild.id}\n${
              Emojis.Calendario
            } **Data da criação:**\n${moment(message.guild.createdAt).format(
              "L"
            )} (${moment(message.guild.createdAt).startOf("day").fromNow()})\n${
              Emojis.Bolo
            } **Data da minha entrada:**\n${moment(
              message.guild.members.cache.get(message.client.user.id).joinedAt
            ).format("L")} (${moment(
              message.guild.members.cache.get(message.client.user.id).joinedAt
            )
              .startOf("day")
              .fromNow()})\n`,
              inline:true
          },
          {
            name: `**Estrutura do servidor:**`,
            value: `${Emojis.Fone} **Total de Canais:**\n${
              message.guild.channels.cache.size -
              message.guild.channels.cache.filter((x) => x.type == "category")
                .size
            }\n${Emojis.Robo} **Bots:**\n${message.guild.members.cache
              .filter((x) => x.user.bot)
              .size.toLocaleString()}\n${
              Emojis.Boost
            } **Boost's:**\n${boost}\n`,
            inline:true
          }
        )
        .setFooter("Este servidor usa " + Utils.formatBytes(Utils.roughSizeOfObject(message.guild)) + " da minha memoria")

        
          
      if (message.guild.bannerURL !== "null")
        SERVERINFO.setImage(
          message.guild.bannerURL({ dynamic: true, format: "jpg", size: 2048 })
        );

      message.reply({ embeds: [SERVERINFO] });
    } 

}
