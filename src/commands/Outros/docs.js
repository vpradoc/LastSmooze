const Command = require("../../structures/Command");
const Emojis = require("../../utils/Emojis");
const Axios = require("axios");

module.exports = class Docs extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "docs";
    this.category = "Outros";
    this.description = "Pesquise algo nas docs do Discord.js!";
    this.usage = "docs <msg>";
    this.aliases = ["djs"];

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message, args, prefix, author) {
    const find = args.join(" ");
    if (!find)
      return message.reply(
        `${Emojis.Errado} » Insira o que você deseja pesquisar antes!`
      );
    const url = `https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(
      find
    )}`;
    Axios.get(url)
      .then((embed) => {
        const { data } = embed;
        if (data && !data.error) {
          message.reply({ embed: data });
        } else {
          message.reply(`${Emojis.Errado} » Esse documento não existe!`);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
};
