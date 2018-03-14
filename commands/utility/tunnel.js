/*
  Inspired From -> http://github.com/Twentysix26/26-Cogs/blob/a8c83790ae4eed543e7c47b871a0d711a9578ca3/rift/rift.py
*/

const { Command } = require('discord.js-commando')

module.exports = class RiftCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'tunnel',
      memberName: 'tunnel',
      group: 'utility',
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
      ]
    })
  }

  run (message, args) {
    var channel = this.client.channels.get(args.channel)
    if (channel.type !== 'text') return message.say('Must be a valid text channel.')
    this.client.temp.tunnels.push({
      user: message.author.id,
      source: message.channel.id,
      destination: channel.id
    })
    return message.say(`Opened tunnel in \`${channel.guild.name}/#${channel.name}\``)
  }
}
