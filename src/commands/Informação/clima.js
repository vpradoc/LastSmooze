const weather = require("weather-js");
const Command = require("../../structures/Command.js");
const ClientEmbed = require("../../structures/ClientEmbed.js");
const Emojis = require("../../utils/Emojis");
module.exports = class Clima extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "clima";
    this.aliases = ["tempo"];
    this.category = "Informação";
    this.description =
      "Comando para que eu envie informações do clima de uma cidade!";
    this.usage = "clima <cidade>";

    this.enabled = true;
    this.guild = true;
  }

  async run(message, args, prefix, author) {
    weather.find(
      { search: args.join(" "), degreeType: "C" },
      function (error, result) {
        
        if (error) return;
        if (!args[0]) {
          message.reply(`${Emojis.Errado} » Por favor, escolha uma cidade!`);
        return}
        if (result === undefined || result.length === 0)
          return message.reply(`${Emojis.Errado} » Por favor, escolha uma cidade válida!`);

        var current = result[0].current;
        var location = result[0].location;

        //----//
        const cidade = current.observationpoint
        const image = current.imageURL
        const fuso = location.timezone
        const sensação = current.feelslike+"°"
        const medida = "Celsius"
        const umidade = current.humidity
        const temperatura = current.temperature
        const ventos = current.winddisplay.replace(
          "East",
          "Leste",
          "West",
          "Oeste",
          "North",
          "Norte",
          "South",
          "Sul"
        )

        const weatherinfo = new ClientEmbed(author)
          
         .setTitle(`${Emojis.Bussola} ${cidade}`)
         .setThumbnail(image)
         .addField(`${Emojis.Fuso} Fuso Horário:`,
          fuso,
          true
        )
        .addField(`${Emojis.Nuvem} Sensação Térmica:`, sensação, true)
        .addField(`${Emojis.Celsius} Unidade de Medida:`, medida, true)
        .addField(`${Emojis.Umidade} Umidade do AR:`, umidade, true)
        .addField(
          `${Emojis.Termometro} Temperatura:`,
          temperatura,
          true
        )
        .addField(
          `${Emojis.Ventos} Ventos:`, ventos,
          true
        );
          

        message.reply({ embeds: [weatherinfo] });
      }
    );
  }
};
