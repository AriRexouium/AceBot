const { Command } = require('discord.js-commando')
const fs = require('fs')

module.exports = class GetCommandCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'getcommand',
      memberName: 'getcommand',
      group: 'utility',
      description: 'Shows a command from the bot.',
      args: [
        {
          key: 'command',
          prompt: 'What command would you like to view?',
          type: 'command'
        }
      ]
    })
  }

  run (message, args) {
    var command = args.command
    fs.readFile(`${__dirname}/../${command.groupID}/${command.name}.js`, { encoding: 'utf-8' }, (error, data) => {
      if (error) {
        message.say(`There was an error getting that command: \`${error.message}\``)
      } else {
        message.say({
          content: data,
          code: 'js',
          split: true
        })
      }
    })
  }
}
