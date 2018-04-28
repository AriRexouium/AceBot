const { Command } = require('discord.js-commando')
const { oneLine } = require('common-tags')

module.exports = class PingCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'ping',
      memberName: 'ping',
      group: 'information',
      description: 'Checks the bot\'s latency to the server.',
      aliases: [
        'pong'
      ],
      clientPermissions: [
        'EMBED_LINKS'
      ],
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
          color: this.client.getClientColor(message)
        }
      })
      return pingMessage.edit({
        content: '',
        embed: {
          author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
          footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
          timestamp: new Date(),
          description: (oneLine`
          **REST Latency:** \`${pingMessage.createdTimestamp - message.createdTimestamp}ms\`
          ${this.client.ping ? `**| Websocket Latency:** \`${Math.round(this.client.ping)}ms\`` : ''}
          `),
          color: this.client.getClientColor(message)
        }
      })
    } else {
      await message.edit({
        content: '',
        embed: {
          description: 'Pinging...',
          color: this.client.getClientColor(message)
        }
      })
      return message.edit({
        content: '',
        embed: {
          author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
          footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
          timestamp: new Date(),
          description: (oneLine`
          **REST Latency:** \`${message.editedTimestamp - message.createdTimestamp}ms\`
          ${this.client.ping ? `**| Websocket Latency:** \`${Math.round(this.client.ping)}ms\`` : ''}
          `),
          color: this.client.getClientColor(message)
        }
      })
    }
  }
}
