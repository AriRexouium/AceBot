const { Command } = require('discord.js-commando')
const { oneLine } = require('common-tags')

module.exports = class DisableCommandCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'disable',
      memberName: 'disable',
      group: 'bot-management',
      description: 'Disables a command or command group.',
      details: oneLine`
      The argument must be the name/ID (partial or whole) of a command or command group.
      Only administrators may use this command.
      `,
      examples: [
        'disable util',
        'disable Utility',
        'disable ping'
      ],
      throttling: {
        usages: 2,
        duration: 10
      },
      args: [
        {
          key: 'cmdOrGrp',
          label: 'command/group',
          prompt: 'Which command or group would you like to disable?',
          type: 'command-or-group'
        }
      ],
      guarded: true
    })
  }

  hasPermission (message) {
    if (!message.guild) return this.client.isOwner(message.author)
    return message.member.hasPermission('ADMINISTRATOR') || this.client.isOwner(message.author)
  }

  run (message, args) {
    if (!args.cmdOrGrp.isEnabledIn(message.guild)) {
      return message.reply(
        `the \`${args.cmdOrGrp.name}\` ${args.cmdOrGrp.group ? 'command' : 'group'} is already disabled.`
      )
    }
    if (args.cmdOrGrp.guarded) {
      return message.reply(
        `you cannot disable the \`${args.cmdOrGrp.name}\` ${args.cmdOrGrp.group ? 'command' : 'group'}.`
      )
    }
    args.cmdOrGrp.setEnabledIn(message.guild, false)
    return message.reply(`disabled the \`${args.cmdOrGrp.name}\` ${args.cmdOrGrp.group ? 'command' : 'group'}.`)
  }
}
