/*
  Inspired From -> https://github.com/Twentysix26/26-Cogs/blob/a8c83790ae4eed543e7c47b871a0d711a9578ca3/rift/rift.py
*/

const { Command } = require('discord.js-commando')
const { escapeMarkdown } = require('discord.js')
const { stripIndents } = require('common-tags')

module.exports = class TunnelCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'tunnel',
      memberName: 'tunnel',
      group: 'tunnel',
      description: 'Send messages to another channel from the bot.',
      args: [
        {
          key: 'id',
          prompt: 'What channel would you like to tunnel to?',
          type: 'string',
          validate: value => {
            if (client.users.get(value) && client.users.get(value).bot !== true) return true
            if (client.channels.get(value) && client.channels.get(value).type === 'text') return true
            return 'that is an invalid text channel or user ID.'
          }
        }
      ]
    })
  }

  async run (message, args) {
    var user = this.client.users.get(args.id)
    var channel = this.client.channels.get(args.id)
    if (user) {
      await user.createDM()
      this.client.temp.tunnels.push({
        user: message.author.id,
        source: message.channel.id,
        destination: user.dmChannel.id,
        cache: []
      })
      return message.say(stripIndents`
        Opened tunnel to **${escapeMarkdown(user.tag)}**!
        Use \`$ <message>\` to escape sending a message.
        You can use \`$exit\` to exit the tunnel.
      `)
    } else {
      this.client.temp.tunnels.push({
        user: message.author.id,
        source: message.channel.id,
        destination: channel.id,
        cache: []
      })
      return message.say(stripIndents`
        Opened tunnel in \`${channel.guild.name}/#${channel.name}\`!
        Use \`$ <message>\` to escape sending a message.
        You can use \`$exit\` to exit the tunnel.

        __**Perms:**__
        \`SEND_MESSAGES\`: ${channel.permissionsFor(this.client.user.id).has('SEND_MESSAGES')}
        \`READ_MESSAGES\`: ${channel.permissionsFor(this.client.user.id).has('READ_MESSAGES')}
        \`EMBED_LINKS\`: ${channel.permissionsFor(this.client.user.id).has('EMBED_LINKS')}
        \`ATTACH_FILES\`: ${channel.permissionsFor(this.client.user.id).has('ATTACH_FILES')}
      `)
    }
  }
}
