const Command = require("../../structures/Command.js");
const Emojis = require("../../utils/Emojis");
const ClientEmbed = require("../../structures/ClientEmbed.js");

module.exports = class Emoji extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "emoji";
    this.aliases = ["emojiinfo"];
    this.category = "Informação";
    this.description = "Comando para que eu envie informações de um emoji!";
    this.usage = "emoji <emoji>";

    this.enabled = true;
    this.guild = true;
  }

  async run(message, args, prefix, author) {
    if (!args[0])
      return message.reply(
        `${Emojis.Errado} » Coloque um emoji válido para que eu consiga avaliar!`
      );

    const emoji =
      message.guild.emojis.cache.find(
        (x) => x.id == args[0].replace(/\D/g, "")
      ) || message.guild.emojis.cache.find((x) => x.name === `${args[0]}`);

    if (!emoji)
      return message.reply(
        `${Emojis.Errado} » Coloque um emoji válido para que eu consiga avaliar!`
      );

    const image = emoji.url;
    const IDENTIFICADOR = emoji.identifier;
    const Nome = emoji.name;
    const id = emoji.id;
    const animado = emoji.animated;
    const Tempo = emoji.createdAt;
    const Embed = new ClientEmbed(author)
      .setTitle(`Aqui estão as informações de **${Nome}**`)
      .setThumbnail(image)
      .addField(`${Emojis.Robo} **Nome:**`, `${Nome}`, true)
      .addField(`${Emojis.Id} **ID:**`, `${id}`, true)
      .addField(
        `${Emojis.CD} **É ANIMADO?:**`,
        `${emoji.animated !== true ? `Não` : "Sim"}`,
        false
      )
      .addField(
        `${Emojis.Id} **Identificador:**`,
        `\`<:${IDENTIFICADOR}>\``,
        true
      )
      .addField(
        `${Emojis.Calendario} **Data da criação:**`,
        dateformat("DD/MM/YYYY, às HH:mm:ss", Tempo)
      );

    if (emoji) return message.reply({ embeds: [Embed] });

    function dateformat(template, date) {
      var specs = "YYYY:MM:DD:HH:mm:ss".split(":");
      date = new Date(
        date || Date.now() - new Date().getTimezoneOffset() * 6e4
      );
      return date
        .toISOString()
        .split(/[-:.TZ]/)
        .reduce(function (template, item, i) {
          return template.split(specs[i]).join(item);
        }, template);
    }
  }
};
