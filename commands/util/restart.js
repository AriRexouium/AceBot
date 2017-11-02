const { Command } = require('discord.js-commando')
module.exports = class RestartCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'restart',
      group: 'util',
      memberName: 'restart',
      description: 'Restarts the bot.',
      details: 'Only the bot owner(s) may use this command.',
      clientPermissions: ['EMBED_LINKS'],
      guarded: true
    })
  }
  hasPermission (message) {
    return this.client.isOwner(message.author)
  }
  async run (message) {
    await message.say({
      content: '',
      embed: {
        author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
        footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
        timestamp: new Date(),
        description: ('Now restarting... Please wait...'),
        color: 0x7289DA
      }
    })
    this.client.log.info('Restarting', 'Restart')
    await process.exit()
  }
}
