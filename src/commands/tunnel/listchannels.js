const { Command } = require('discord.js-commando')
const columnify = require('columnify')

module.exports = class ListChannelsCommand extends Command {
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
      ]
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
      code: 'css'
    })
  }
}
