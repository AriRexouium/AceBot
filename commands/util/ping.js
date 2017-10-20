const { Command } = require('discord.js-commando')
const { stripIndents } = require('common-tags')

module.exports = class PingCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'ping',
      group: 'util',
      memberName: 'ping',
      description: 'Checks the bot\'s latency to the server.',
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
          color: 0x7289DA,
          description: (stripIndents`
            **Guild Latency:** \`${pingMessage.createdTimestamp - message.createdTimestamp}ms\`
            ${this.client.ping ? `**API Latency:** \`${Math.round(this.client.ping)}ms\`` : ''}
          `)
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
          color: 0x7289DA,
          description: (stripIndents`
            **Guild Latency:** \`${message.editedTimestamp - message.createdTimestamp}ms\`
            ${this.client.ping ? `**API Latency:** \`${Math.round(this.client.ping)}ms\`` : ''}
          `)
        }
      })
    }
  }
}
