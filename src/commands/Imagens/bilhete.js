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

module.exports = class Bilhete extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "bilhete";
    this.category = "Imagens";
    this.description = "Quando teu amigo de escola te manda a cola errada...";
    this.usage = "bilhete <@user>";
    this.aliases = ["cola"];

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message, args, prefix, author) {
    const USER =
      this.client.users.cache.get(args[0]) ||
      message.mentions.users.first() ||
      message.author;

    const canvas = createCanvas(400, 378);
    const ctx = canvas.getContext("2d");

    //========================// Import BreakLines //========================//

    const avatar = await loadImage(
      USER.displayAvatarURL({ format: "png", size: 2048 })
    );
    ctx.drawImage(avatar, 182, 215, 145, 105);

    //========================// Import Background //========================//

    const background = await loadImage("./src/assets/img/png/bilhete.png");
    ctx.drawImage(background, 0, 0, 400, 378);

    //========================// Create Image //========================//

    const attach = new MessageAttachment(
      canvas.toBuffer(),
      `SmoozeProfile_.png`
    );

    message.reply({files: [attach]});
  }
};
