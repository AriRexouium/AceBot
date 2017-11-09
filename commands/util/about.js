const { Command } = require('discord.js-commando')
const { stripIndents } = require('common-tags')

module.exports = class AboutCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'about',
      group: 'util',
      memberName: 'about',
      description: 'Displays information about the bot.',
      aliases: ['info'],
      clientPermissions: ['EMBED_LINKS'],
      throttling: {
        usages: 2,
        duration: 10
      },
      guarded: true
    })
  }

  run (message) {
    this.client.generateInvite().then(invite => {
      message.say({
        content: '',
        embed: {
          author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
          footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
          timestamp: new Date(),
          description: (stripIndents`
            __**[AceBot](https://github.com/Aceheliflyer/AceBot)**__
            This is a WIP bot currently being developed by **[Aceheliflyer#0950](http://github.com/Aceheliflyer)**.
            Designed to provide information on demand, AceBot will provide as much information about something as much as possible.
            \n*Click [here](${invite}) to invite me to your server!*
          `),
          color: 0x7289DA
        }
      })
    })
  }
}
