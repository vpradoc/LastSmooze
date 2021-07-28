const User = require("../../database/Schemas/User");
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

const moment = require("moment");
const Utils = require("../../utils/Util");
const Emojis = require("../../utils/Emojis");

const { MessageAttachment, Util } = require("discord.js");
const { renderEmoji } = require("../../utils/Util");

module.exports = class Profile extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "profile";
    this.category = "Outros";
    this.description = "Veja seu perfil com este comando!";
    this.usage = "profile <@user>";
    this.aliases = ["perfil"];

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message, args, prefix, author) {
    const USER =
      this.client.users.cache.get(args[0]) ||
      message.mentions.users.first() ||
      this.client.users.cache.get(message.author.id);

    let flags;
    if (this.client.users.cache.get(USER.id).flags == null) flags = "";
    else
      flags = this.client.users.cache
        .get(USER.id)
        .flags.toArray()
        .join("-")
        .replace("EARLY_VERIFIED_BOT_DEVELOPER", "<:DEV:797207489178894367>")
        .replace("HOUSE_BRILLIANCE", "<:BrillianceLogo:797207475371507752>")
        .replace("VERIFIED_DEVELOPER", "")
        .replace("HOUSE_BRAVERY", "<:bravery:797207453934026772>")
        .replace("HOUSE_BALANCE", "<:balance:797207441384276008>")
        .replace("EARLY_SUPPORTER", "<:suporter:797207624339685376>")
        .replace("VERIFIED_BOT", "<:Botverificado:797207464402616360>")
        .replace("-", "")
        .replace("-", "");

    User.findOne({ _id: USER.id }, async (err, user) => {
      if (!user) {
        return message.reply(
          `${Emojis.Errado} » Não tenho informações sobre este usuário!`
        );
      }

      if (!USER.presence.activities.find((f) => f.name === "Spotify")) {
        if (!user.marry.has) {
          const canvas = createCanvas(1200, 700);
          const ctx = canvas.getContext("2d");

          //========================// Import Background //========================//

          const background = await loadImage(
            "./src/assets/img/png/profile1.png"
          );
          ctx.drawImage(background, 0, 0, 1200, 700);

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

          // Username

          ctx.textAlign = "left";
          ctx.font = '60px "Segoe UI Black"';
          ctx.fillStyle = "rgb(32, 34, 37)";

          await Utils.renderEmoji(
            ctx,
            USER.username.length > 25
              ? USER.username.slice(0, 25) + "..."
              : USER.username,
            301,
            190
          );

          // Identifier

          ctx.textAlign = "left";
          ctx.font = '55px "Bebas"';
          ctx.fillStyle = "rgb(86, 86, 87)";
          await Utils.renderEmoji(ctx, `#${USER.discriminator}`, 1070, 251);

          // Flags

          ctx.textAlign = "left";
          ctx.font = '45px "Segoe UI Black"';
          await Utils.renderEmoji(
            ctx,
            user.marry.has
              ? Emojis.Anel + flags.replace("-", " ")
              : flags.replace("-", " "),
            301,
            251,
            0,
            0
          );

          // Sobre

          ctx.textAlign = "left";
          ctx.font = '43px "BebasNeue"';
          ctx.fillStyle = "rgb(253, 255, 252)";
          await renderEmoji(
            ctx,

            user.about == "null"
              ? `O Smooze é muito legal! Sabia que usando ${prefix}sobre <msg> você pode mudar essa mensagem?!`
                  .toLowerCase()
                  .match(/.{1,65}/g)
                  .join("\n")
              : user.about
                  .toLowerCase()
                  .match(/.{1,65}/g)
                  .join("\n"),

            110,
            545
          );

          //========================// Import Avatar //========================//

          ctx.arc(166, 130, 120, 0, Math.PI * 2, true);
          (ctx.lineWidth = 23), 5;
          ctx.strokeStyle = "#202225";
          ctx.stroke();
          ctx.closePath();
          ctx.clip();

          const avatar = await loadImage(
            USER.displayAvatarURL({ format: "jpeg", size: 2048 })
          );
          ctx.drawImage(avatar, 45, 8, 250, 250);

          //========================// Create Image //========================//

          const attach = new MessageAttachment(
            canvas.toBuffer(),
            `SmoozeProfile_.png`
          );

          message.reply({ files: [attach] });
        }

        if (user.marry.has) {
          const canvas = createCanvas(1200, 700);
          const ctx = canvas.getContext("2d");

          const casado = this.client.users.cache.get(user.marry.user);

          const avatar1 = await loadImage(
            casado.displayAvatarURL({ format: "png", size: 2048 })
          );
          ctx.drawImage(avatar1, 100, 270, 145, 145);

          //========================// Import Background //========================//

          const background = await loadImage(
            "./src/assets/img/png/profile4.png"
          );
          ctx.drawImage(background, 0, 0, 1200, 700);

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

          // Username

          ctx.textAlign = "left";
          ctx.font = '60px "Segoe UI Black"';
          ctx.fillStyle = "rgb(32, 34, 37)";

          await Utils.renderEmoji(
            ctx,
            USER.username.length > 25
              ? USER.username.slice(0, 25) + "..."
              : USER.username,
            301,
            190
          );

          // Identifier

          ctx.textAlign = "left";
          ctx.font = '55px "Bebas"';
          ctx.fillStyle = "rgb(86, 86, 87)";
          await Utils.renderEmoji(ctx, `#${USER.discriminator}`, 1070, 251);

          // Flags

          ctx.textAlign = "left";
          ctx.font = '35px "Segoe UI Black"';
          await Utils.renderEmoji(
            ctx,
            user.marry.has
              ? Emojis.Anel + flags.replace("-", " ")
              : flags.replace("-", " "),
            290,
            235,
            0,
            0
          );

          //Casado

          ctx.textAlign = "left";
          ctx.font = '35px "BebasNeue"';
          ctx.fillStyle = "rgb(142, 142, 142)";
          await renderEmoji(ctx, `${Emojis.Casamento} Casado com:`, 235, 315);

          // Tag

          ctx.textAlign = "left";
          ctx.font = '35px "Segoe UI Black"';
          ctx.fillStyle = "rgb(142, 142, 142)";
          await Utils.renderEmoji(ctx, `${casado.tag}`, 235, 355);

          // Tempo

          ctx.textAlign = "left";
          ctx.font = '30px "Bebas"';
          ctx.fillStyle = "rgb(255, 255, 255)";
          await Utils.renderEmoji(
            ctx,
            `${moment
              .duration(Date.now() - user.marry.time)
              .format("M [Meses] d [Dias] h [Horas] m [Minutos]")}`,
            235,
            395
          );

          // Sobre

          ctx.textAlign = "left";
          ctx.font = '43px "BebasNeue"';
          ctx.fillStyle = "rgb(253, 255, 252)";
          await renderEmoji(
            ctx,

            user.about == "null"
              ? `O Smooze é muito legal! Sabia que usando ${prefix}sobre <msg> você pode mudar essa mensagem?!`
                  .toLowerCase()
                  .match(/.{1,65}/g)
                  .join("\n")
              : user.about
                  .toLowerCase()
                  .match(/.{1,65}/g)
                  .join("\n"),

            110,
            545
          );

          //========================// Import Avatar //========================//

          ctx.arc(166, 140, 120, 0, Math.PI * 2, true);
          (ctx.lineWidth = 23), 5;
          ctx.strokeStyle = "#202225";
          ctx.stroke();
          ctx.closePath();
          ctx.clip();

          const avatar = await loadImage(
            USER.displayAvatarURL({ format: "jpeg", size: 2048 })
          );
          ctx.drawImage(avatar, 45, 18, 250, 250);

          //========================// Create Image //========================//

          const attach = new MessageAttachment(
            canvas.toBuffer(),
            `SmoozeProfile_.png`
          );

          message.reply({ files: [attach] });
        }
      } //-----------------------------------IF1---------------------------------------------//

      if (USER.presence.activities.find((f) => f.name === "Spotify")) {
        const spotify = USER.presence.activities.find(
          (x) => x.name == "Spotify"
        );

        if (!user.marry.has) {
          const canvas = createCanvas(1200, 700);
          const ctx = canvas.getContext("2d");

          let imagemmsc = await loadImage(spotify.assets.largeImageURL());
          ctx.drawImage(imagemmsc, 100, 280, 130, 130);

          //========================// Import Background //========================//

          const background = await loadImage(
            "./src/assets/img/png/profile2.png"
          );
          ctx.drawImage(background, 0, 0, 1200, 700);

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

          // Username

          ctx.textAlign = "left";
          ctx.font = '60px "Segoe UI Black"';
          ctx.fillStyle = "rgb(32, 34, 37)";

          await Utils.renderEmoji(
            ctx,
            USER.username.length > 25
              ? USER.username.slice(0, 25) + "..."
              : USER.username,
            301,
            190
          );

          // Identifier

          ctx.textAlign = "left";
          ctx.font = '55px "Bebas"';
          ctx.fillStyle = "rgb(86, 86, 87)";
          await Utils.renderEmoji(ctx, `#${USER.discriminator}`, 1070, 251);

          // Flags

          ctx.textAlign = "left";
          ctx.font = '45px "Segoe UI Black"';
          await Utils.renderEmoji(
            ctx,
            user.marry.has
              ? Emojis.Anel + flags.replace("-", " ")
              : flags.replace("-", " "),
            301,
            251,
            0,
            0
          );

          //Spotify

          ctx.textAlign = "left";
          ctx.font = '35px "Bebas"';
          ctx.fillStyle = "rgb(255, 255, 255)";
          await renderEmoji(ctx, `${Emojis.Fone} Spotify:`, 235, 315);

          ctx.textAlign = "left";
          ctx.font = '35px "BebasNeue"';
          ctx.fillStyle = "rgb(255, 255, 255)";
          await renderEmoji(
            ctx,
            `${
              spotify.details.lenght > 25
                ? spotify.details.slice(0, 25) + "..." 
                : spotify.details
            }`,
            235,
            355
          );

          ctx.textAlign = "left";
          ctx.font = '35px "BebasNeue"';
          ctx.fillStyle = "rgb(255, 255, 255)";
          await renderEmoji(
            ctx,
            `${
              spotify.state.lenght > 15
                ? spotify.state.slice(0, 17) + "..."
                : spotify.state
            }`,
            235,
            395
          );

          // Sobre

          ctx.textAlign = "left";
          ctx.font = '43px "BebasNeue"';
          ctx.fillStyle = "rgb(253, 255, 252)";
          await renderEmoji(
            ctx,

            user.about == "null"
              ? `O Smooze é muito legal! Sabia que usando ${prefix}sobre <msg> você pode mudar essa mensagem?!`
                  .toLowerCase()
                  .match(/.{1,65}/g)
                  .join("\n")
              : user.about
                  .toLowerCase()
                  .match(/.{1,65}/g)
                  .join("\n"),

            110,
            545
          );

          //========================// Import Avatar //========================//

          ctx.arc(166, 130, 120, 0, Math.PI * 2, true);
          (ctx.lineWidth = 23), 5;
          ctx.strokeStyle = "#202225";
          ctx.stroke();
          ctx.closePath();
          ctx.clip();

          const avatar = await loadImage(
            USER.displayAvatarURL({ format: "jpeg", size: 2048 })
          );
          ctx.drawImage(avatar, 45, 8, 250, 250);

          //========================// Create Image //========================//

          const attach = new MessageAttachment(
            canvas.toBuffer(),
            `SmoozeProfile_.png`
          );

          message.reply({ files: [attach] });
        }

        if (user.marry.has) {
          const canvas = createCanvas(1200, 700);
          const ctx = canvas.getContext("2d");

          let imagemmsc = await loadImage(spotify.assets.largeImageURL());
          ctx.drawImage(imagemmsc, 110, 292, 110, 117);

          const casado = this.client.users.cache.get(user.marry.user);

          const avatar1 = await loadImage(
            casado.displayAvatarURL({ format: "png", size: 2048 })
          );
          ctx.drawImage(avatar1, 615, 275, 145, 145);

          //========================// Import Background //========================//

          const background = await loadImage(
            "./src/assets/img/png/profile3.png"
          );
          ctx.drawImage(background, 0, 0, 1200, 700);

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

          // Username

          ctx.textAlign = "left";
          ctx.font = '60px "Segoe UI Black"';
          ctx.fillStyle = "rgb(32, 34, 37)";

          await Utils.renderEmoji(
            ctx,
            USER.username.length > 25
              ? USER.username.slice(0, 25) + "..."
              : USER.username,
            301,
            190
          );

          // Identifier

          ctx.textAlign = "left";
          ctx.font = '55px "Bebas"';
          ctx.fillStyle = "rgb(86, 86, 87)";
          await Utils.renderEmoji(ctx, `#${USER.discriminator}`, 1070, 251);

          // Flags

          ctx.textAlign = "left";
          ctx.font = '45px "Segoe UI Black"';
          await Utils.renderEmoji(
            ctx,
            user.marry.has
              ? Emojis.Anel + flags.replace("-", " ")
              : flags.replace("-", " "),
            301,
            251,
            0,
            0
          );

          //Spotify

          ctx.textAlign = "left";
          ctx.font = '35px "Bebas"';
          ctx.fillStyle = "rgb(255, 255, 255)";
          await renderEmoji(ctx, `${Emojis.Fone} Spotify:`, 235, 315);

          ctx.textAlign = "left";
          ctx.font = '35px "BebasNeue"';
          ctx.fillStyle = "rgb(255, 255, 255)";
          await renderEmoji(
            ctx,
            `${
              spotify.details.lenght > 25
                ? spotify.details.slice(0, 25) + "..." 
                : spotify.details
            }`,
            235,
            355
          );

          ctx.textAlign = "left";
          ctx.font = '35px "BebasNeue"';
          ctx.fillStyle = "rgb(255, 255, 255)";
          await renderEmoji(
            ctx,
            `${
              spotify.state.lenght > 15
                ? spotify.state.slice(0, 17) + "..."
                : spotify.state
            }`,
            235,
            395
          );

          //Casamento

          ctx.textAlign = "left";
          ctx.font = '35px "BebasNeue"';
          ctx.fillStyle = "rgb(142, 142, 142)";
          await renderEmoji(ctx, `${Emojis.Casamento} Casado com:`, 770, 315);

          // Tag

          ctx.textAlign = "left";
          ctx.font = '35px "Segoe UI Black"';
          ctx.fillStyle = "rgb(142, 142, 142)";
          await Utils.renderEmoji(
            ctx,
            `${
              casado.username.lenght > 12
                ? casado.username.slice(0, 12) + casado.discriminator
                : casado.username + casado.discriminator
            }`,
            770,
            355
          );

          // Tempo 12

          ctx.textAlign = "left";
          ctx.font = '27px "Bebas"';
          ctx.fillStyle = "rgb(255, 255, 255)";
          await Utils.renderEmoji(
            ctx,
            `${moment
              .duration(Date.now() - user.marry.time)
              .format("M [Meses] d [Dias] h [Horas] m [Minutos]")}`,
            770,
            395
          );

          // Sobre

          ctx.textAlign = "left";
          ctx.font = '43px "BebasNeue"';
          ctx.fillStyle = "rgb(253, 255, 252)";
          await renderEmoji(
            ctx,

            user.about == "null"
              ? `O Smooze é muito legal! Sabia que usando ${prefix}sobre <msg> você pode mudar essa mensagem?!`
                  .toLowerCase()
                  .match(/.{1,65}/g)
                  .join("\n")
              : user.about
                  .toLowerCase()
                  .match(/.{1,65}/g)
                  .join("\n"),

            110,
            545
          );

          //========================// Import Avatar //========================//

          ctx.arc(166, 130, 120, 0, Math.PI * 2, true);
          (ctx.lineWidth = 23), 5;
          ctx.strokeStyle = "#202225";
          ctx.stroke();
          ctx.closePath();
          ctx.clip();

          const avatar = await loadImage(
            USER.displayAvatarURL({ format: "jpeg", size: 2048 })
          );
          ctx.drawImage(avatar, 45, 8, 250, 250);

          //========================// Create Image //========================//

          const attach = new MessageAttachment(
            canvas.toBuffer(),
            `SmoozeProfile_.png`
          );

          message.reply({ files: [attach] });
        }
      }
    });
  }
};
