const Emojis = require("../../utils/Emojis");
const Guild = require("../../database/Schemas/Guild");
const Command = require("../../structures/Command.js");
const ClientEmbed = require("../../structures/ClientEmbed.js");

module.exports = class Saida extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "saida";
    this.aliases = ["exit"];
    this.category = "Config";
    this.description =
      "Comando para configurar a mensagem de saida de um usuário!";
    this.usage = "saida";

    this.enabled = true;
    this.guild = true;
  }

  async run(message, args, prefix, author) {
    if (!message.member.hasPermission("MANAGE_GUILD"))
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
        } else if (canal.id === server.saida.channel) {
          return message.reply(
            `${Emojis.Errado} » O canal escolhido já está em uso!`
          );
        } else {
          message.reply(
            `${Emojis.Certo} » O canal **<#${canal.id}>** receberá as mensagens de saida apartir de agora!`
          );
          await Guild.findOneAndUpdate(
            { _id: message.guild.id },
            { $set: { "saida.channel": canal.id } }
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
        } else if (tipo === server.saida.modelo) {
          return message.reply(
            `${Emojis.Errado} » O tipo de mensagem escolhido já está em uso!`
          );
        } else {
          message.reply(
            `${Emojis.Certo} » Agora as mensagens de saida serão no formato ${tipo}!`
          );
          await Guild.findOneAndUpdate(
            { _id: message.guild.id },
            { $set: { "saida.modelo": tipo } }
          );
        }
        if (tipo === "embed") {
          const embedconfig = new ClientEmbed(author)
            .setColor(process.env.EMBED_COLOR)
            .setTitle(`Configuração da Embed`)
            .addField(
              `Os utilitários do \`${server.prefix}saida help\` podem ser aplicados!`,
              `**${server.prefix}saida avatar** - Adiciona o avatar do membro na embed\n**${server.prefix}saida titulo** - Muda o título da embed\n**${server.prefix}saida description** - Define uma mensagem para a embed\n**${server.prefix}saida imagem** - Define uma imagem para a embed!`
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
        } else if (msg === server.saida.msg) {
          return message.reply(
            `${Emojis.Errado} » A mensagem escolhida já está em uso!`
          );
        } else {
          message.reply(
            `${Emojis.Certo} » A mensagem foi alterada para \`\`\`diff\n- ${msg}\`\`\``
          );
          await Guild.findOneAndUpdate(
            { _id: message.guild.id },
            { $set: { "saida.msg": msg } }
          );
        }

        return;
      }

      if (args[0] == "imagem") {
        const imagem = args[1];

        if (server.saida.modelo !== "embed") {
          return message.reply(
            `${Emojis.Errado} » O sistema de saida deve estar em formato \`embed\`!`
          );
        } else if (imagem === server.saida.embedimage) {
          return message.reply(
            `${Emojis.Errado} » A imagem escolhida já se encontra em uso!`
          );
        } else {
          message.reply(`${Emojis.Certo} » Imagem definida com sucesso!`);
          await Guild.findOneAndUpdate(
            { _id: message.guild.id },
            { $set: { "saida.embedimage": imagem } }
          );
        }
        return;
      }

      if (args[0] == "avatar") {
        if (server.saida.modelo !== "embed") {
          return message.reply(
            `${Emojis.Errado} » O sistema de saida deve estar em formato \`embed\`!`
          );
        } else if (server.saida.embedavatar) {
          return message.reply(
            `${Emojis.Errado} » O sistema já se encontra ativo!`
          );
        } else {
          message.reply(`${Emojis.Certo} » O sistema foi ativado com sucesso!`);
          await Guild.findOneAndUpdate(
            { _id: message.guild.id },
            { $set: { "saida.embedavatar": true } }
          );
        }
        return;
      }
      if (args[0] == "titulo") {
        if (server.saida.modelo !== "embed") {
          return message.reply(
            `${Emojis.Errado} » O sistema de saida deve estar em formato \`embed\`!`
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
        } else if (titulo === server.saida.embedtitulo) {
          return message.reply(
            `${Emojis.Errado} » A mensagem escolhida já está em uso!`
          );
        } else {
          message.reply(
            `${Emojis.Certo} » A mensagem foi alterada para \`\`\`diff\n- ${titulo}\`\`\``
          );
          await Guild.findOneAndUpdate(
            { _id: message.guild.id },
            { $set: { "saida.embedtitulo": titulo } }
          );
        }
        return;
      }

      if (args[0] == "description") {
        if (server.saida.modelo !== "embed") {
          return message.reply(
            `${Emojis.Errado} » O sistema de saida deve estar em formato \`embed\`!`
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
        } else if (descrição === server.saida.embeddescription) {
          return message.reply(
            `${Emojis.Errado} » A mensagem escolhida já está em uso!`
          );
        } else {
          message.reply(
            `${Emojis.Certo} » A mensagem foi alterada para \`\`\`diff\n- ${descrição}\`\`\``
          );
          await Guild.findOneAndUpdate(
            { _id: message.guild.id },
            { $set: { "saida.embeddescription": descrição } }
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
        } else if (msg === server.saida.msg) {
          return message.reply(
            `${Emojis.Errado} » A mensagem escolhida já está em uso!`
          );
        } else {
          message.reply(
            `${Emojis.Certo} » A mensagem foi alterada para \`\`\`diff\n- ${msg}\`\`\``
          );
          await Guild.findOneAndUpdate(
            { _id: message.guild.id },
            { $set: { "saida.msg": msg } }
          );
        }

        return;
      }

      if (args[0] == "on") {
        if (server.saida.status) {
          message.reply(`${Emojis.Errado} » O sistema já está ativado!`);
        } else {
          message.reply(
            `${Emojis.Certo} » O sistema foi \`ativado\` com sucesso!`
          );
          await Guild.findOneAndUpdate(
            { _id: message.guild.id },
            { $set: { "saida.status": true } }
          );
        }

        return;
      }

      if (args[0] == "off") {
        if (!server.saida.status) {
          message.reply(`${Emojis.Errado} » O sistema já está desativado!`);
        } else {
          message.reply(
            `${Emojis.Certo} » O sistema foi \`desativado\` com sucesso!`
          );
          await Guild.findOneAndUpdate(
            { _id: message.guild.id },
            { $set: { "saida.status": false } }
          );
        }

        return;
      }

      if (args[0] == "help") {
        let INFO = new ClientEmbed(author)
          .setColor(process.env.EMBED_COLOR)
          .setDescription(
            `Mensagem Definida: \`${server.saida.msg.replace(
              "null",
              "Nenhuma"
            )}\``
          )
          .addField(
            `${Emojis.Smooze} » Informações pré-definidas:`,
            `\`\`\`\n{name} » Nome do usuário\n{total} » Total de membros do servidor\n{guild} » Nome do servidor\n{quebra} » Quebra a linha\`\`\``
          )
          .addField(
            `Estrutura:`,
            `${Emojis.Fone} » Canal Escolhido: <#${server.saida.channel.replace(
              "null",
              "Nenhum"
            )}>\n${Emojis.Pergunta} » Status: ${
              server.saida.status ? "ativado" : "desativado"
            }\n${Emojis.Texto} » Tipo: ${server.saida.modelo.replace(
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

        return;
      }

      if (args[0] == "test") {
        if (!server.saida.status) {
          message.reply(
            `${Emojis.Errado} » O sistema está desativado! Ative-o para realizar o teste.`
          );
        } else {
          this.client.emit("guildMemberAdd", message.member);
          await message.reply(
            `${Emojis.Certo} » A mensagem foi enviada no canal escolhido!`
          );
        }
        return;
      }

      let HELP = new ClientEmbed(author)
        .setColor(process.env.EMBED_COLOR)
        .setAuthor(
          `${this.client.user.username} » Sistema de Exit/Saída`,
          message.guild.iconURL({ dynamic: true })
        )
        .addField(
          `${Emojis.Smooze} O Sistema se encontra: \`${
            server.saida.status ? "Ativado" : "Desativado"
          }\``,
          `\`\`\`${server.prefix}saida msg <Mensagem>\n${server.prefix}saida canal <Canal>\n${server.prefix}saida <on/off>\n${server.prefix}saida set <Mensagem/Embed>\n${server.prefix}saida help\n${server.prefix}saida test\`\`\``
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
