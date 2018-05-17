const { Command } = require('discord.js-commando')
const { oneLine } = require('common-tags')

module.exports = class DisableCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'disable',
      memberName: 'disable',
      group: 'development',
      description: 'Disables a command or command group.',
      details: oneLine`
        The argument must be the name/ID (partial or whole) of a command or command group.
        Only server managers may use this command.
      `,
      examples: [
        'disable information',
        'disable Utility',
        'disable ping'
      ],
      userPermissions: [
        'MANAGE_GUILD'
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
          type: 'group|command'
        }
      ],
      guarded: true
    })
  }

  run (message, args) {
    if (!args.cmdOrGrp.isEnabledIn(message.guild, true)) {
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
