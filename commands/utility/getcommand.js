const { Command } = require('discord.js-commando')
const fs = require('fs')

module.exports = class GetCodeCommand extends Command {
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
    fs.readFile(`${process.cwd()}/commands/${command.groupID}/${command.name}.js`, { encoding: 'utf-8' }, (error, data) => {
      if (error) {
        message.say(`There was an error getting that command: \`${error.message}\``)
      } else {
        data = clean(data.toString())
        message.say({
          content: data,
          code: 'js',
          split: true
        })
      }
    })
  }
}

/**
 * Adds a nospace character to embed breaking text.
 * @param {string} text The text to clean.
 * @return {string} The text after it was cleaned.
 */
var clean = (text) => {
  if (typeof (text) === 'string') {
    return text
      .replace(/`/g, '`' + String.fromCharCode(8203))
      .replace(/@/g, '@' + String.fromCharCode(8203))
      .replace(/#/g, '#' + String.fromCharCode(8203))
  } else {
    return text
  }
}
