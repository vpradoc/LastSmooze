const Emojis = require("../../utils/Emojis");
const Guild = require("../../database/Schemas/Guild");
const Command = require("../../structures/Command.js");
const ClientEmbed = require("../../structures/ClientEmbed.js");

module.exports = class Entrada extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "entrada";
    this.aliases = ["welcome"];
    this.category = "Config";
    this.description =
      "Comando para configurar a mensagem de entrada de um usuário!";
    this.usage = "entrada";

    this.enabled = true;
    this.guild = true;
  }

  async run(message, args, prefix, author) {
    if (!message.member.permissions.has("MANAGE_GUILD"))
      return message.reply(
        `${Emojis.Errado} » Você precisa da permissão \`MANAGE_GUILD\` para executar o comando!`
      );

    Guild.findOne({ _id: message.guild.id }, async (err, server) => {
      if (args[0] == "canal") {
        let canal =
          message.mentions.channels.first() ||
          message.guild.channels.cache.find((x) => x.id == args[1]);

        if (!canal) {
          return message.reply(
            `${Emojis.Errado} » Por favor escolha um canal para que seja setado o sistema!`
          );
        } else if (canal.id === server.entrada.channel) {
          return message.reply(
            `${Emojis.Errado} » O canal escolhido já está em uso!`
          );
        } else {
          message.reply(
            `${Emojis.Certo} » O canal **<#${canal.id}>** receberá as mensagens de entrada apartir de agora!`
          );
          await Guild.findOneAndUpdate(
            { _id: message.guild.id },
            { $set: { "entrada.channel": canal.id } }
          );
        }
        return;
      }

      if (args[0] == "set") {
        const tipo = args[1];

        const options = ["mensagem", "embed", "card"];

        if (!options.some((x) => x === tipo.toLowerCase())) {
          return message.reply(
            `${Emojis.Errado} » Por favor escolha um tipo de mensagem válido **<embed/mensagem/card>**!`
          );
        } else if (!tipo) {
          return message.reply(
            `${Emojis.Errado} » Por favor escolha um tipo de mensagem **<embed/mensagem/card>**.`
          );
        } else if (tipo === server.entrada.modelo) {
          return message.reply(
            `${Emojis.Errado} » O tipo de mensagem escolhido já está em uso!`
          );
        } else {
          message.reply(
            `${Emojis.Certo} » Agora as mensagens de entrada serão no formato ${tipo}!`
          );
          await Guild.findOneAndUpdate(
            { _id: message.guild.id },
            { $set: { "entrada.modelo": tipo } }
          );
        }
        if (tipo === "embed") {
          const embedconfig = new ClientEmbed(author)
            .setTitle(`Configuração da Embed`)
            .addField(
              `Os utilitários do \`${server.prefix}entrada help\` podem ser aplicados!`,
              `**${server.prefix}entrada avatar** - Adiciona o avatar do membro na embed\n**${server.prefix}entrada titulo** - Muda o título da embed\n**${server.prefix}entrada description** - Define uma mensagem para a embed\n**${server.prefix}entrada imagem** - Define uma imagem para a embed!`
            );
          return message.reply({ embeds: [embedconfig] });
        }
        return;
      }

      if (args[0] == "msg") {
        let msg = args.slice(1).join(" ");

        if (!msg) {
          return message.reply(
            `${Emojis.Errado} » Você não inseriu nenhuma mensagem!`
          );
        } else if (msg.lenght > 100) {
          return message.chennel.send(
            `${Emojis.Errado} » A mensagem escolhida é muito grande! O limite é de 100 caracteres.`
          );
        } else if (msg === server.entrada.msg) {
          return message.reply(
            `${Emojis.Errado} » A mensagem escolhida já está em uso!`
          );
        } else {
          message.reply(
            `${Emojis.Certo} » A mensagem foi alterada para \`\`\`diff\n- ${msg}\`\`\``
          );
          await Guild.findOneAndUpdate(
            { _id: message.guild.id },
            { $set: { "entrada.msg": msg } }
          );
        }

        return;
      }

      if (args[0] == "imagem") {
        const imagem = args[1];

        if (server.entrada.modelo !== "embed") {
          return message.reply(
            `${Emojis.Errado} » O sistema de entrada deve estar em formato \`embed\`!`
          );
        } else if (imagem === server.entrada.embedimage) {
          return message.reply(
            `${Emojis.Errado} » A imagem escolhida já se encontra em uso!`
          );
        } else {
          message.reply(`${Emojis.Certo} » Imagem definida com sucesso!`);
          await Guild.findOneAndUpdate(
            { _id: message.guild.id },
            { $set: { "entrada.embedimage": imagem } }
          );
        }
        return;
      }

      if (args[0] == "avatar") {
        if (server.entrada.modelo !== "embed") {
          return message.reply(
            `${Emojis.Errado} » O sistema de entrada deve estar em formato \`embed\`!`
          );
        } else if (server.entrada.embedavatar) {
          return message.reply(
            `${Emojis.Errado} » O sistema já se encontra ativo!`
          );
        } else {
          message.reply(`${Emojis.Certo} » O sistema foi ativado com sucesso!`);
          await Guild.findOneAndUpdate(
            { _id: message.guild.id },
            { $set: { "entrada.embedavatar": true } }
          );
        }
        return;
      }
      if (args[0] == "titulo") {
        if (server.entrada.modelo !== "embed") {
          return message.reply(
            `${Emojis.Errado} » O sistema de entrada deve estar em formato \`embed\`!`
          );
        }
        let titulo = args.slice(1).join(" ");

        if (!titulo) {
          return message.reply(
            `${Emojis.Errado} » Você não inseriu nenhuma mensagem!`
          );
        } else if (titulo.lenght > 30) {
          return message.chennel.send(
            `${Emojis.Errado} » A mensagem escolhida é muito grande! O limite é de 30 caracteres.`
          );
        } else if (titulo === server.entrada.embedtitulo) {
          return message.reply(
            `${Emojis.Errado} » A mensagem escolhida já está em uso!`
          );
        } else {
          message.reply(
            `${Emojis.Certo} » A mensagem foi alterada para \`\`\`diff\n- ${titulo}\`\`\``
          );
          await Guild.findOneAndUpdate(
            { _id: message.guild.id },
            { $set: { "entrada.embedtitulo": titulo } }
          );
        }
        return;
      }

      if (args[0] == "description") {
        if (server.entrada.modelo !== "embed") {
          return message.reply(
            `${Emojis.Errado} » O sistema de entrada deve estar em formato \`embed\`!`
          );
        }
        let descrição = args.slice(1).join(" ");

        if (!descrição) {
          return message.reply(
            `${Emojis.Errado} » Você não inseriu nenhuma mensagem!`
          );
        } else if (descrição.lenght > 100) {
          return message.chennel.send(
            `${Emojis.Errado} » A mensagem escolhida é muito grande! O limite é de 100 caracteres.`
          );
        } else if (descrição === server.entrada.embeddescription) {
          return message.reply(
            `${Emojis.Errado} » A mensagem escolhida já está em uso!`
          );
        } else {
          message.reply(
            `${Emojis.Certo} » A mensagem foi alterada para \`\`\`diff\n- ${descrição}\`\`\``
          );
          await Guild.findOneAndUpdate(
            { _id: message.guild.id },
            { $set: { "entrada.embeddescription": descrição } }
          );
        }
        return;
      }

      if (args[0] == "msg") {
        let msg = args.slice(1).join(" ");

        if (!msg) {
          return message.reply(
            `${Emojis.Errado} » Você não inseriu nenhuma mensagem!`
          );
        } else if (msg.lenght > 100) {
          return message.chennel.send(
            `${Emojis.Errado} » A mensagem escolhida é muito grande! O limite é de 100 caracteres.`
          );
        } else if (msg === server.entrada.msg) {
          return message.reply(
            `${Emojis.Errado} » A mensagem escolhida já está em uso!`
          );
        } else {
          message.reply(
            `${Emojis.Certo} » A mensagem foi alterada para \`\`\`diff\n- ${msg}\`\`\``
          );
          await Guild.findOneAndUpdate(
            { _id: message.guild.id },
            { $set: { "entrada.msg": msg } }
          );
        }

        return;
      }

      if (args[0] == "on") {
        if (server.entrada.status) {
          message.reply(`${Emojis.Errado} » O sistema já está ativado!`);
        } else {
          message.reply(
            `${Emojis.Certo} » O sistema foi \`ativado\` com sucesso!`
          );
          await Guild.findOneAndUpdate(
            { _id: message.guild.id },
            { $set: { "entrada.status": true } }
          );
        }

        return;
      }

      if (args[0] == "off") {
        if (!server.entrada.status) {
          message.reply(`${Emojis.Errado} » O sistema já está desativado!`);
        } else {
          message.reply(
            `${Emojis.Certo} » O sistema foi \`desativado\` com sucesso!`
          );
          await Guild.findOneAndUpdate(
            { _id: message.guild.id },
            { $set: { "entrada.status": false } }
          );
        }

        return;
      }

      if (args[0] == "help") {
        let INFO = new ClientEmbed(author)
          .setColor(process.env.EMBED_COLOR)
          .setDescription(
            `Mensagem Definida: \`${server.entrada.msg.replace(
              "null",
              "Nenhuma"
            )}\``
          )
          .addField(
            `${Emojis.Toy} » Informações pré-definidas:`,
            `\`\`\`{member} » Menciona o usuário\n{name} » Nome do usuário\n{total} » Total de membros do servidor\n{guild} » Nome do servidor\n{quebra} » Quebra a linha\`\`\``
          )
          .addField(
            `Estrutura:`,
            `${
              Emojis.Fone
            } » Canal Escolhido: <#${server.entrada.channel.replace(
              "null",
              "Nenhum"
            )}>\n${Emojis.Pergunta} » Status: ${
              server.entrada.status ? "ativado" : "desativado"
            }\n${Emojis.Texto} » Tipo: ${server.entrada.modelo.replace(
              "null",
              "Nenhum"
            )}`
          )
          .setFooter(
            `Pedido por: ${message.author.tag} || ID: ${message.author.id}`,
            message.author.displayAvatarURL({ dynamic: true })
          )
          .setThumbnail(message.guild.iconURL({ dynamic: true }));

        return message.reply({ embeds: [INFO] });
      }

      if (args[0] == "test") {
        if (!server.entrada.status) {
          message.reply(
            `${Emojis.Errado} » O sistema está desativado! Ative-o para realizar o teste.`
          );
        } else {
          this.client.emit("guildMemberAdd", message.member);
          await message.reply(
            `${Emojis.Certo} » O mensagem foi enviada no canal escolhido!`
          );
        }
        return;
      }

      let HELP = new ClientEmbed(author)
        .setColor(process.env.EMBED_COLOR)
        .setAuthor(
          `${this.client.user.username} » Sistema de Welcome/Entrada`,
          message.guild.iconURL({ dynamic: true })
        )
        .addField(
          `${Emojis.Toy} O Sistema se encontra: \`${
            server.entrada.status ? "Ativado" : "Desativado"
          }\``,
          `\`\`\`${server.prefix}entrada msg <Mensagem>\n${server.prefix}entrada canal <Canal>\n${server.prefix}entrada <on/off>\n${server.prefix}entrada set <Mensagem/Embed>\n${server.prefix}entrada help\n${server.prefix}entrada test\`\`\``
        )
        .setFooter(
          `Pedido por: ${message.author.tag} || ID: ${message.author.id}`,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setThumbnail(message.guild.iconURL({ dynamic: true }));

      return message.reply({ embeds: [HELP] });
    });
  }
};
