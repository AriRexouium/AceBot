/*
  Inspired From -> http://github.com/Twentysix26/26-Cogs/blob/a8c83790ae4eed543e7c47b871a0d711a9578ca3/rift/rift.py
*/

const { Command } = require('discord.js-commando')
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
          key: 'channel',
          prompt: 'What channel would you like to tunnel to?',
          type: 'string',
          validate: value => {
            var channel = client.channels.get(value)
            if (channel && channel.type === 'text') {
              return true
            } else {
              return 'That is an invalid channel, please make sure it is a channel ID and a text channel.'
            }
          }
        }
      ],
      ownerOnly: true
    })
  }

  run (message, args) {
    var channel = this.client.channels.get(args.channel)
    if (channel.type !== 'text') return message.say('Must be a valid text channel.')
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
