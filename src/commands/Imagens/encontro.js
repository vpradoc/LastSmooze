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

module.exports = class encontro extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "encontro";
    this.category = "Imagens";
    this.description =
      "Escolha o programa ideal para ver durante o encontro!";
    this.usage = "encontro";

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message, args, prefix, author) {
    const USER =
    this.client.users.cache.get(args[0]) ||
    message.mentions.users.first() ||
    message.author;

  const canvas = createCanvas(1012, 857);
  const ctx = canvas.getContext("2d");

  //========================// Import BreakLines //========================//

  const avatar = await loadImage(
    USER.displayAvatarURL({ format: "png", size: 2048 })
  );
  ctx.drawImage(avatar, 77, 190, 315, 215);

  
  const avatar1 = await loadImage(
    USER.displayAvatarURL({ format: "png", size: 2048 })
  );
  ctx.drawImage(avatar1, 840, 100, 315, 215);


  //========================// Import Background //========================//

  const background = await loadImage("./src/assets/img/png/netflix.png");
  ctx.drawImage(background, 0, 0, 1012, 857);

  //========================// Create Image //========================//

  const attach = new MessageAttachment(
    canvas.toBuffer(),
    `SmoozeBolsonaro_.png`
  );

  message.reply({files: [attach]});
}
}
