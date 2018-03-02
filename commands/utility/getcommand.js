const { Command } = require('discord.js-commando')
const os = require('os')

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

  async run (message, args) {
    var command = args.command
    var code
    if (os.platform() === 'win32') {
      code = code = require(`${process.cwd()}\\commands\\${command.groupID}\\${command.name}.js`).toString()
    } else {
      code = code = require(`${process.cwd()}/commands/${command.groupID}/${command.name}.js`).toString()
    }
    code = clean(code)
    for (let i = 0; i < code.length; i += 1950) {
      message.say(`\`\`\`js\n${code.substring(i, i + 1950)}\n\`\`\``)
    }
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
