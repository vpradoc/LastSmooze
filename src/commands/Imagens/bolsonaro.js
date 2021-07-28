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

const { MessageAttachment, Util } = require("discord.js");

module.exports = class Bolsonaro extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "bolsonaro";
    this.category = "Imagens";
    this.description = "Escolha o que o Bolsonaro vai ver na TV!";
    this.usage = "bolsonaro <@user>";

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message, args, prefix, author) {
    const USER =
      this.client.users.cache.get(args[0]) ||
      message.mentions.users.first() ||
      message.author;

    const canvas = createCanvas(768, 461);
    const ctx = canvas.getContext("2d");

    //========================// Import BreakLines //========================//

    const avatar = await loadImage(
      USER.displayAvatarURL({ format: "png", size: 2048 })
    );
    ctx.drawImage(avatar, 400, 10, 370, 265);

    //========================// Import Background //========================//

    const background = await loadImage("./src/assets/img/png/bolso1.png");
    ctx.drawImage(background, 0, 0, 768, 461);

    //========================// Create Image //========================//

    const attach = new MessageAttachment(
      canvas.toBuffer(),
      `SmoozeBolsonaro_.png`
    );

    message.reply({files: [attach]});
  }
};
