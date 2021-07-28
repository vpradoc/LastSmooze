const malScraper = require("mal-scraper");
const moment = require("moment");
const Command = require("../../structures/Command.js");
const ClientEmbed = require("../../structures/ClientEmbed.js");
const Emojis = require('../../utils/Emojis')
module.exports = class Anime extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "anime";
    this.category = "Outros";
    this.description = "Comando para que eu envie informações de um anime!";
    this.usage = "anime <nome>";

    this.enabled = true;
    this.guild = true;
  }

  async run(message, args, prefix, author) {
    const search = args.join(" ");

    if (!search)
      return message.reply(
        `${Emojis.Errado} » Insira o nome do anime que deseja pesquisar.`
      );

    const data = await malScraper.getInfoFromName(search);

    const date = data.aired.split(" to ").map((x) => x.replace(",", ""));

    const ANIME = new ClientEmbed(author)
      .setDescription(`**[${data.title}](${data.url})**`)
      .setThumbnail(data.picture)
      .addFields(
        {
          name: `Episódios`,
          value: data.episodes.toLocaleString().replace("Unknown", "Em Produção"),
          inline: true,
        },
        {
          name: `Tipo do Anime`,
          value: data.type,
          inline: true,
        },
        {
          name: `Rank do Anime`,
          value: data.ranked,
          inline: true,
        },
        {
          name: `Popularidade do Anime`,
          value: data.popularity,
          inline: true,
        },
        {
          name: `Status do Anime`,
          value: data.status
            .replace("Finished Airing", "Finalizado")
            .replace("Currently Airing", "Finalizado"),
          inline: true,
        },
        {
          name: `Categoria do Anime`,
          value: data.source.replace("Manga", "Mangá"),
          inline: true,
        },
        {
          name: `Informações sobre Lançamento`,
          value:
            date[1] == "?" || !date[1]
              ? `**${moment(new Date(date[0])).format("L")}**`
              : `**${moment(new Date(date[0])).format("L")}** - **${moment(
                  new Date(date[1])
                ).format("L")}**`,
          inline: true,
        },
        {
          name: `Duração por Episódio`,
          value: data.duration.replace(". per ep", ""),
          inline: true,
        },
        {
          name: `Gêneros do Anime`,
          value: data.genres.map((x) => x).join(", "),
          inline: false,
        },
        {
          name: `Avaliação do Anime`,
          value: data.score,
          inline: true,
        }
      );

    if (data.trailer != undefined)
      ANIME.addField(
        `Trailer do Anime`,
        `**[Clique Aqui](${data.trailer})**`,
        true
      );

    message.reply({ embeds: [ANIME] }).catch((err) => {
      console.log(err);
      return message.reply(`${Emojis.Errado} » Anime não encontrado.`);
    });
  }
};
