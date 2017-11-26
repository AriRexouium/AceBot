const { Command } = require('discord.js-commando')
const { stripIndents } = require('common-tags')

module.exports = class ListGroupsCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'list',
      memberName: 'list',
      group: 'bot-management',
      description: 'Lists all commands or groups.',
      aliases: [
        'show',
        'view',
        'viewall'
      ],
      examples: [
        'list commands',
        'list groups'
      ],
      args: [
        {
          key: 'query',
          prompt: 'What would you like to see (commands, groups)? ',
          type: 'string',
          parse: value => value.toLowerCase(),
          validate: value => ['commands', 'groups'].includes(value)
        }
      ]
    })
  }

  run (message, args) {
    if (args.query === 'commands') {
      return message.say(stripIndents`
      __**Commands**__
      ${this.client.registry.commands.map(command =>
        `**${command.name}:** ${command.isEnabledIn(message.guild) ? 'Enabled' : 'Disabled'}`
      ).join('\n')}
    `)
    }
    return message.say(stripIndents`
      __**Groups**__
      ${this.client.registry.groups.map(group =>
        `**${group.name}:** ${group.isEnabledIn(message.guild) ? 'Enabled' : 'Disabled'}`
      ).join('\n')}
    `)
  }
}
