const moment = require("moment");
const Command = require("../../structures/Command.js");
const Emojis = require("../../utils/Emojis");
const ClientEmbed = require("../../structures/ClientEmbed.js");
const { PNGStream } = require("canvas");

module.exports = class Userinfo extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "userinfo";
    this.aliases = ["uinfo", "ui"];
    this.category = "Informação";
    this.description = "Comando para que eu envie suas informações técnicas!";
    this.usage = "userinfo <id/menção>";

    this.enabled = true;
    this.guild = true;
  }

  async run(message, args, prefix, author) {
    moment.locale("pt-BR");

    const user =
      message.guild.members.cache.get(args[0]) ||
      message.mentions.members.first() ||
      message.guild.members.cache.get(message.author.id)
    
    function Device(user) {
      if (!user.presence.clientStatus) return null;
      let devices = Object.keys(user.presence.clientStatus);

      let deviceList = devices.map((x) => {
        if (x === "desktop") return "COMPUTADOR";
        else if (x === "mobile") return "CELULAR";
        else return "MÁQUINA";
      });

      return deviceList.join(" - ");
    }
    const device = Device(user);

    let flags;
    if (this.client.users.cache.get(user.id).flags == null) flags = "";
    else
      flags = this.client.users.cache
        .get(user.id)
        .flags.toArray()
        .join("-")
        .replace("EARLY_VERIFIED_BOT_DEVELOPER", "<:DEV:797207489178894367>")
        .replace("HOUSE_BRILLIANCE", "<:BrillianceLogo:797207475371507752>")
        .replace("VERIFIED_DEVELOPER", "")
        .replace("HOUSE_BRAVERY", "<:bravery:797207453934026772>")
        .replace("HOUSE_BALANCE", "<:balance:797207441384276008>")
        .replace("EARLY_SUPPORTER", "<:suporter:797207624339685376>")
        .replace("VERIFIED_BOT", "<:Botverificado:797207464402616360>")
        .replace("-", " ")
        .replace(" - ", " ");


        const bannerHash = (await this.client.api.users[user.id].get()).banner;

    
      const banner = !bannerHash ? `null` : `https://cdn.discordapp.com/banners/${
      user.id
    }/${bannerHash}${bannerHash.startsWith("a_") ? ".gif" : ".png"}?size=4096`; 


    const ROLES = user.roles.cache
      .filter((r) => r.id !== message.guild.id)
      .map((roles) => roles);

    let roles;
    if (!ROLES.length) roles = "Nenhum cargo no servidor!";
    else
      roles =
        ROLES.length > 10
          ? ROLES.map((r) => r)
              .slice(0, 10)
              .join(", ") + `**e mais ${Number(ROLES.length - 10)} cargos!**`
          : ROLES.map((r) => r).join(", ");

    let presence;
    if (!user.presence.activities.length) presence = "Não está jogando nada";
    else presence = user.presence.activities.join(", ");

    const joined = `${moment(user.joinedAt).format("L")} ( ${moment(
      user.joinedAt
    )
      .startOf("day")
      .fromNow()} )`;

    const created = `${moment(
      this.client.users.cache.get(user.id).createdAt
    ).format("L")} ( ${moment(this.client.users.cache.get(user.id).createdAt)
      .startOf("day")
      .fromNow()} )`;

    const USERINFO = new ClientEmbed(author)
      .addFields(
        {
          name: `${
            message.guild.owner === user
              ? `${Emojis.Coroa} ${flags.replace("-", " ")}${
                  user.user.username
                }`
              : `${flags} ${user.user.username}`
          }\n**Informações Pessoais:**`,
          value: `**${Emojis.Bust} Tag:**\n\`${user.user.tag}\`\n**${Emojis.Id} Id:**\n\`${user.user.id}\`\n**${Emojis.Calendario} Criação da conta:**\n${created}\n`,
        },
        {
          name: `**Informações do Status:**`,
          value: `**${Emojis.Dado} Jogando:**\n\`${presence}\`\n**${
            Emojis.Device
          } Dispositivo:**\n${device}\n**${Emojis.Robo} É um BOT?:**\n${
            user.user.bot ? "Sim" : "Não"
          }\n`,
        },
        {
          name: `**Informações no Servidor:**`,
          value: `**${Emojis.Bolo} Entrada no Servidor:**\n${joined}\n**${Emojis.Id} Cargos:**\n${roles}\n`,
        }
      )
      .setThumbnail(user.user.displayAvatarURL({format:'png', size: 2048, dynamic: true }));
      if(banner != 'null') {
        USERINFO.setImage(banner)
      }
    message.reply({ embeds: [USERINFO] });
  }
};
