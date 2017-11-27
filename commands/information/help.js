const { Command } = require('discord.js-commando')
const { oneLine, stripIndents } = require('common-tags')
const { disambiguation } = require('discord.js-commando')

module.exports = class HelpCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'help',
      memberName: 'help',
      group: 'information',
      description: 'Displays a list of available commands, or detailed information for a specified command.',
      details: oneLine`
      The command may be part of a command name or a whole command name.
      If it isn't specified, all available commands will be listed.
      `,
      aliases: ['commands'],
      examples: [
        'help',
        'help prefix'
      ],
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'command',
          prompt: 'Which command would you like to view the help for?',
          type: 'string',
          default: ''
        }
      ],
      guarded: true
    })
  }

  async run (message, args) { // eslint-disable-line complexity
    const groups = this.client.registry.groups
    const commands = this.client.registry.findCommands(args.command, false, message)
    const showAll = args.command && args.command.toLowerCase() === 'all'
    if (args.command && !showAll) {
      if (commands.length === 1) {
        let help = stripIndents`
          ${oneLine`
            __Command **${commands[0].name}**:__ ${commands[0].description}
            ${commands[0].guildOnly ? ' (Usable only in servers)' : ''}
            ${commands[0].nsfw ? ' (NSFW)' : ''}
          `}

          **Format:** ${message.anyUsage(`${commands[0].name}${commands[0].format ? ` ${commands[0].format}` : ''}`)}
        `
        if (commands[0].aliases.length > 0) help += `\n**Aliases:** ${commands[0].aliases.join(', ')}`
        help += `\n${oneLine`
          **Group:** ${commands[0].group.name}
          (\`${commands[0].groupID}:${commands[0].memberName}\`)
        `}`
        if (commands[0].details) help += `\n**Details:** ${commands[0].details}`
        if (commands[0].examples) help += `\n**Examples:**\n${commands[0].examples.join('\n')}`

        const messages = []
        try {
          messages.push(await message.direct(help))
          if (message.channel.type !== 'dm') messages.push(await message.reply('I sent you a DM with information.'))
        } catch (err) {
          messages.push(await message.reply('I was unable to send you the help DM. You probably have DMs disabled.'))
        }
        return messages
      } else if (commands.length > 1) {
        return message.reply(disambiguation(commands, 'commands'))
      } else {
        return message.reply(
          `I was unable to identify that command. Use ${message.usage(
            null, message.channel.type === 'dm' ? null : undefined, message.channel.type === 'dm' ? null : undefined
          )} to view the list of all commands.`
        )
      }
    } else {
      const messages = []
      try {
        messages.push(await message.direct(stripIndents`
          ${oneLine`
            To run a command in ${message.guild || 'any server'},
            use ${Command.usage('command', message.guild ? message.guild.commandPrefix : null, this.client.user)}.
            For example, ${Command.usage('prefix', message.guild ? message.guild.commandPrefix : null, this.client.user)}.
          `}
          To run a command in this DM, simply use ${Command.usage('command', null, null)} with no prefix.

          Use ${this.usage('<command>', null, null)} to view detailed information about a specific command.
          Use ${this.usage('all', null, null)} to view a list of *all* commands, not just available ones.

          __**${showAll ? 'All commands' : `Available commands in ${message.guild || 'this DM'}`}**__

          ${(showAll ? groups : groups.filter(group => group.commands.some(cmd => cmd.isUsable(message))))
            .map(group => stripIndents`
              __${group.name}__
              ${(showAll ? group.commands : group.commands.filter(cmd => cmd.isUsable(message)))
                .map(cmd => `**${cmd.name}:** ${cmd.description}${cmd.nsfw ? ' (NSFW)' : ''}`).join('\n')
              }
            `).join('\n\n')
          }
        `, { split: true }))
        if (message.channel.type !== 'dm') messages.push(await message.reply('I sent you a DM with information.'))
      } catch (err) {
        messages.push(await message.reply('I was unable to send you the help DM. You probably have DMs disabled.'))
      }
      return messages
    }
  }
}
