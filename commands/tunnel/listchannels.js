/*
  Inspired From -> http://github.com/Twentysix26/26-Cogs/blob/a8c83790ae4eed543e7c47b871a0d711a9578ca3/rift/rift.py
*/

const { Command } = require('discord.js-commando')
const columnify = require('columnify')

module.exports = class ListChannels extends Command {
  constructor (client) {
    super(client, {
      name: 'listchannels',
      memberName: 'listchannels',
      group: 'tunnel',
      description: 'List the channels in another server.',
      args: [
        {
          key: 'serverID',
          prompt: 'What server would you like to look up?',
          type: 'string',
          validate: value => {
            if (client.guilds.get(value) === undefined) {
              return 'That is not a valid server, please make sure it is a valid server ID.'
            } else {
              return true
            }
          }
        }
      ],
      ownerOnly: true
    })
  }

  run (message, args) {
    var guild = this.client.guilds.get(args.serverID)
    var channels = guild.channels.filter(channel => channel.type === 'text')
    var columnifyChannels = []
    channels.forEach(channel => {
      columnifyChannels.push({ name: channel.name, id: channel.id })
    })
    message.say({
      content: columnify(columnifyChannels, {
        columnSplitter: ' │ '
      }),
      split: true,
      code: ''
    })
  }
}
