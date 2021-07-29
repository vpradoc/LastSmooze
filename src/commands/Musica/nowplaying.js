const Command = require("../../structures/Command");
const { Manager } = require('erela.js')
const Emojis = require('../../utils/Emojis')
const ClientEmbed = require('../../structures/ClientEmbed')
const ms = require('ms')
const { loadImage, registerFont, createCanvas } = require("canvas");
registerFont("src/assets/fonts/Montserrat-Black.ttf", { family: "Montserrat" });
registerFont("src/assets/fonts/Bebas-Regular.ttf", { family: "Bebas" });
registerFont("src/assets/fonts/BebasNeue-Regular.ttf", { family: "BebasNeue" });
registerFont("src/assets/fonts/Segoe Print.ttf", { family: "Segoe Print" });
registerFont("src/assets/fonts/Segoe UI.ttf", { family: "Segoe UI" });
registerFont("src/assets/fonts/arial.ttf", { family: "Arial" });
registerFont("src/assets/fonts/Segoe UI Black.ttf", {
  family: "Segoe UI Black",
});

const { MessageAttachment, Util } = require("discord.js");

module.exports = class NowPlaying extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "nowplaying";
    this.category = "Musica";
    this.description = "Comando para que eu mande as informações da música que está sendo tocada!";
    this.usage = "nowplaying";
    this.aliases = ["np"]

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message, args, prefix, author) {

    const player = message.client.manager.get(message.guild.id);

    if (!player) return message.reply(`${Emojis.Errado} » Não estou em nenhum canal!`);

    const canvas = createCanvas(700, 1000);
    const ctx = canvas.getContext("2d");
    const trackimg = await loadImage(player.queue.current.displayThumbnail("maxresdefault"))
    const name = player.queue.current.title
    const autor = player.queue.current.author
    //========================// Import BreakLines //========================//

    ctx.drawImage(trackimg, 52, 100, 600, 550);

    //========================// Import Background //========================//

    const background = await loadImage("./src/assets/img/png/NP.png");
    ctx.drawImage(background, 0, 0, 700, 1000);

    //========================// Linhas //========================//

    // MSC

    ctx.textAlign = "left";
    ctx.font = '60px "Bebas"';
    ctx.fillStyle = "rgb(88, 101, 242)";
    ctx.fillText(`${name.slice(0, 20) + "..."}`, 60, 710);

    // Autor

    ctx.textAlign = "left";
    ctx.font = '50px "Bebas"';
    ctx.fillStyle = "rgb(105, 105, 105)";
    ctx.fillText(`${autor.slice(0, 18)+"..."}`, 60, 769);

    const attach = new MessageAttachment(
        canvas.toBuffer(),
        `np.png`
      );

      message.reply({files: [attach]});
      
      }
  }

