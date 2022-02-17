const Emojis = require("../../../utils/Emojis");

module.exports = class {
    constructor(client) {
      this.client = client;
    }
  
    async run(oldState, newState) { 

        const guild = newState.guild;
        const user = newState.member;
        const player = this.client.manager.players.get(guild.id);
      
        if (
          !newState.channelID &&
          user.id !== this.client.user.id &&
          player &&
          player.voiceChannelId === oldState.channelID
        ) {

          console.log(`ih ih`)

          if (oldState.channel.members.filter((c) => !c.user.bot).size === 0) {
            player.pause(true);
      
            this.client.channels.cache
              .get(player.textChannelId)
              .send(
                `${Emojis.Microfone} » Vou sair do canal em **2 minutos** caso fique sozinho!`
              );
      
            setTimeout(() => {
              if (!player) return;
      
              if (oldState.channel.members.filter((c) => !c.user.bot).size > 0)
                return;
      
              player.destroy();
      
            }, 2 * 60000);
          }
        } else if (
          newState.channel &&
          newState.channel.members.filter((c) => !c.user.bot).size === 1 &&
          player &&
          player.voiceChannelId === newState.channelID
        ) {
          player.pause(false);
        }

    }}