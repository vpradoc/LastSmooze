const Emojis = require("../../../utils/Emojis");
const { MessageEmbed } = require("discord.js");
const { Message } = require("discord.js");

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(guild) {
    const logc = this.client.channels.cache.get("877968105060573254");
    const owner = await this.client.users.fetch(guild.ownerId);
    const invite = await guild.channels.cache
      .find((x) => x.type == "GUILD_TEXT")
      .createInvite({ maxAge: 0, maxUses: 0 });

    const Embed = new MessageEmbed()
      .setTitle(`Fui adicionado em um servidor!`)
      .setColor("#008000")
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setDescription(
        `${Emojis.Casa}**  Nome:** ${guild.name}\n${Emojis.Id}**  ID:** \`${guild.id}\`\n${Emojis.Coroa}**  Dono:** ${owner.tag}\n${Emojis.Id}**  Owner ID:** \`${owner.id}\`\n${Emojis.Bust}**  Membros:** ${guild.memberCount}\n**[INVITE](${invite})**`
      );
    logc.send({ embeds: [Embed] });
  }
};
