const Guild = require("../../database/Schemas/Guild");
const Command = require("../../structures/Command.js");
const Emojis = require("../../utils/Emojis");
const ClientEmbed = require("../../structures/ClientEmbed");

module.exports = class Help extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "help";
    this.aliases = ["ajuda", "comandos"];
    this.category = "Informação";
    this.description = "Comando para que eu envie minha lista de utilidades!";
    this.usage = "help";

    this.enabled = true;
    this.guild = true;
  }

  async run(message, args, prefix, author) {
    Guild.findOne({ _id: message.guild.id }, async (err, server) => {
      const data = [];
      const Musica = [];
      const Config = [];
      const Informação = [];
      const { commands } = message.client;

      if (args[0]) {
        const name = args[0].toLowerCase();
        const command =
          commands.get(name) ||
          commands.find((c) => c.aliases && c.aliases.includes(name));

        if (!command) {
          return message.reply(
            `${Emojis.Errado} » Não encontrei nenhum comando com o nome \`${name}\``
          );
        }

        const EMBED1 = new ClientEmbed(author)
          .setTitle(`Informações sobre o comando:`)
          .setThumbnail(this.client.user.displayAvatarURL({ size: 2048 }))
          .addFields(
            {
              name: "**Nome do Comando**",
              value: command.name,
            },
            {
              name: "**Aliases**",
              value: `\`${command.aliases}\``,
            },
            {
              name: "**Descrição:**",
              value: command.description,
            },
            {
              name: "**Como usar**",
              value: `${server.prefix}${command.usage}`,
            }
          );

        message.reply({ embeds: [EMBED1] });
      } else {
        const HELP = new ClientEmbed(author).setAuthor(
          `Olá, sou o Smooze!`,
          this.client.user.displayAvatarURL()
        );
        const ownerc = this.client.commands.filter(
          (x) => x.category == "Owner"
        ).size;
        HELP.setDescription(
          `Posso executar vários comandos para fazer com que meus usuários se sintam a vontade em seus servidores. No momento eu conto com \`${
            this.client.commands.size - ownerc
          }\` funcionalidades.\n\nPara saber mais sobre algum dos comandos listados abaixo, utilize **${
            server.prefix
          }help <comando>**! \n\n`
        );
        commands.map((command) => {
          if (command.category === "Config") Config.push(command.name);
          else if (command.category === "Musica") Musica.push(command.name);
          else if (command.category === "Informação")
            Informação.push(command.name);
        });

        HELP.addFields(
          {
            name: `${Emojis.Engrenagem} [${
              this.client.commands.filter((x) => x.category == "Config").size
            }] | **Configuração » **`,
            value: `\`${Config.map((x) => `${x}`).join(" - ")}\``,
          },
          {
            name: `${Emojis.Disco} [${
              this.client.commands.filter((x) => x.category == "Musica").size
            }] | **Musica » **`,
            value: `\`${Musica.map((x) => `${x}`).join(" - ")}\``,
          },
          {
            name: `${Emojis.Id} [${
              this.client.commands.filter((x) => x.category == "Informação")
                .size
            }] | **Informação » **`,
            value: `\`${Informação.map((x) => `${x}`).join(" - ")}\``,
          }
        ).setImage(
          `https://cdn.discordapp.com/attachments/693473291158945805/869225851990986882/standard.gif`
        );

        await message.reply({ embeds: [HELP] });
      }
    });
  }
};
