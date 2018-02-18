const { Command } = require('discord.js-commando')
const { oneLine } = require('common-tags')

module.exports = class EnableCommandCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'enable',
      memberName: 'enable',
      group: 'bot-management',
      description: 'Enables a command or command group.',
      details: oneLine`
      The argument must be the name/ID (partial or whole) of a command or command group.
      Only server managers may use this command.
      `,
      userPermissions: ['MANAGE_GUILD'],
      examples: [
        'enable information',
        'enable Utility',
        'enable ping'
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
          type: 'command-or-group'
        }
      ],
      guarded: true
    })
  }

  hasPermission (message) {
    if (!message.guild) return this.client.isOwner(message.author)
    return message.member.hasPermission('MANAGE_GUILD') || this.client.isOwner(message.author)
  }

  run (message, args) {
    if (args.cmdOrGrp.isEnabledIn(message.guild)) {
      return message.reply(
        `the \`${args.cmdOrGrp.name}\` ${args.cmdOrGrp.group ? 'command' : 'group'} is already enabled.`
      )
    }
    args.cmdOrGrp.setEnabledIn(message.guild, true)
    return message.reply(`enabled the \`${args.cmdOrGrp.name}\` ${args.cmdOrGrp.group ? 'command' : 'group'}.`)
  }
}
