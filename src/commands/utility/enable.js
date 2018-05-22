const { Command } = require('discord.js-commando')
const { oneLine } = require('common-tags')

module.exports = class EnableCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'enable',
      memberName: 'enable',
      group: 'utility',
      description: 'Enables a command or command group.',
      details: oneLine`
      The argument must be the name/ID (partial or whole) of a command or command group.
      Only server managers may use this command.
      `,
      examples: [
        'enable information',
        'enable Utility',
        'enable ping'
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
          prompt: 'Which command or group would you like to enable?',
          type: 'group|command'
        }
      ],
      guarded: true
    })
  }

  run (message, args) {
    const group = args.cmdOrGrp.group
    if (args.cmdOrGrp.isEnabledIn(message.guild, true)) {
      return message.reply(
        `the \`${args.cmdOrGrp.name}\` ${args.cmdOrGrp.group ? 'command' : 'group'} is already enabled${
          group && !group.enabled ? `, but the \`${group.name}\` group is disabled, so it still can't be used` : ''
        }.`
      )
    }
    args.cmdOrGrp.setEnabledIn(message.guild, true)
    return message.reply(
      `enabled the \`${args.cmdOrGrp.name}\` ${group ? 'command' : 'group'}${
        group && !group.enabled ? `, but the \`${group.name}\` group is disabled, so it still can't be used` : ''
      }.`
    )
  }
}
