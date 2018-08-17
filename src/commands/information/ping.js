const { Command } = require('discord.js-commando')
const os = require('os')
const moment = require('moment')
require('moment-duration-format')

module.exports = class PingCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'ping',
      memberName: 'ping',
      group: 'information',
      description: 'Checks the bots latency to the server.',
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
          fields: [
            {
              'name': 'REST Latency',
              'value': moment.duration(pingMessage.createdTimestamp - message.createdTimestamp).format('s[s] S[ms]'),
              'inline': true
            },
            {
              'name': 'REST Latency',
              'value': moment.duration(this.client.ping).format('s[s] S[ms]'),
              'inline': true
            },
            {
              'name': 'Client Uptime',
              'value': moment.duration(this.client.uptime).format('y [yr,] M [mo,] w [wk,] d [day,] h [hr,] m [min,] s [sec, and] S [ms]'),
              'inline': false
            },
            {
              'name': 'System Uptime',
              'value': moment.duration(os.uptime() * 1000).format('y [yr,] M [mo,] w [wk,] d [day,] h [hr,] m [min,] s [sec, and] S [ms]'),
              'inline': true
            }
          ],
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
          fields: [
            {
              'name': 'REST Latency',
              'value': moment.duration(message.editedTimestamp - message.createdTimestamp).format('s[s] S[ms]'),
              'inline': true
            },
            {
              'name': 'REST Latency',
              'value': moment.duration(this.client.ping).format('s[s] S[ms]'),
              'inline': true
            },
            {
              'name': 'Client Uptime',
              'value': moment.duration(this.client.uptime).format('y [yr,] M [mo,] w [wk,] d [day,] h [hr,] m [min,] s [sec, and] S [ms]'),
              'inline': false
            },
            {
              'name': 'System Uptime',
              'value': moment.duration(os.uptime() * 1000).format('y [yr,] M [mo,] w [wk,] d [day,] h [hr,] m [min,] s [sec, and] S [ms]'),
              'inline': true
            }
          ],
          color: this.client.getClientColor(message)
        }
      })
    }
  }
}
