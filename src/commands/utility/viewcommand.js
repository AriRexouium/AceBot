const { Command } = require('discord.js-commando')
const fs = require('fs')
const path = require('path')

module.exports = class ViewCommandCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'viewcommand',
      memberName: 'viewcommand',
      group: 'utility',
      description: 'View an entire command.',
      clientPermissions: [
        'ADD_REACTIONS'
      ],
      throttling: {
        usages: 2,
        duration: 10
      },
      args: [
        {
          key: 'command',
          prompt: 'What command would you like to view?',
          type: 'command'
        }
      ]
    })
  }

  async run (message, args) {
    try {
      var data = await fs.readFileSync(path.join(this.client.registry.commandsPath, `${args.command.groupID}/${args.command.name}.js`)).toString()
    } catch (error) {
      return message.say(`There was an error getting that command: \`${error.name}: ${error.message}\``)
    }
    message.say({ content: data, code: 'js', split: true })
  }
}
