const {
    MessageEmbed,
    MessageActionRow,
    MessageSelectMenu,
  } = require("discord.js");
  const Command = require("../../structures/Command"),
    emojis = require("../../utils/emojis"),
    moment = require("moment"),
    Util = require("../../utils/Util");
   
  module.exports = class prefix extends Command {
    constructor(client) {
      super(client);
      this.client = client;
   
      this.name = "play";
      this.category = "Music";
      this.description = "Troca o prefixo do bot";
      this.usage = "play <music url>";
      this.aliases = ["p", "tocar", "queueadd"];
   
      this.enabled = true;
      this.guildOnly = true;
      this.ownerOnly = false;
      this.staffOnly = false;
    }
    async run({ msg, args, prefix, author, channel, guild, language }, t) {
      if (!msg.member.voice.channel)
        return msg.reply(`${emojis.Geral.erro} | ${t("errors:novoice")}`);
      if (msg.member.voice.selfDeaf)
        return msg.reply(`${emojis.Geral.erro} | ${t("errors:deaf")}`);
      if (!args.length)
        return msg.reply(`${emojis.Geral.erro} | ${t("errors:nosong")}`);
   
      const search = args.join(" ");
      let res;
      let queue;
      const playerpmsg = `${t("music:play.paused")}`;
      try {
        res = await this.client.manager.search(search, author);
        if (res.loadType === "LOAD_FAILED") throw res.exception;
        if (res.loadType == "NO_MATCHES")
          return msg.reply(`${emojis.Geral.erro} | ${t("music:play.nomatches")}`);
      } catch (err) {
        console.log(err);
        return msg.reply(`${emojis.Geral.erro} | ${t("errors:playerror")}`);
      }
      let player = this.client.manager.players.get(guild.id);
      !player
        ? (player = this.client.manager.create({
            guild: guild.id,
            voiceChannel: msg.member.voice.channel.id,
            textChannel: channel.id,
            selfDeafen: true,
          }))
        : (player = player);
   
      switch (res.loadType) {
        case "PLAYLIST_LOADED":
          queue = res.tracks.map(x => x);
          msg.reply(
            `${emojis.Music.playlist} | ${t("music:play.playlist", {
              playlist: res.playlist.name,
              mscs: res.tracks.length,
              dur: Util.formatTime(res.playlist.duration),
            })}`
          );
          this.play(queue, player, msg.id, channel.id, playerpmsg);
          break;
        case "TRACK_LOADED":
          queue = res.tracks[0];
          msg.reply(
            `${emojis.Music.track} | ${t("music:play.track", {
              track: `${res.tracks[0].title} (By: ${res.tracks[0].author})`,
            })}`
          );
          this.play(queue, player, msg.id, channel.id, playerpmsg);
          break;
        case "SEARCH_RESULT":
          const TRACKS = res.tracks.map(
            x =>
              `[${x.title}  (${x.author})](${x.uri}) | ${Util.formatTime(
                x.duration
              )}`
          );
          var tracks;
          if (TRACKS.length > 10)
            tracks =
              TRACKS.slice(0, 10).join("\n\n") +
              `\n**and more ${TRACKS.length - 10} tracks**`;
          else tracks = TRACKS.join("\n\n");
          const e1 = new MessageEmbed()
            .setTitle(`${emojis.Music.search} | ${t("music:play:search.title")}`)
            .setColor(process.env.color)
            .setTimestamp()
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .setFooter(author.tag, author.displayAvatarURL({ dynamic: true }))
            .setDescription(tracks);
          const Row = new MessageActionRow();
          let options = [];
          for (let i = 0; i < TRACKS.length; i++) {
            const NAME = res.tracks[i].title;
            let name;
            if (NAME.length > 25) name = NAME.slice(0, 22) + `...`;
            else name = NAME;
            options.push({
              label: name,
              description: res.tracks[i].author,
              value: String(i),
            });
          }
          const searchMenu = new MessageSelectMenu()
            .setCustomId("musics")
            .setPlaceholder(t("music:play:search.placeholder"))
            .addOptions(options);
          Row.addComponents(searchMenu);
          const MSG = await msg.reply({ embeds: [e1], components: [Row] });
          const filter = i => i.isSelectMenu() && i.message.id === MSG.id;
          const collector = MSG.createMessageComponentCollector({
            filter,
            time: 30000,
          });
          let collect;
          collector.on("collect", async i => {
            if (i.user.id != author.id) return i.update({ ephemeral: true });
            collect = i;
            queue = res.tracks[parseInt(i.values)];
            await i.reply({
              content: `${emojis.Music.track} | ${t("music:play.track", {
                track: `${res.tracks[i.values].title} (By: ${
                  res.tracks[i.values].author
                })`,
              })}`,
            });
            this.play(queue, player, msg.id, channel.id, playerpmsg);
          });
          collector.on("end", async i => {
            if (collect) return;
            e1.setFooter(
              t("bot:help.end"),
              author.displayAvatarURL({ dynamic: true })
            );
            await MSG.edit({ embeds: [e1], components: [] });
          });
          break;
      }
    }
    async play(queue, player, msg, channel, pmsg) {
      player.queue.add(queue);
      if (player.state != "CONNECTED") player.connect();
      if (!player.playing && !player.paused) player.play();
      if (player.paused) {
        player.pause(false);
        const canal = await this.client.channels.fetch(channel);
        const mensagem = await canal.messages.fetch(msg);
        mensagem.reply(pmsg);
      }
    }
  };