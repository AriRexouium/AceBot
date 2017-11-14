const { Command } = require('discord.js-commando')
const { stripIndents } = require('common-tags')

module.exports = class ListGroupsCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'groups',
      memberName: 'groups',
      group: 'bot-management',
      description: 'Lists all command groups.',
      details: 'Only administrators may use this command.',
      aliases: ['list-groups', 'show-groups'],
      guarded: true
    })
  }

  hasPermission (message) {
    if (!message.guild) return this.client.isOwner(message.author)
    return message.member.hasPermission('ADMINISTRATOR') || this.client.isOwner(message.author)
  }

  run (message) {
    return message.reply(stripIndents`
      __**Groups**__
      ${this.client.registry.groups.map(grp =>
        `**${grp.name}:** ${grp.isEnabledIn(message.guild) ? 'Enabled' : 'Disabled'}`
      ).join('\n')}
    `)
  }
}
