const { MessageAttachment, Util } = require("discord.js");
const Emojis = require("../../utils/Emojis");
const Command = require("../../structures/Command.js");
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
const ClientEmbed = require("../../structures/ClientEmbed");

module.exports = class Ship extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "ship";
    this.category = "Diversão";
    this.description = "Comando para calcular se aquele casal daria certo!";
    this.usage = "ship <user>";

    this.enabled = true;
    this.guild = true;
  }

  async run(message, args, prefix, author) {
    const porcentagem = Math.floor(Math.random() * 100);

    const User1 =
      this.client.users.cache.get(args[0]) ||
      message.mentions.users.first() ||
      this.client.user;

    const User2 =
      this.client.users.cache.get(args[1]) ||
      message.mentions.users.array()[1] ||
      message.author;

    const canvas = createCanvas(384, 128);
    const ctx = canvas.getContext("2d");
    //========================// Import Background //========================//

    const background = await loadImage("./src/assets/img/png/ship.png");
    ctx.drawImage(background, 0, 0, 384, 128);

    //========================// Import Coração //========================//

    if (porcentagem >= 90) {
      ctx.textAlign = "left";
      ctx.font = '100px "Segoe UI Black"';
      await Utils.renderEmoji(ctx, Emojis.Anel, 130, 100, 100, 100);
    } else if (porcentagem >= 75) {
      ctx.textAlign = "left";
      ctx.font = '100px "Segoe UI Black"';
      await Utils.renderEmoji(ctx, Emojis.Coração, 130, 100, 100, 100);
    } else if (porcentagem >= 45) {
      ctx.textAlign = "left";
      ctx.font = '100px "Segoe UI Black"';
      await Utils.renderEmoji(ctx, "😏", 130, 100, 100, 100);
    } else if (porcentagem <= 44) {
      ctx.textAlign = "left";
      ctx.font = '100px "Segoe UI Black"';
      await Utils.renderEmoji(ctx, "😭", 130, 100, 100, 100);
    }
    //========================// Import Avatar //========================//

    const avatar = await loadImage(
      User1.displayAvatarURL({ format: "png", size: 2048 })
    );
    ctx.drawImage(avatar, 0, 0, 130, 130);

    const avatar1 = await loadImage(
      User2.displayAvatarURL({ format: "png", size: 2048 })
    );
    ctx.drawImage(avatar1, 255, 0, 130, 130);

    //========================// Create Image //========================//

    const attachment = new MessageAttachment(
      canvas.toBuffer(),
      "SmoozeShip.png"
    );

    var mensagem =
      porcentagem <= 5
        ? `**${porcentagem}%** Infelizmente esse casal é impossivel`
        : porcentagem <= 10
        ? `**${porcentagem}%** Talvez um dia dê certo`
        : porcentagem <= 50
        ? `**${porcentagem}%** Se o ${message.author}, tomasse alguma atitude`
        : porcentagem <= 70
        ? `**${porcentagem}%** Deveriam se casar agora `
        : porcentagem <= 100
        ? `**${porcentagem}%** Casal perfeito, vão ficar juntos para sempre`
        : `Casal perfeito, vão ficar juntos para sempre`;

    const Embed = new ClientEmbed(author)
      .addField(
        `Será que temos um novo casal?`,
        `\`${User1.username}\` + \`${User2.username}\`\n${mensagem}`
      )
      .setImage("attachment://SmoozeShip.png");

    message.reply({ embeds: [Embed], files: [attachment] });
  }
};
