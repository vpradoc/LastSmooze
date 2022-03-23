const Emojis = require("../../../utils/Emojis");
const { MessageEmbed } = require("discord.js");

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(guild) {
    const owner = await guild.fetchOwner();

    const Embed = new MessageEmbed()
      .setTitle(`Fui removido de um servidor!`)
      .setColor("#FF0000")
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setDescription(
        `${Emojis.Casa}**  Nome:** ${guild.name}\n${Emojis.Id}**  ID:** \`${guild.id}\`\n${Emojis.Coroa}**  Dono:** ${owner.tag}\n${Emojis.Id}**  Owner ID:** \`${owner.id}\`\n${Emojis.Bust}**  Membros:** ${guild.memberCount}`
      );

    const canal = this.client.channels.cache.get("877968105060573254");

    canal.send({ embeds: [Embed] });
  }
};
