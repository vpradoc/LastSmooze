const moment = require("moment");
const Command = require("../../structures/Command.js");
const Emojis = require("../../utils/Emojis.js");
const ClientEmbed = require("../../structures/ClientEmbed.js");

module.exports = class Serverinfo extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "testesi";
    this.aliases = ["si", "sinfo"];
    this.category = "Informação";
    this.description = "Comando para que eu envie informações de seu servidor!";
    this.usage = "serverinfo";

    this.enabled = true;
    this.guild = true;
  }

  async run(message, args, prefix, author) {
    moment.locale("pt-br");
    if (message.author.id !== '680943469228982357') return;
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
       
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setAuthor(message.guild.name)
        .setDescription(`**Informações Gerais:**\n\n${Emojis.Coroa} **Dono(a):** \`${this.client.users.cache.get(message.guild.ownerID).tag}\``)
        .addFields(
          
          {
            name: `${Emojis.Id} **ID:**`,
            value: `\`${message.guild.id}\``, 
            inline: true
          },
          {
              name: `${Emojis.Calendario} **Data da criação:**`,
              value: `${moment(message.guild.createdAt).format("L")} (${moment(message.guild.createdAt).startOf("day").fromNow()})`
          },
          {
            name: `${Emojis.Bolo} **Data da minha entrada:**`,
            value: `${moment(message.guild.members.cache.get(this.client.user.id).joinedAt).format("L")} (${moment(message.guild.members.cache.get(this.client.user.id).joinedAt)
                .startOf("day")
                .fromNow()})\n`,
                inline: true
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
          },
          {
            name: `**Membros:** \`${message.guild.memberCount.toLocaleString()}\``,
            value: `
                  🟢 **Online:** \`${
                    message.guild.members.cache
                      .map((x) => x.presence.status)
                      .filter((x) => x == "online").length
                  }\`\n🟡 **Ausente:** \`${
              message.guild.members.cache
                .map((x) => x.presence.status)
                .filter((x) => x == "idle").length
            }\`\n🔴 **Ocupado:** \`${
              message.guild.members.cache
                .map((x) => x.presence.status)
                .filter((x) => x == "dnd").length
            }\`\n⚫ **Offline:** \`${
              message.guild.members.cache
                .map((x) => x.presence.status)
                .filter((x) => x == "offline").length
            }\``,
          }
        );

      if (message.guild.bannerURL !== "null")
        SERVERINFO.setImage(
          message.guild.bannerURL({ dynamic: true, format: "jpg", size: 2048 })
        );

      message.reply({ embeds: [SERVERINFO] });
    } 

}
