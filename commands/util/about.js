const { Command } = require('discord.js-commando')
const { stripIndents } = require('common-tags')
module.exports = class AboutCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'about',
      group: 'util',
      memberName: 'about',
      description: 'Displays information about the bot.',
      clientPermissions: ['EMBED_LINKS'],
      throttling: {
        usages: 2,
        duration: 10
      }
    })
  }

  run (message) {
    message.say({
      content: '',
      embed: {
        author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL },
        description: (stripIndents`
        __**AceBot**__
        This is a WIP bot currently being developed by **Aceheliflyer#0950**.
        This makes use of the [discord.js-commando framework](http://github.com/Gawdl3y/discord.js-commando).
        `),
        timestamp: new Date(),
        color: 0x7289DA
      }
    })
  }
}
