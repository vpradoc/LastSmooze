const Command = require("../../structures/Command");
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
const Utils = require("../../utils/Util");

const { MessageAttachment, Util } = require("discord.js");

module.exports = class BobForte extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "bob";
    this.category = "Imagens";
    this.description =
      "A personalidade do Bob muda de acordo com suas escolhas...";
    this.usage = "bob";

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message, args, prefix, author) {
    const USER1 =
      this.client.users.cache.get(args[0]) ||
      message.mentions.users.first() ||
      message.author;

      const filter = (user) => {
        return (
          user.id == USER1.id
        );
      };

    await message.reply(
      "> Qual vai ser o primeiro texto?:\n> Tempo de Resposta:`1 minuto`"
    );

    var txt1 = message.channel.createMessageCollector(
      filter,
      { time: 60000 * 2 }
    );

    txt1.on("collect", async (c) => {
      txt1 = c.content;

      message.reply(
        "> Qual vai ser o segundo texto?:\n> Tempo de Resposta:`1 minuto`"
      );

      var txt2 = message.channel.createMessageCollector(filter, {time: 60000 * 2})

      txt2.on("collect", async (c) => {
        txt2 = c.content;
        
        
        const canvas = createCanvas(901, 602);
        const ctx = canvas.getContext("2d");

        //========================// Import Background //========================//

        const background = await loadImage("./src/assets/img/png/bobforte.png");
        ctx.drawImage(background, 0, 0, 901, 602);

        //========================// Import BreakLines //========================//

        function addBreakLines(str, max) {
          max = max + 1;
          for (let i = 0; i < str.length / max; i++) {
            str =
              str.substring(0, max * i) +
              `\n` +
              str.substring(max * i, str.length);
          }
          return str;
        }

        //========================// Texts //========================//

        // TXT1

        ctx.textAlign = "left";
        ctx.font = '40px "BebasNeue"';
        ctx.fillStyle = "rgb(0, 0, 0)";
        await Utils.renderEmoji(
          ctx,
          addBreakLines(
            txt1.length > 120 ? txt1.slice(0, 117) + "..." : txt1,
            20
          ),
          500,
          5
        );

        // TXT2

        ctx.textAlign = "left";
        ctx.font = '40px "BebasNeue"';
        ctx.fillStyle = "rgb(0, 0, 0)";
        await Utils.renderEmoji(
          ctx,
          addBreakLines(
            txt2.length > 120 ? txt1.slice(0, 117) + "..." : txt2,
            20
          ),
          500,
          300
        );

        //========================// Create Image //========================//

        const attach = new MessageAttachment(
          canvas.toBuffer(),
          `SmoozeBob_.png`
        );

        message.reply(attach);
      });
    });
  }
};
