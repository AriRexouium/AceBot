const { Command } = require('discord.js-commando')
const { escapeMarkdown, splitMessage } = require('discord.js')
const fs = require('fs')

module.exports = class SeekCommandCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'seekcommand',
      memberName: 'seekcommand',
      group: 'utility',
      description: 'View a command in pages.',
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
      var data = await fs.readFileSync(this.client.registry.resolveCommandPath(args.command.groupID, args.command.name)).toString()
    } catch (error) {
      return message.say(`There was an error getting that command: \`${error.name}: ${error.message}\``)
    }

    var cmdArray = splitMessage(escapeMarkdown(data, true), { maxLength: '1900' })
    if (typeof cmdArray === 'string') { cmdArray = Array(cmdArray) }
    var page = 0

    var cmdMessage = await message.say({ content: cmdArray[0], code: 'js' })
    await cmdMessage.react('◀')
    await cmdMessage.react('❌')
    await cmdMessage.react('▶')

    var filter = (reaction, user) => user.id === message.author.id && ['◀', '❌', '▶'].includes(reaction.emoji.name)
    const collector = cmdMessage.createReactionCollector(filter, { time: 120000 })
    collector.on('collect', emoji => {
      switch (emoji.emoji.name) {
        case '▶':
          if (cmdArray[page + 1] !== undefined) {
            cmdMessage.edit({ content: cmdArray[page + 1], code: 'js' })
            page++
          }
          break
        case '◀':
          if (cmdArray[page - 1] !== undefined) {
            cmdMessage.edit({ content: cmdArray[page - 1], code: 'js' })
            page--
          }
          break
        case '❌':
          collector.stop()
          break
      }
    })
    collector.on('end', () => { cmdMessage.react('✅') })
  }
}
