const { Command } = require('discord.js-commando')
const { oneLine } = require('common-tags')

module.exports = class PingCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'ping',
      group: 'util',
      memberName: 'ping',
      description: 'Checks the bot\'s latency to the server.',
      aliases: ['pong'],
      clientPermissions: ['EMBED_LINKS'],
      throttling: {
        usages: 2,
        duration: 10
      }
    })
  }

  async run (message) {
    if (!message.editable) {
      const pingMessage = await message.say({
        content: '',
        embed: {
          description: 'Pinging...',
          color: 0x7289DA
        }
      })
      return pingMessage.edit({
        content: '',
        embed: {
          author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
          footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
          timestamp: new Date(),
          description: (oneLine`
          **Guild Latency:** \`${pingMessage.createdTimestamp - message.createdTimestamp}ms\`
          ${this.client.ping ? `**| API Latency:** \`${Math.round(this.client.ping)}ms\`` : ''}
          `),
          color: 0x7289DA
        }
      })
    } else {
      await message.edit({
        content: '',
        embed: {
          description: 'Pinging...',
          color: 0x7289DA
        }
      })
      return message.edit({
        content: '',
        embed: {
          author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
          footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
          timestamp: new Date(),
          description: (oneLine`
          **Guild Latency:** \`${message.editedTimestamp - message.createdTimestamp}ms\`
          ${this.client.ping ? `**| API Latency:** \`${Math.round(this.client.ping)}ms\`` : ''}
          `),
          color: 0x7289DA
        }
      })
    }
  }
}
